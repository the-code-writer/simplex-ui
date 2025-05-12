// ==================== INTERFACES ====================

/**
 * Base interface for all form elements
 */
export interface BaseFormElement {
    id: string;
    required?: boolean;
}

/**
 * React Form Builder Interfaces
 */
export interface ReactFormBuilderBaseElement extends BaseFormElement {
    element: string;
    text: string;
    canHavePageBreakBefore?: boolean;
    canHaveAlternateForm?: boolean;
    canHaveDisplayHorizontal?: boolean;
    canHaveOptionCorrect?: boolean;
    canHaveOptionValue?: boolean;
    canPopulateFromApi?: boolean;
    dirty?: boolean;
}

export interface ReactHeaderElement extends ReactFormBuilderBaseElement {
    element: 'Header';
    static: boolean;
    bold: boolean;
    italic: boolean;
    content: string;
    pageBreakBefore: boolean;
    alternateForm?: boolean;
}

export interface ReactRowElement extends ReactFormBuilderBaseElement {
    element: 'TwoColumnRow' | 'ThreeColumnRow' | 'MultiColumnRow';
    field_name: string;
    childItems: (string | null)[];
    isContainer: true;
    col_count?: number; // For MultiColumnRow
}

export interface ReactInputElement extends ReactFormBuilderBaseElement {
    element: 'TextInput' | 'NumberInput' | 'TextArea' | 'Dropdown' |
    'RadioButtons' | 'Checkboxes' | 'DatePicker' | 'PhoneNumber' |
    'EmailInput';
    canHaveAnswer: boolean;
    field_name: string;
    label: string;
    parentId: string;
    parentIndex: number;
    col?: number;
    options?: Array<{
        value: string;
        text: string;
        key: string;
    }>;
    // DatePicker specific
    dateFormat?: string;
    timeFormat?: string;
    showTimeSelect?: boolean;
    // Checkboxes specific
    inline?: boolean;
}

export type ReactFormElement = ReactHeaderElement | ReactRowElement | ReactInputElement;

export interface ReactFormBuilderData {
    task_data: ReactFormElement[];
}

/**
 * Backend Form Interfaces
 */
export interface BackendOption {
    id: string;
    option: string;
}

export type BackendFieldType = 'TEXT' | 'NUMBER' | 'SELECT_LIST' | 'TEXT_AREA' |
    'RADIO' | 'CHECKBOX' | 'DATE' | 'PHONE' | 'EMAIL';

export interface BackendField extends BaseFormElement {
    fieldtitle: string;
    fieldtype: BackendFieldType;
    required: boolean;
    listoptions: BackendOption[];
    fieldorder: number;
}

export interface BackendSection {
    id: string;
    sectionorder: number;
    sectiontitle: string;
    showsectiontitle: boolean;
    columncount: 'ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN' | 'MULTI_COLUMN';
    listfields: BackendField[];
    listsubsection: BackendSection[];
}

export interface BackendForm {
    description: string | null;
    id: string;
    title: string;
    datecreated: string;
    createdby: {
        firstname: string;
        id: string;
        middlename: string | null;
        lastname: string;
        enabled: boolean;
    };
    version: string | null;
    listdocumentsections: BackendSection[];
}

// SAVE DATA

export interface FieldValue {
    id: string;
    name: string;
    custom_name: string;
    value: string;
}

export interface SaveDocumentRequest {
    title: string;
    description: string;
    templateid: string;
    workflowid: string;
    listfieldvalues: Array<{
        templatefieldid: string;
        value: string;
    }>;
}

// ==================== ADAPTER CLASS ====================

