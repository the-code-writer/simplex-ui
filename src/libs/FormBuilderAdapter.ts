enum ColumnCount {
    ONE_COLUMN = "ONE_COLUMN",
    TWO_COLUMN = "TWO_COLUMN",
    THREE_COLUMN = "THREE_COLUMN",
    FOUR_COLUMN = "FOUR_COLUMN",
}

enum FieldType {
    HEADER = "HEADER",
    LABEL = "LABEL",
    PARAGRAPH = "PARAGRAPH",
    LINE_BREAK = "LINE_BREAK",
    DROPDOWN = "DROPDOWN",
    TAGS = "TAGS",
    CHECKBOXES = "CHECKBOXES",
    RADIO_BUTTONS = "RADIO_BUTTONS",
    TEXT_INPUT = "TEXT_INPUT",
    EMAIL_INPUT = "EMAIL_INPUT",
    NUMBER_INPUT = "NUMBER_INPUT",
    PHONE_NUMBER = "PHONE_NUMBER",
    TEXT_AREA = "TEXT_AREA",
    IMAGE = "IMAGE",
    RATING = "RATING",
    DATE_PICKER = "DATE_PICKER",
    SIGNATURE = "SIGNATURE",
    HYPER_LINK = "HYPER_LINK",
    DOWNLOAD = "DOWNLOAD",
    RANGE = "RANGE",
    CAMERA = "CAMERA",
    FILE_UPLOAD = "FILE_UPLOAD",
    SELECT_LIST = "SELECT_LIST",
    DATETIME = "DATETIME",
    DATE = "DATE",
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    NUMERIC = "NUMERIC",
    CHECKBOX = "CHECKBOX",
    CHECKBOX_MULTIPLE = "CHECKBOX_MULTIPLE",
    RADIOBUTTON = "RADIOBUTTON"
}

interface DocumentField {
    fieldtypeid: FieldType;
    title: string;
    required: boolean;
    fieldorder: number;
    listoptions: Array<{ option: string }>;
}

interface DocumentSubSection {
    id: string;
    title: string;
    description: string;
    sectionorder: number;
    showsectiontitle: boolean;
    columncount: ColumnCount;
    listdocumentfields: DocumentField[];
}

interface DocumentSection {
    id: string;
    sectionorder: number;
    title: string;
    showsectiontitle: boolean;
    columncount: ColumnCount;
    listfields: any[]; // Not used in this conversion
    listsubsection: DocumentSubSection[];
}

interface FormBuilderElement {
    id: string;
    element: string;
    text?: string;
    static?: boolean;
    required?: boolean;
    content?: string;
    isContainer?: boolean;
    childItems?: string[];
    col?: number;
    label?: string;
    options?: Array<{ value: string; text: string }>;
    parentId?: string;
    parentIndex?: number;
}

interface FormData {
    listdocumentsections: DocumentSection[];
}

export class FormBuilderAdapter {
    private elements?: FormBuilderElement[];
    private elementsById?: Map<string, FormBuilderElement>;
    private currentSection: DocumentSection | null = null;
    private currentSubSection: DocumentSubSection | null = null;
    private sectionOrder = 0;
    private subSectionOrder = 0;

    constructor() {
    }

    public convert(formBuilderJson: FormBuilderElement[]): FormData {
        this.elements = formBuilderJson;
        this.elementsById = new Map(formBuilderJson.map(item => [item.id, item]));
        const sections: DocumentSection[] = [];

        for (const element of this.elements) {
            if (element.element === "Header" && element.content) {
                // Start a new section
                this.sectionOrder++;
                this.subSectionOrder = 0;

                this.currentSection = {
                    id: element.id,
                    sectionorder: this.sectionOrder,
                    title: element.content,
                    showsectiontitle: true,
                    columncount: ColumnCount.ONE_COLUMN, // Default, can be overridden by containers
                    listfields: [],
                    listsubsection: []
                };

                sections.push(this.currentSection);
            } else if (this.currentSection && element.isContainer) {
                // Start a new subsection (container)
                this.subSectionOrder++;

                const columnCount = this.getColumnCount(element.element);
                const containerTitle = `Container for ${element.childItems?.length || 0} fields`;

                this.currentSubSection = {
                    id: element.id,
                    title: containerTitle,
                    description: containerTitle,
                    sectionorder: this.subSectionOrder,
                    showsectiontitle: false,
                    columncount: columnCount,
                    listdocumentfields: []
                };

                this.currentSection.listsubsection.push(this.currentSubSection);

                // Add child items to the subsection
                if (element.childItems) {
                    for (const childId of element.childItems) {
                        const childElement = this.elementsById.get(childId);
                        if (childElement) {
                            const field = this.convertToDocumentField(childElement);
                            if (field) {
                                this.currentSubSection.listdocumentfields.push(field);
                            }
                        }
                    }

                    // Sort fields by their col property (fieldorder)
                    this.currentSubSection.listdocumentfields.sort((a, b) => (a.fieldorder - b.fieldorder));
                }
            }
        }

        return { listdocumentsections: sections };
    }

