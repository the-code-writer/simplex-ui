// Types for the backend API response
export interface BackendForm {
    title: string;
    workflowId: string;
    listdocumentsections: BackendSection[];
}

export interface BackendSection {
    showtitle: boolean;
    title: string;
    listdocumentfields: BackendField[];
}

export interface BackendField {
    fieldtypeid: string;
    title: string;
    required: boolean;
    listoptions: { option: string }[];
}

// Types for the react-form-builder2 expected format
export interface FormBuilderForm {
    id: string;
    element: string;
    text?: string;
    static?: boolean;
    required?: boolean;
    bold?: boolean;
    italic?: boolean;
    content?: string;
    canHavePageBreakBefore?: boolean;
    canHaveAlternateForm?: boolean;
    canHaveDisplayHorizontal?: boolean;
    canHaveOptionCorrect?: boolean;
    canHaveOptionValue?: boolean;
    canPopulateFromApi?: boolean;
    dirty?: boolean;
    pageBreakBefore?: boolean;
    // Field-specific properties
    field_name?: string;
    label?: string;
    field_type?: string;
    value?: string;
    options?: { value: string; text: string; key: string }[];
}