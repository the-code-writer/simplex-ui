/**
 * Form Builder Adapter
 * 
 * This adapter converts between two JSON formats:
 * 1. React-Form-Builder2 format (flat structure with parentId references)
 * 2. Backend format (nested hierarchical structure)
 * 
 * Key differences handled by this adapter:
 * - React builder uses flat array with parentId references
 * - Backend uses nested objects without parentId
 * - React builder uses Header elements with pageBreak to mark sections
 * - Backend has explicit section objects
 * - React builder has row containers (TwoColumnRow, ThreeColumnRow)
 * - Backend has columnCount property on sections
 */

// ==================== INTERFACES ====================

/**
 * Base export interface for all form elements
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
    alternateForm?: any;
}

export interface ReactRowElement extends ReactFormBuilderBaseElement {
    element: 'TwoColumnRow' | 'ThreeColumnRow';
    field_name: string;
    childItems: (string | null)[];
    isContainer: true;
}

export interface ReactInputElement extends ReactFormBuilderBaseElement {
    element: 'TextInput' | 'NumberInput' | 'TextArea' | 'Dropdown';
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

export interface BackendField extends BaseFormElement {
    fieldtitle: string;
    fieldtype: 'TEXT' | 'NUMBER' | 'SELECT_LIST' | 'TEXT_AREA';
    required: boolean;
    listoptions: BackendOption[];
    fieldorder: number;
}

export interface BackendSection {
    id: string;
    sectionorder: number;
    sectiontitle: string;
    showsectiontitle: boolean;
    columncount: 'ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN';
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
    listsections: BackendSection[];
}

// ==================== ADAPTER CLASS ====================

export class FormBuilderAdapter {
    /**
     * Converts React Form Builder JSON to Backend JSON format
     * @param reactData The React Form Builder data to convert
     * @param formMetadata Additional form metadata for the backend
     * @returns Backend form JSON
     */
    static toBackendFormat(
        reactData: ReactFormBuilderData,
        formMetadata: {
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
        }
    ): BackendForm {
        const backendForm: BackendForm = {
            ...formMetadata,
            description: null,
            version: null,
            listsections: [],
        };

        let currentSection: BackendSection | null = null;
        let currentSubsection: BackendSection | null = null;
        let sectionOrder = 1;

        // First pass: Process headers to create sections
        reactData.task_data.forEach((item) => {
            if (item.element === 'Header' && item.pageBreakBefore) {
                // Finalize previous section if exists
                if (currentSection) {
                    backendForm.listsections.push(currentSection);
                }

                // Create new section
                currentSection = {
                    id: this.generateId(),
                    sectionorder: sectionOrder++,
                    sectiontitle: item.content,
                    showsectiontitle: true,
                    columncount: 'THREE_COLUMN', // Default, will be updated by rows
                    listfields: [],
                    listsubsection: [],
                };

                currentSubsection = null; // Reset current subsection
            }
        });

        // Add the last section if it exists
        if (currentSection) {
            backendForm.listsections.push(currentSection);
        }

        // Second pass: Process rows and fields
        currentSection = null;
        let currentRow: ReactRowElement | null = null;

        reactData.task_data.forEach((item) => {
            if (item.element === 'Header' && item.pageBreakBefore) {
                // Find the corresponding section in backend form
                currentSection = backendForm.listsections.find(
                    (sec) => sec.sectiontitle === item.content
                ) || null;
                currentRow = null;
            } else if (
                (item.element === 'TwoColumnRow' || item.element === 'ThreeColumnRow') &&
                currentSection
            ) {
                // Create a new subsection for the row
                const columnCount =
                    item.element === 'TwoColumnRow' ? 'TWO_COLUMN' : 'THREE_COLUMN';

                const newSubsection: BackendSection = {
                    id: this.generateId(),
                    sectionorder: (currentSection.listsubsection.length || 0) + 1,
                    sectiontitle: 'string', // Placeholder as per backend example
                    showsectiontitle: false,
                    columncount: columnCount,
                    listfields: [],
                    listsubsection: [],
                };

                currentSection.listsubsection.push(newSubsection);
                currentSubsection = newSubsection;
                currentRow = item;
            } else if (
                currentSubsection &&
                this.isInputElement(item) &&
                currentRow &&
                currentRow.childItems.includes(item.id)
            ) {
                // Add field to current subsection
                const fieldType:any = this.mapFieldType(item.element);
                const field: BackendField = {
                    id: this.generateId(),
                    fieldtitle: item.label,
                    fieldtype: fieldType,
                    required: item.required || false,
                    listoptions: item.element === 'Dropdown' ? this.mapOptions(item.options || []) : [],
                    fieldorder: currentSubsection.listfields.length + 1,
                };

                currentSubsection.listfields.push(field);
            }
        });

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

        backendData.listsections.forEach((section) => {
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
                    subsection.columncount === 'TWO_COLUMN' ? 'TwoColumnRow' : 'ThreeColumnRow';
                const rowId = this.generateId();
                const childItems: string[] = [];

                // Create row element
                const row: ReactRowElement = {
                    id: rowId,
                    element: rowType,
                    text: `${rowType === 'TwoColumnRow' ? 'Two' : 'Three'} Columns Row`,
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
                };

                reactData.push(row);
                parentIndexCounter++;

                // Process fields in subsection
                subsection.listfields.forEach((field, index) => {
                    const fieldId = this.generateId();
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
        ].includes(item.element);
    }

    private static mapFieldType(
        elementType: string
    ): 'TEXT' | 'NUMBER' | 'SELECT_LIST' | 'TEXT_AREA' {
        switch (elementType) {
            case 'TextInput':
                return 'TEXT';
            case 'NumberInput':
                return 'NUMBER';
            case 'Dropdown':
                return 'SELECT_LIST';
            case 'TextArea':
                return 'TEXT_AREA';
            default:
                return 'TEXT';
        }
    }

    private static mapOptions(
        options: Array<{ value: string; text: string; key: string }>
    ): BackendOption[] {
        return options.map((opt) => ({
            id: this.generateId(),
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
}