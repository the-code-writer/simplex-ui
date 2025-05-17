import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { BackendForm } from './FormBuilderAdaptor';

/**
 * Enum representing possible column count options for document sections
 */
export enum ColumnCount {
    ONE_COLUMN = 'ONE_COLUMN',
    TWO_COLUMN = 'TWO_COLUMN',
    THREE_COLUMN = 'THREE_COLUMN',
    FOUR_COLUMN = 'FOUR_COLUMN'
}

/**
 * Enum representing possible field type options
 */
export enum FieldType {
    SELECT_LIST = 'SELECT_LIST',
    DATETIME = 'DATETIME',
    DATE = 'DATE',
    TEXT = 'TEXT',
    NUMERIC = 'NUMERIC',
    CHECKBOX = 'CHECKBOX',
    CHECKBOX_MULTIPLE = 'CHECKBOX_MULTIPLE',
    RADIOBUTTON = 'RADIOBUTTON'
}

/**
 * Interface for a document option (used in select lists, checkboxes, etc.)
 */
export interface DocumentOption {
    option: string;
}

/**
 * Interface for a document field
 */
export interface DocumentField {
    fieldtypeid: FieldType;
    title: string;
    required: boolean;
    listoptions: DocumentOption[];
}

/**
 * Interface for a document subsection
 */
export interface DocumentSubsection {
    showtitle: boolean;
    title: string;
    description: string;
    columncount: ColumnCount;
    listdocumentfields: DocumentField[];
    listsubsection: DocumentSubsection[];
}

/**
 * Interface for a document section
 */
export interface DocumentSection {
    showtitle: boolean;
    title: string;
    description: string;
    columncount: ColumnCount;
    listdocumentfields: DocumentField[];
    listsubsection: DocumentSubsection[];
}

/**
 * Interface for a user who created the document template
 */
export interface CreatedBy {
    firstname: string;
    id: string;
    middlename: string | null;
    lastname: string;
    enabled: boolean;
}

/**
 * Interface for a field option in the response
 */
export interface FieldOptionResponse {
    id: string;
    option: string;
}

/**
 * Interface for a field in the response
 */
export interface FieldResponse {
    id: string;
    fieldtitle: string;
    fieldtype: FieldType;
    required: boolean;
    listoptions: FieldOptionResponse[];
    fieldorder: number;
}

/**
 * Interface for a subsection in the response
 */
export interface SubsectionResponse {
    id: string;
    sectionorder: number;
    sectiontitle: string;
    showsectiontitle: boolean;
    columncount: ColumnCount;
    listfields: FieldResponse[];
    listsubsection: SubsectionResponse[];
}

/**
 * Interface for a section in the response
 */
export interface SectionResponse {
    id: string;
    sectionorder: number;
    sectiontitle: string;
    showsectiontitle: boolean;
    columncount: ColumnCount;
    listfields: FieldResponse[];
    listsubsection: SubsectionResponse[];
}

/**
 * Interface for a single document template response
 */
export interface DocumentTemplateResponse {
    description: string | null;
    id: string;
    title: string;
    datecreated: string;
    createdby: CreatedBy;
    version: string | null;
    listsections: SectionResponse[];
}

const tenantid: string = "882b4330-1b75-44fe-b708-d00a8936b6e5";

/**
 * Class for interacting with the Document Template API
 */
export class AxiosAPI {
    private axiosInstance: AxiosInstance;
    private baseURL: string;
    private authToken: string | null = localStorage.getItem("simplex-token");

