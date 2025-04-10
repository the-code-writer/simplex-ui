import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

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
 * Interface for creating a new document template
 */
export interface CreateDocumentTemplateRequest {
    description: string;
    title: string;
    workflowid: string;
    listdocumentsections: DocumentSection[];
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

/**
 * Class for interacting with the Document Template API
 */
export class AxiosAPI {
    private axiosInstance: AxiosInstance;
    private baseURL: string;
    private authToken: string | null = null;

    /**
     * Creates an instance of the AxiosAPI class
     * @param baseURL - The base URL for the API
     */
    constructor(baseURL: string) {
        this.baseURL = baseURL;

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
        templateData: CreateDocumentTemplateRequest
    ): Promise<DocumentTemplateResponse> {
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
}