export class FormBuilderAdaptor {
    /**
     * Converts React Form Builder JSON to Backend JSON format
     * @param reactData The React Form Builder data to convert
     * @param formMetadata Additional form metadata for the backend
     * @returns Backend form JSON
     */
    static toBackendFormat(
        reactData: ReactFormBuilderData,
        formMetadata: {
            id?: string;
            title: string;
            description: string;
            workflowid: string;
            metadata: string;
            version: string;
            datecreated?: string;
            createdby?: {
                firstname: string;
                id: string;
                middlename: string | null;
                lastname: string;
                enabled: boolean;
            };
        }
    ): BackendForm {
        const backendForm: BackendForm = {
            ...formMetadata,
            listdocumentsections: [],
        };

        let currentSection: BackendSection | null = null;
        let currentSubsection: BackendSection | null = null;
        let sectionOrder = 1;

        // First pass: Create all sections based on headers
        const sections: BackendSection[] = [];
        reactData.task_data.forEach((item) => {
            if (item.element === 'Header') {
                const newSection: BackendSection = {
                    id: item.id || this.generateId(),
                    sectionorder: sectionOrder++,
                    sectiontitle: item.content,
                    showsectiontitle: true,
                    columncount: 'THREE_COLUMN', // Default, will be updated by rows
                    listfields: [],
                    listsubsection: [],
                };
                sections.push(newSection);
            }
        });

        // Second pass: Process all non-header elements
        reactData.task_data.forEach((item) => {
            if (item.element === 'Header') {
                // Find the current section
                currentSection = sections.find(sec => sec.id === item.id) || null;
                currentSubsection = null;
            } else if (currentSection) {
                if (item.element === 'TwoColumnRow' ||
                    item.element === 'ThreeColumnRow' ||
                    item.element === 'MultiColumnRow') {

                    // Create new subsection for the row
                    const columnCount =
                        item.element === 'TwoColumnRow' ? 'TWO_COLUMN' :
                            item.element === 'ThreeColumnRow' ? 'THREE_COLUMN' : 'MULTI_COLUMN';

                    currentSubsection = {
                        id: item.id || this.generateId(),
                        sectionorder: (currentSection.listsubsection.length || 0) + 1,
                        sectiontitle: 'row', // Placeholder
                        showsectiontitle: false,
                        columncount: columnCount,
                        listfields: [],
                        listsubsection: [],
                    };

                    currentSection.listsubsection.push(currentSubsection);
                } else if (currentSubsection && this.isInputElement(item)) {
                    // Check if this item belongs to the current subsection
                    const parentRow = reactData.task_data.find(
                        el => el.element.includes('ColumnRow') &&
                            (el as ReactRowElement).childItems.includes(item.id)
                    ) as ReactRowElement | undefined;

                    if (parentRow && currentSection.listsubsection.some(
                        sub => sub.id === parentRow.id)) {

                        // Add field to current subsection
                        const fieldType = this.mapFieldType(item.element);
                        const field: BackendField = {
                            id: item.id || this.generateId(),
                            fieldtitle: item.label || item.text,
                            fieldtype: fieldType,
                            required: item.required || false,
                            listoptions: (item.element === 'Dropdown' ||
                                item.element === 'RadioButtons' ||
                                item.element === 'Checkboxes')
                                ? this.mapOptions(item.options || [])
                                : [],
                            fieldorder: currentSubsection.listfields.length + 1,
                        };

                        currentSubsection.listfields.push(field);
                    }
                }
            }
        });

        backendForm.listdocumentsections = sections;
        return backendForm;
    }

