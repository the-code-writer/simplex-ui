import { v4 as uuidv4 } from 'uuid';
import { BackendField, BackendForm, FormBuilderForm } from './DocumentAdapter';

// Map backend field types to react-form-builder2 field types
const FIELD_TYPE_MAP: Record<string, string> = {
    'TEXT': 'TextInput',
    'SELECT_LIST': 'Dropdown',
    'DATE': 'DatePicker',
    'NUMBER': 'NumberInput',
    'CHECKBOX': 'Checkboxes',
    'RADIO': 'RadioButtons',
    'TEXTAREA': 'TextArea',
    'FILE': 'FileUpload'
};

export function adaptFormData(backendForm: BackendForm): FormBuilderForm[] {
    const formElements: FormBuilderForm[] = [];

    // Add form title as a header
    formElements.push({
        id: uuidv4(),
        element: 'Header',
        text: backendForm.title,
        static: true,
        required: false,
        bold: true,
        italic: false,
        content: `<strong>${backendForm.title}</strong>`,
        canHavePageBreakBefore: true,
        canHaveAlternateForm: true,
        canHaveDisplayHorizontal: true,
        canHaveOptionCorrect: true,
        canHaveOptionValue: true,
        canPopulateFromApi: true,
        dirty: false,
        pageBreakBefore: true
    });

    // Process each section
    backendForm.listdocumentsections.forEach((section:any, sectionIndex:number) => {
        // Add section header if showtitle is true
        if (section.showtitle) {
            formElements.push(createSectionHeader(section.title, sectionIndex === 0));
        }

        // Process each field in the section
        section.listdocumentfields.forEach((field:BackendField) => {
            formElements.push(createFormField(field));
        });
    });

    return formElements;
}

function createSectionHeader(title: string, isFirstSection: boolean): FormBuilderForm {
    return {
        id: uuidv4(),
        element: 'Header',
        text: title,
        static: true,
        required: false,
        bold: true,
        italic: false,
        content: `<strong>${title}</strong>`,
        canHavePageBreakBefore: true,
        canHaveAlternateForm: true,
        canHaveDisplayHorizontal: true,
        canHaveOptionCorrect: true,
        canHaveOptionValue: true,
        canPopulateFromApi: true,
        dirty: false,
        pageBreakBefore: !isFirstSection // Only set page break for non-first sections
    };
}

function createFormField(field: BackendField): FormBuilderForm {
    const baseField: FormBuilderForm = {
        id: uuidv4(),
        element: FIELD_TYPE_MAP[field.fieldtypeid] || 'TextInput',
        field_name: generateFieldName(field.title),
        label: field.title,
        field_type: field.fieldtypeid.toLowerCase(),
        required: field.required,
        canHavePageBreakBefore: true,
        canHaveAlternateForm: true,
        canHaveDisplayHorizontal: true,
        canHaveOptionCorrect: true,
        canHaveOptionValue: true,
        canPopulateFromApi: true,
        dirty: false
    };

    // Handle options for select-like fields
    if (field.listoptions && field.listoptions.length > 0) {
        baseField.options = field.listoptions.map((opt:any, index:number) => ({
            value: opt.option,
            text: opt.option,
            key: `option-${index}`
        }));
    }

    // Special handling for specific field types
    switch (field.fieldtypeid) {
        case 'CHECKBOX':
        case 'RADIO':
            baseField.value = '';
            break;
        case 'DATE':
            baseField.value = new Date().toISOString().split('T')[0];
            break;
        case 'FILE':
            baseField.value = '';
            break;
    }

    return baseField;
}

function generateFieldName(title: string): string {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_+|_+$)/g, '');
}