    private getColumnCount(elementType: string): ColumnCount {
        switch (elementType) {
            case "OneColumnRow":
                return ColumnCount.ONE_COLUMN;
            case "TwoColumnRow":
                return ColumnCount.TWO_COLUMN;
            case "ThreeColumnRow":
                return ColumnCount.THREE_COLUMN;
            case "FourColumnRow":
                return ColumnCount.FOUR_COLUMN;
            case "FiveColumnRow":
                return ColumnCount.FOUR_COLUMN;
            case "MultiColumnRow":
                // Check if col_count is defined in the element (not in the provided JSON)
                // Default to FIVE_COLUMN as seen in the example
                return ColumnCount.FOUR_COLUMN;
            default:
                return ColumnCount.TWO_COLUMN;
        }
    }

    private convertToDocumentField(element: FormBuilderElement): DocumentField | null {
        const fieldType = this.mapFieldType(element.element);
        if (!fieldType) return null;

        return {
            fieldtypeid: fieldType,
            title: element.label || element.text || "",
            required: element.required || false,
            fieldorder: element.col || 0,
            listoptions: element.options
                ? element.options.map(opt => ({ option: opt.text }))
                : []
        };
    }

    private mapFieldType(elementType: string): FieldType | null {
        switch (elementType) {
            case "Header":
                return FieldType.HEADER;
            case "TextInput":
                return FieldType.TEXT_INPUT;
            case "NumberInput":
                return FieldType.NUMBER_INPUT;
            case "EmailInput":
                return FieldType.EMAIL_INPUT;
            case "PhoneNumber":
                return FieldType.PHONE_NUMBER;
            case "TextArea":
                return FieldType.TEXT_AREA;
            case "Dropdown":
                return FieldType.DROPDOWN;
            case "Checkboxes":
                return FieldType.CHECKBOXES;
            case "RadioButtons":
                return FieldType.RADIO_BUTTONS;
            case "DatePicker":
                return FieldType.DATE_PICKER;
            default:
                return FieldType.TEXT; // Default fallback
        }
    }

    public parseFormData(serverData: FormData): FormBuilderElement[] {
        const formElements: FormBuilderElement[] = [];

        for (const section of serverData.listdocumentsections) {
            // Add the header element for the section
            const headerElement: FormBuilderElement = {
                id: section.id,
                element: "Header",
                text: section.sectiontitle,
                static: true,
                required: false,
                bold: true,
                italic: false,
                content: section.sectiontitle,
                canHavePageBreakBefore: true,
                canHaveAlternateForm: true,
                canHaveDisplayHorizontal: true,
                canHaveOptionCorrect: true,
                canHaveOptionValue: true,
                canPopulateFromApi: true,
                dirty: false,
                pageBreakBefore: false
            };

            formElements.push(headerElement);

            // Process subsections (containers)
            for (const subsection of section.listsubsection) {
                const containerType = this.getContainerType(subsection.columncount);
                const childItems: string[] = [];

                // Create container element
                const containerElement: FormBuilderElement = {
                    id: subsection.id,
                    element: containerType,
                    text: `${containerType.replace('Row', '')} Row`,
                    required: false,
                    canHavePageBreakBefore: true,
                    canHaveAlternateForm: true,
                    canHaveDisplayHorizontal: true,
                    canHaveOptionCorrect: true,
                    canHaveOptionValue: true,
                    canPopulateFromApi: true,
                    field_name: this.generateFieldName(subsection.id, containerType),
                    childItems: childItems,
                    isContainer: true
                };
                formElements.push(containerElement);

                // Process fields within the subsection
                for (const field of subsection.listfields) {
                    const fieldElement = this.convertToFormBuilderElement(field, subsection.id);
                    if (fieldElement) {
                        fieldElement.parentId = subsection.id;
                        fieldElement.parentIndex = subsection.sectionorder;
                        childItems.push(fieldElement.id);
                        formElements.push(fieldElement);
                    }
                }
            }
        }

        return formElements;
    }