    /**
     * Creates an instance of the AxiosAPI class
     * @param baseURL - The base URL for the API
     */
    constructor() {
        this.baseURL = "https://simplexgen-api.hyperefficient2.net/";

        // Create Axios instance with base configuration
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to include auth token
        this.axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                if (this.authToken) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /**
     * Sets the authentication token for API requests
     * @param token - The Bearer token to use for authentication
     */
    setAuthToken(token: string): void {
        this.authToken = token;
    }

    /**
     * Clears the current authentication token
     */
    clearAuthToken(): void {
        this.authToken = null;
    }

    /**
     * Creates a new document template
     * @param templateData - The document template data to create
     * @returns Promise containing the created document template
     */
    async createDocumentTemplate(
        templateData: BackendForm
    ): Promise<DocumentTemplateResponse> {
        console.log(JSON.stringify(templateData))
        try {
            const response: AxiosResponse<DocumentTemplateResponse> = await this.axiosInstance.post(
                '/api/v1/documenttemplate',
                templateData
            );
            return response.data;
        } catch (error) {
            console.error('Error creating document template:', error);
            throw error;
        }
    }

    /**
     * Retrieves a specific document template by ID
     * @param templateId - The ID of the document template to retrieve
     * @returns Promise containing the document template
     */
    async getDocumentTemplate(templateId: string): Promise<DocumentTemplateResponse> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse> = await this.axiosInstance.get(
                `/api/v1/documenttemplate/${templateId}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error getting document template with ID ${templateId}:`, error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getAllDocumentTemplates(): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                '/api/v1/documenttemplate/all'
            );
            return response.data;
        } catch (error) {
            console.error('Error getting all document templates:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getAllDocumentJobs(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                '/api/v1/document/listbytemplate/' + id
            );
            return response.data;
        } catch (error) {
            console.error('Error getting all document templates:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getDocument(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                '/api/v1/document/' + id
            );
            return response.data;
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getAllDocumentJobsList(): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                '/api/v1/document/all'
            );
            return response.data;
        } catch (error) {
            console.error('Error getting all document templates:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async assignToWorkflow(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.put(
                `/api/v1/document/${id}/advance`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async assignRoleToWorkflowStage(roleid: string, workflowstageid: string): Promise<any> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.put(
                `/api/v1/workflowstage/assignrole`,
                { roleid, workflowstageid }
            );
            return response.data;
        } catch (error) {
            console.error('Error assignRoleToWorkflowStage:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async revertJob(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.put(
                `/api/v1/document/${id}/revert`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async advanceJob(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.put(
                `/api/v1/document/${id}/advance`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getWorkflows(): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/workflow/all`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getWorkflowStages(workflowID:string): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/workflowstage/listbyworkflowid/${workflowID}`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getUsers(): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/user/all`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getUserRoles(): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/role/all`
            );
            return response.data;
        } catch (error) {
            console.error('Error getUserRole:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getUserAssignedRoles(id:string): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/userrole/all/`+id
            );
            return response.data;
        } catch (error) {
            console.error('Error getUserAssignedRoles:', error);
            throw error;
        }
    }

    /**
     * Retrieves all document templates
     * @returns Promise containing an array of document templates
     */
    async getWorkflowStageTasks(id: any): Promise<DocumentTemplateResponse[]> {
        try {
            const response: AxiosResponse<DocumentTemplateResponse[]> = await this.axiosInstance.get(
                `/api/v1/task/listbyworkflowstageid/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Error assignToWorkflow:', error);
            throw error;
        }
    }

    async saveWorkflow(title: string, description: string, status: string = "DRAFT", meta: any = {}): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/workflow',
                { title, description, tenantid, status, meta: JSON.stringify(meta) }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving workflow', error);
            throw error;
        }
    }

    async editWorkflow(workflowId:string, title: string, description: string, status: string = "DRAFT", meta: any = {}): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                '/api/v1/workflow/' + workflowId,
                { title, description, tenantid, status, meta: JSON.stringify(meta) }
            );
            return response.data;
        } catch (error) {
            console.error('Error editing workflow', error);
            throw error;
        }
    }

    async saveWorkflowStage(title: string, description: string, workflowid:string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/workflowstage',
                { title, description, workflowid }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving workflow stage', error);
            throw error;
        }
    }

    async saveWorkflowStageTask(name: string, submittonext: boolean, submittoprevious: boolean, workflowstageid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/task',
                { name, submittonext, submittoprevious, workflowstageid }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving workflow stage task', error);
            throw error;
        }
    }

    async saveUser(firstname: string, lastname: string, email: string, password: string, roleid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/user',
                { firstname, lastname, email, password, roleid }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving user', error);
            throw error;
        }
    }

    async updateUser(firstname: string, lastname: string, email: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                '/api/v1/user',
                { firstname, lastname, email }
            );
            return response.data;
        } catch (error) {
            console.error('Error editing user', error);
            throw error;
        }
    }

    async saveUserRole(role: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/role',
                { role }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving document', error);
            throw error;
        }
    }

    async assignUserRole(userid: string, roleid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/userrole',
                { userid, roleid }
            );
            return response.data;
        } catch (error) {
            console.error('Error saving document', error);
            throw error;
        }
    }

    async saveDocument(data: any): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/document',
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error saving document', error);
            throw error;
        }
    }

    async addDocumentTask(documentid: string, taskid: string, message: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/api/v1/document/addtask',
                {
                    documentid, taskid, message, attachments: [{}]
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding document task', error);
            throw error;
        }
    }

    async addDocumentToWorkFlow(documentid: string, workflowid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                `/api/v1/workflow/${workflowid}/add-document`,
                {
                    id: documentid
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding document to workflow', error);
            throw error;
        }
    }

    async publishDocument(documentid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/documenttemplate/${documentid}/status`,
                {
                    status: "PUBLISHED"
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error publishing document', error);
            throw error;
        }
    }

    async unpublishDocument(documentid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/documenttemplate/${documentid}/status`,
                {
                    status: "UNPUBLISHED"
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error unpublishing document', error);
            throw error;
        }
    }

    async assignDocumentUser(documentid: string, userid:string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/document/${documentid}`,
                {
                    documentid, userid
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error assigning custodian of a document', error);
            throw error;
        }
    }

    async assignDocumentRole(documentid: string, roleid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/document/${documentid}`,
                {
                    documentid, roleid
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error assigning role of a document', error);
            throw error;
        }
    }

    async archiveDocument(documentid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/document/${documentid}`,
                {
                    status: "ARCHIVE"
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error archiving document', error);
            throw error;
        }
    }

    async advanceDocument(documentid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/document/${documentid}/advance`
            );
            return response.data;
        } catch (error) {
            console.error('Error advancing document', error);
            throw error;
        }
    }

    async revertDocument(documentid: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.put(
                `/api/v1/document/${documentid}/revert`
            );
            return response.data;
        } catch (error) {
            console.error('Error reverting document', error);
            throw error;
        }
    }

    async login(username: string, password: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await this.axiosInstance.post(
                '/token/generate-token',
                {
                    username, password, ipaddress: "127.0.0.1"
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error login', error);
            throw error;
        }
    }

}