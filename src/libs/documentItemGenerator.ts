// documentItemGenerator.ts

// Define types for the document item structure
type DocumentItemType = {
  Label: string;
  Value: string;
};

type User = {
  Label: string;
  Value: string;
};

type DocumentItem = {
  Title: string;
  Description: string;
  Version: string;
  WorkflowID: string;
  CreatedBy: User;
  DocumentItemType: DocumentItemType;
  CreatedAt: any;
  UpdatedAt: any;
  Status: string;
  FormData: any;
};

// Helper function to generate a Zimbabwean name
const generateZimbabweanName = (): string => {
  const firstNames = [
    "Tawanda",
    "Farai",
    "Rumbidzai",
    "Kudzai",
    "Tendai",
    "Nyasha",
    "Shamiso",
    "Blessing",
    "Munyaradzi",
    "Rutendo",
  ];
  const lastNames = [
    "Moyo",
    "Mapfumo",
    "Chiweshe",
    "Ndlovu",
    "Mukanya",
    "Sibanda",
    "Chidzambwa",
    "Marimo",
    "Gumbo",
    "Mazango",
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Helper function to generate a random document title
const generateDocumentTitle = (): string => {
  const prefixes = [
    "Project Charter",
    "Technical Specification",
    "Requirements Document",
    "Design Blueprint",
    "Implementation Plan",
    "Test Report",
    "User Manual",
    "Security Policy",
    "Network Diagram",
    "Deployment Guide"
  ];
  const suffixes = [
    "for LTE Deployment",
    "v2.0",
    "Final Draft",
    "Approved Version",
    "for Client Review",
    "Internal Use Only",
    "Confidential",
    "with Appendices",
    "Q2 2025",
    "Phase 1"
  ];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
};

// Helper function to generate a random description
const generateDescription = (): string => {
  const descriptions = [
    "This document outlines the technical specifications for the project.",
    "Detailed requirements for the system implementation.",
    "Comprehensive guide for users to understand the product features.",
    "Design documentation including architecture diagrams and components.",
    "Test cases and results from the QA phase of the project.",
    "Security policies and procedures for the organization.",
    "Step-by-step deployment instructions for the technical team.",
    "Project charter defining scope, objectives and deliverables.",
    "User manual with screenshots and troubleshooting guide.",
    "Network configuration details and topology diagrams."
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Function to generate a single document item
const generateDocumentItem = (index: number): DocumentItem => {
  const documentItemTypes = [
    "Technical Document",
    "User Guide",
    "Policy",
    "Report",
    "Diagram",
    "Specification",
    "Plan",
    "Manual",
    "Charter",
    "Proposal"
  ];
  const statuses = [
    "Draft",
    "Under Review",
    "Approved",
    "Published",
    "Archived",
    "Obsolete",
    "Pending Approval",
    "Rejected",
    "In Revision",
    "Final"
  ];

  const dateCreated = new Date();
  dateCreated.setDate(dateCreated.getDate() - Math.floor(Math.random() * 30));

  const dateUpdated = new Date(dateCreated);
  dateUpdated.setDate(dateUpdated.getDate() + Math.floor(Math.random() * 10));

  return {
    Title: generateDocumentTitle(),
    Description: generateDescription(),
    Version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
    WorkflowID: `WF-${String(index).padStart(4, "0")}-2025`,
    CreatedBy: {
      Label: "Created By",
      Value: generateZimbabweanName(),
    },
    DocumentItemType: {
      Label: "Document Type",
      Value: documentItemTypes[Math.floor(Math.random() * documentItemTypes.length)],
    },
    CreatedAt: {
      Label: "Date Created",
      Value: dateCreated.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    UpdatedAt: {
      Label: "Date Updated",
      Value: dateUpdated.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    Status: statuses[Math.floor(Math.random() * statuses.length)],
    FormData: {
      "id": "ba1adec3-ebcf-48d3-af9b-9fd2598c02c7",
      "title": "Create Service Order",
      "datecreated": null,
      "createdby": {
        "firstname": "admin",
        "id": "c11c7a08-115b-11f0-a6c5-00ffa5d967f1",
        "middlename": null,
        "lastname": "admin",
        "enabled": false
      },
      "listsections": [
        {
          "id": "fd3c29fc-d287-49d6-a71c-da3cc77f5396",
          "sectionorder": 1,
          "sectiontitle": "Company Contact Details",
          "showsectiontitle": true,
          "listfields": [
            {
              "id": "4fe6bea0-e71f-47e9-a1d8-c8905071a5ea",
              "fieldtitle": "Customer Name",
              "fieldtype": "SELECT_LIST",
              "required": false,
              "listoptions": [
                {
                  "id": "b9246774-f44a-4143-b86c-3fd95f549adc",
                  "option": "ACME Holdings (Pvt) Ltd"
                },
                {
                  "id": "d3ab05c7-b69d-4d9c-a1ce-16a67f9d88bd",
                  "option": "Pazviri (Pvt) Ltd"
                }
              ],
              "fieldorder": 1
            },
            {
              "id": "306e84a3-d77f-460c-b928-2bfe8e4df50d",
              "fieldtitle": "Branch / Site",
              "fieldtype": "TEXT",
              "required": false,
              "listoptions": [],
              "fieldorder": 2
            },
            {
              "id": "bd39694e-2314-4d9b-a474-d428be52bd8d",
              "fieldtitle": "Creation Date",
              "fieldtype": "DATE",
              "required": false,
              "listoptions": [],
              "fieldorder": 3
            }
          ]
        },
        {
          "id": "2f16b3ca-90ec-4ee4-8b68-c44d4e74cd4e",
          "sectionorder": 2,
          "sectiontitle": "Service Details",
          "showsectiontitle": true,
          "listfields": [
            {
              "id": "02f0d23b-624f-4871-a8e6-0cacea9da5f8",
              "fieldtitle": "Country",
              "fieldtype": "SELECT_LIST",
              "required": false,
              "listoptions": [
                {
                  "id": "9c9047fe-fdf5-411c-a6d9-a7b140e016af",
                  "option": "South Africa"
                },
                {
                  "id": "8f1dbe01-9d83-4f16-abe3-1137e6dbc2d7",
                  "option": "Zimbabwe"
                }
              ],
              "fieldorder": 1
            },
            {
              "id": "ea90950c-1333-495b-a3dc-e6297e8bd15d",
              "fieldtitle": "City",
              "fieldtype": "TEXT",
              "required": false,
              "listoptions": [],
              "fieldorder": 2
            }
          ]
        }
      ]
    }
};

// Generate a list of 100 document items
const generateDocumentItems = (): DocumentItem[] => {
  return Array.from({ length: 100 }, (_, index) => generateDocumentItem(index + 1));
};

// Export the list of document items
export const documentItems: DocumentItem[] = generateDocumentItems();