    private getContainerType(columnCount: ColumnCount): string {
        switch (columnCount) {
            case ColumnCount.TWO_COLUMN:
                return "TwoColumnRow";
            case ColumnCount.THREE_COLUMN:
                return "ThreeColumnRow";
            case ColumnCount.FOUR_COLUMN:
            case ColumnCount.FIVE_COLUMN:
            case ColumnCount.SIX_COLUMN:
                return "MultiColumnRow";
            default:
                return "TwoColumnRow"; // Default fallback
        }
    }

    private convertToFormBuilderElement(field: DocumentField, parentId: string): FormBuilderElement | null {
        const elementType = this.mapToFormBuilderElementType(field.fieldtypeid);
        if (!elementType) return null;

        const id = field.id || this.generateId();
        const fieldName = this.generateFieldName(id, elementType);

        const baseElement: FormBuilderElement = {
            id: id,
            element: elementType,
            text: `${elementType}`,
            required: field.required || false,
            canHaveAnswer: true,
            canHavePageBreakBefore: true,
            canHaveAlternateForm: true,
            canHaveDisplayHorizontal: true,
            canHaveOptionCorrect: true,
            canHaveOptionValue: true,
            canPopulateFromApi: true,
            field_name: fieldName,
            label: field.fieldtitle,
            col: field.fieldorder,
            dirty: false
        };

        // Add type-specific properties
        switch (field.fieldtypeid) {
            case FieldType.DROPDOWN:
            case FieldType.CHECKBOXES:
            case FieldType.RADIO_BUTTONS:
                return {
                    ...baseElement,
                    options: field.listoptions.map(opt => ({
                        value: opt.option.toLowerCase().replace(/\s+/g, '_'),
                        text: opt.option,
                        key: `option_${this.generateId()}`
                    }))
                };
            case FieldType.DATE_PICKER:
                return {
                    ...baseElement,
                    readOnly: false,
                    defaultToday: false,
                    dateFormat: "MM/dd/yyyy",
                    timeFormat: "hh:mm aa",
                    showTimeSelect: false,
                    showTimeSelectOnly: false,
                    showTimeInput: false
                };
            case FieldType.TEXT_AREA:
                return {
                    ...baseElement,
                    element: "TextArea"
                };
            default:
                return baseElement;
        }
    }

    private mapToFormBuilderElementType(fieldType: FieldType): string | null {
        switch (fieldType) {
            case FieldType.TEXT_INPUT:
                return "TextInput";
            case FieldType.NUMBER_INPUT:
                return "NumberInput";
            case FieldType.EMAIL_INPUT:
                return "EmailInput";
            case FieldType.PHONE_NUMBER:
                return "PhoneNumber";
            case FieldType.TEXT_AREA:
                return "TextArea";
            case FieldType.DROPDOWN:
                return "Dropdown";
            case FieldType.CHECKBOXES:
                return "Checkboxes";
            case FieldType.RADIO_BUTTONS:
                return "RadioButtons";
            case FieldType.DATE_PICKER:
                return "DatePicker";
            case FieldType.HEADER:
                return "Header";
            default:
                return "TextInput"; // Default fallback
        }
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }

    private generateFieldName(id: string, elementType: string): string {
        const typePart = elementType.toLowerCase().replace('row', 'col_row');
        return `${typePart}_${id}`;
    }
    
}

// Usage example:
// const formBuilderJson = [...]; // Your JSON data
// const adapter = new FormBuilderAdapter(formBuilderJson);
// const serverData = adapter.convert();
// console.log(serverData);