    /**
     * Converts Backend JSON to React Form Builder format
     * @param backendData The backend form data to convert
     * @returns React Form Builder JSON
     */
    static toReactFormat(backendData: BackendForm): ReactFormBuilderData {
        const reactData: ReactFormElement[] = [];
        let parentIndexCounter = 0;

        backendData.listdocumentsections.forEach((section) => {
            // Add header for section
            const header: ReactHeaderElement = {
                id: this.generateId(),
                element: 'Header',
                text: 'Header Text',
                static: true,
                required: false,
                bold: false,
                italic: false,
                content: section.sectiontitle,
                canHavePageBreakBefore: true,
                canHaveAlternateForm: true,
                canHaveDisplayHorizontal: true,
                canHaveOptionCorrect: true,
                canHaveOptionValue: true,
                canPopulateFromApi: true,
                pageBreakBefore: true,
                dirty: false,
                alternateForm: true,
            };

            reactData.push(header);
            parentIndexCounter++;

            // Process subsections (rows)
            section.listsubsection.forEach((subsection) => {
                const rowType =
                    subsection.columncount === 'TWO_COLUMN' ? 'TwoColumnRow' :
                        subsection.columncount === 'THREE_COLUMN' ? 'ThreeColumnRow' : 'MultiColumnRow';

                const rowId = this.generateId();
                const childItems: string[] = [];

                // Create row element
                const row: ReactRowElement = {
                    id: rowId,
                    element: rowType,
                    text: `${rowType === 'TwoColumnRow' ? 'Two' :
                        rowType === 'ThreeColumnRow' ? 'Three' : 'Multi'} Columns Row`,
                    required: false,
                    canHavePageBreakBefore: true,
                    canHaveAlternateForm: true,
                    canHaveDisplayHorizontal: true,
                    canHaveOptionCorrect: true,
                    canHaveOptionValue: true,
                    canPopulateFromApi: true,
                    field_name: `${rowType.toLowerCase()}_${rowId}`,
                    childItems,
                    isContainer: true,
                    ...(rowType === 'MultiColumnRow' && { col_count: 5 }) // Default for multi-column
                };

                reactData.push(row);
                parentIndexCounter++;

                // Process fields in subsection
                subsection.listfields.forEach((field, index) => {
                    const fieldId = field.id || this.generateId();
                    childItems.push(fieldId);

                    const reactElement = this.createReactInputElement(
                        field,
                        fieldId,
                        rowId,
                        parentIndexCounter,
                        index
                    );

                    reactData.push(reactElement);
                    parentIndexCounter++;
                });
            });
        });

        return { task_data: reactData };
    }

    // ==================== HELPER METHODS ====================

    private static isInputElement(
        item: ReactFormElement
    ): item is ReactInputElement {
        return [
            'TextInput',
            'NumberInput',
            'TextArea',
            'Dropdown',
            'RadioButtons',
            'Checkboxes',
            'DatePicker',
            'PhoneNumber',
            'EmailInput'
        ].includes(item.element);
    }

    private static mapFieldType(
        elementType: string
    ): BackendFieldType {
        switch (elementType) {
            case 'TextInput':
                return 'TEXT';
            case 'NumberInput':
                return 'NUMBER';
            case 'Dropdown':
                return 'SELECT_LIST';
            case 'TextArea':
                return 'TEXT_AREA';
            case 'RadioButtons':
                return 'RADIO';
            case 'Checkboxes':
                return 'CHECKBOX';
            case 'DatePicker':
                return 'DATE';
            case 'PhoneNumber':
                return 'PHONE';
            case 'EmailInput':
                return 'EMAIL';
            default:
                return 'TEXT';
        }
    }

    private static mapOptions(
        options: Array<{ value: string; text: string; key: string }>
    ): BackendOption[] {
        return options.map((opt) => ({
            id: opt.key || this.generateId(),
            option: opt.text,
        }));
    }

    private static createReactInputElement(
        field: BackendField,
        id: string,
        parentId: string,
        parentIndex: number,
        col: number
    ): ReactInputElement {
        const baseElement = {
            id,
            required: field.required,
            canHaveAnswer: true,
            canHavePageBreakBefore: true,
            canHaveAlternateForm: true,
            canHaveDisplayHorizontal: true,
            canHaveOptionCorrect: true,
            canHaveOptionValue: true,
            canPopulateFromApi: true,
            field_name: `${field.fieldtype.toLowerCase()}_${id}`,
            label: field.fieldtitle,
            parentId,
            parentIndex,
            col,
            dirty: false,
        };

        switch (field.fieldtype) {
            case 'TEXT':
                return {
                    ...baseElement,
                    element: 'TextInput',
                    text: 'Text Input',
                };
            case 'NUMBER':
                return {
                    ...baseElement,
                    element: 'NumberInput',
                    text: 'Number Input',
                };
            case 'SELECT_LIST':
                return {
                    ...baseElement,
                    element: 'Dropdown',
                    text: 'Dropdown',
                    options: field.listoptions.map((opt) => ({
                        value: opt.option.toLowerCase().replace(/\s+/g, '_'),
                        text: opt.option,
                        key: `dropdown_option_${this.generateId()}`,
                    })),
                };
            case 'TEXT_AREA':
                return {
                    ...baseElement,
                    element: 'TextArea',
                    text: 'Multi-line Input',
                };
            case 'RADIO':
                return {
                    ...baseElement,
                    element: 'RadioButtons',
                    text: 'Multiple Choice',
                    options: field.listoptions.map((opt) => ({
                        value: opt.option.toLowerCase().replace(/\s+/g, '_'),
                        text: opt.option,
                        key: `radiobuttons_option_${this.generateId()}`,
                    })),
                };
            case 'CHECKBOX':
                return {
                    ...baseElement,
                    element: 'Checkboxes',
                    text: 'Checkboxes',
                    inline: true,
                    options: field.listoptions.map((opt) => ({
                        value: opt.option.toLowerCase().replace(/\s+/g, '_'),
                        text: opt.option,
                        key: `checkboxes_option_${this.generateId()}`,
                    })),
                };
            case 'DATE':
                return {
                    ...baseElement,
                    element: 'DatePicker',
                    text: 'Date',
                    dateFormat: 'MM/dd/yyyy',
                    timeFormat: 'hh:mm aa',
                    showTimeSelect: false,
                };
            case 'PHONE':
                return {
                    ...baseElement,
                    element: 'PhoneNumber',
                    text: 'Phone Number',
                };
            case 'EMAIL':
                return {
                    ...baseElement,
                    element: 'EmailInput',
                    text: 'Email',
                };
            default:
                return {
                    ...baseElement,
                    element: 'TextInput',
                    text: 'Text Input',
                };
        }
    }

