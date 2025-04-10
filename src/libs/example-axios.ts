import { AxiosAPI, ColumnCount, CreateDocumentTemplateRequest, FieldType } from "./AxiosAPI";

// Example: Create a new document template
// Example usage:
const api = new AxiosAPI('http://192.168.100.23:8081');

// Set authentication token if required
api.setAuthToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaXNzIjoiaHR0cDovL2luYm94LmNvLnp3IiwiaWF0IjoxNzQ0MTg1NzA1LCJleHAiOjE3NDQyMDM3MDV9.Ei1po1qZRIMP9M0X5QnKb83XJXfth99NXNfEYsyvnwU')

// Example create request
const newTemplate: CreateDocumentTemplateRequest = {
    description: 'Enter location, personal details and notes',
    title: 'Ndau Onboarding Form #2',
    workflowid: '0000-0000-0000-0000',
    listdocumentsections: [
        {
            showtitle: true,
            title: 'Geography',
            description: 'string',
            columncount: ColumnCount.THREE_COLUMN,
            listdocumentfields: [],
            listsubsection: [
                {
                    showtitle: false,
                    title: 'string',
                    description: 'string',
                    columncount: ColumnCount.THREE_COLUMN,
                    listdocumentfields: [
                        {
                            fieldtypeid: FieldType.SELECT_LIST,
                            title: 'National ID',
                            required: false,
                            listoptions: [{ option: 'North, East' }],
                        },
                        {
                            fieldtypeid: FieldType.SELECT_LIST,
                            title: 'Country',
                            required: false,
                            listoptions: [{ option: 'Zimbabwe' }],
                        },
                        {
                            fieldtypeid: FieldType.SELECT_LIST,
                            title: 'City',
                            required: false,
                            listoptions: [{ option: 'Harare' }],
                        },
                    ],
                    listsubsection: [],
                },
            ],
        },
        {
            showtitle: true,
            title: 'Personal Details',
            description: 'string',
            columncount: ColumnCount.THREE_COLUMN,
            listdocumentfields: [],
            listsubsection: [
                {
                    showtitle: false,
                    title: 'string',
                    description: 'string',
                    columncount: ColumnCount.TWO_COLUMN,
                    listdocumentfields: [
                        {
                            fieldtypeid: FieldType.TEXT,
                            title: 'First Name',
                            required: true,
                            listoptions: [],
                        },
                        {
                            fieldtypeid: FieldType.TEXT,
                            title: 'Last Name',
                            required: true,
                            listoptions: [],
                        },
                    ],
                    listsubsection: [],
                },
            ],
        },
        {
            showtitle: true,
            title: 'Notes',
            description: 'string',
            columncount: ColumnCount.THREE_COLUMN,
            listdocumentfields: [],
            listsubsection: [
                {
                    showtitle: false,
                    title: 'string',
                    description: 'string',
                    columncount: ColumnCount.ONE_COLUMN,
                    listdocumentfields: [
                        {
                            fieldtypeid: FieldType.TEXT,
                            title: 'Message',
                            required: true,
                            listoptions: [],
                        },
                    ],
                    listsubsection: [],
                },
            ],
        },
    ],
};

// Create a new template
api.createDocumentTemplate(newTemplate)
    .then((createdTemplate) => {
        console.log('Created template:', createdTemplate);
    })
    .catch((error) => {
        console.error('Creation failed:', error);
    });

// Get a specific template
const templateId = 'aaae49fc-56fd-41d8-be62-776cbbaf0df1';
api.getDocumentTemplate(templateId)
    .then((template) => {
        console.log('Retrieved template:', template);
    })
    .catch((error) => {
        console.error('Retrieval failed:', error);
    });

// Get all templates
api.getAllDocumentTemplates()
    .then((templates) => {
        console.log('All templates:', templates);
    })
    .catch((error) => {
        console.error('Retrieval failed:', error);
    });