    private static generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Prepares form data for saving to the backend
     * @param formTitle The title of the form/document
     * @param formDescription Description of the form/document
     * @param templateId The ID of the template being used
     * @param workflowId The ID of the workflow (if applicable)
     * @param fieldValues Array of field values from the form
     * @returns Properly formatted save request object
     */
    static prepareSaveRequest(
        formTitle: string,
        formDescription: string,
        templateId: string,
        workflowId: string,
        fieldValues: FieldValue[]
    ): SaveDocumentRequest {
        return {
            title: formTitle,
            description: formDescription,
            templateid: templateId,
            workflowid: workflowId,
            listfieldvalues: fieldValues.map((field) => ({
                templatefieldid: field.id,
                value: field.value,
            })),
        };
    }

    /**
     * Helper method to extract field values from form data
     * @param formData The form data object
     * @returns Array of field values with their IDs and values
     */
    static extractFieldValues(formData: any): FieldValue[] {
        const fieldValues: FieldValue[] = [];

        // Example implementation - adjust based on your actual form structure
        for (const fieldName in formData) {
            if (formData.hasOwnProperty(fieldName)) {
                // Extract the ID from the field name or generate a new one
                const id = this.extractIdFromFieldName(fieldName) || this.generateId();

                fieldValues.push({
                    id,
                    name: fieldName,
                    custom_name: fieldName,
                    value: formData[fieldName]
                });
            }
        }

        return fieldValues;
    }

    private static extractIdFromFieldName(fieldName: string): string | null {
        // Implement logic to extract ID from your field names
        // Example: if field names are like "text_d3ea6d30-fe89-4e43-9e06-c1e685f30f59"
        const parts = fieldName.split('_');
        const potentialId = parts[parts.length - 1];

        // Check if the last part looks like a UUID
        if (potentialId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return potentialId;
        }
        return null;
    }
}

/* / ==================== USAGE EXAMPLE ====================

// Example usage for parsing the form JSON
const formJson = require('./FORM.json'); // Or your actual import method
const formData: ReactFormBuilderData = {
    task_data: formJson as ReactFormElement[]
};

// Example usage for saving document data
const formTitle = "Account Registration";
const formDescription = "Policy holder registration form";
const templateId = "0000-0000-0000-0000";
const workflowId = "0000-0000-0000-0000";

// Sample field values (would come from your form submission)
const fieldValues: FieldValue[] = [
    {
        id: "d2532870-fed9-4764-935c-b0f40cdf2f87",
        name: "select_list_d2532870-fed9-4764-935c-b0f40cdf2f87",
        custom_name: "select_list_d2532870-fed9-4764-935c-b0f40cdf2f87",
        value: "north,_east"
    },
    // ... other field values
];

const saveRequest = FormBuilderAdaptor.prepareSaveRequest(
    formTitle,
    formDescription,
    templateId,
    workflowId,
    fieldValues
);

console.log('Save Request:', JSON.stringify(saveRequest, null, 2));

*/