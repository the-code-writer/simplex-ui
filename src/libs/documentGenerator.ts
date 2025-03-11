// documentGenerator.ts

// Define types for the document structure
type Customer = {
  Label: string;
  Value: string;
};

type Address = {
  Label: string;
  Value: string;
};

type User = {
  Label: string;
  Value: string;
};

type Milestone = {
  Label: string;
  Value: string;
};

type TechnologyType = {
  Label: string;
  Value: string;
};

type ServiceType = {
  Label: string;
  Value: string;
};

type OrderType = {
  Label: string;
  Value: string;
};

type MilestoneAge = {
  Label: string;
  Value: string;
};

type CumulativeAge = {
  Label: string;
  Value: string;
};

type Document = {
  Number: string;
  Customer: Customer;
  CustomerAddress: Address;
  User: User;
  AccountManager: any;
  Milestone: Milestone;
  TechnologyType: TechnologyType;
  ServiceType: ServiceType;
  OrderType: OrderType;
  ProjectCode: any;
  CreatedAt: any;
  UpdatedAt: any;
  MilestoneAge: MilestoneAge;
  CumulativeAge: CumulativeAge;
  Area: any;
  StartPoint: any;
  EndPoint: any;
  Coordinates: any;
  ISPName: any;
  Status: string;
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

// Helper function to generate a Harare address
const generateHarareAddress = (): string => {
  const streets = [
    "Samora Machel Ave",
    "Robert Mugabe Rd",
    "Julius Nyerere Way",
    "Herbert Chitepo Ave",
    "Jason Moyo St",
    "Kwame Nkrumah Ave",
    "George Silundika Ave",
    "Josiah Tongogara St",
    "Fifth St",
    "Alpes Rd",
  ];
  const streetNumber = Math.floor(Math.random() * 200) + 1;
  return `${streetNumber} ${
    streets[Math.floor(Math.random() * streets.length)]
  }, Harare`;
};

// Function to generate a single document
const generateDocument = (index: number): Document => {
  const milestones = [
    "Civils",
    "Design",
    "Implementation",
    "Testing",
    "Commissioning",
  ];
  const technologyTypes = ["GPON", "LTE", "FTTH", "MW", "IP"];
  const serviceTypes = ["DIA", "VoIP", "VPN", "IPTV", "Cloud"];
  const orderTypes = ["Physical", "Virtual", "Hybrid"];
  const statuses = [
    "Pending File Attachments",
    "In Progress",
    "Completed",
    "On Hold",
    "Cancelled",
  ];

  return {
    Number: `LTZ202404${String(index).padStart(3, "0")}`,
    Customer: {
      Label: "Customer Name",
      Value: generateZimbabweanName() + " Firm",
    },
    CustomerAddress: {
      Label: "Physical Address",
      Value: generateHarareAddress(),
    },
    User: {
      Label: "User",
      Value: generateZimbabweanName(),
    },
    AccountManager: {
      Label: "User",
      Value: generateZimbabweanName(),
    },
    Milestone: {
      Label: "Milestone",
      Value: milestones[Math.floor(Math.random() * milestones.length)],
    },
    TechnologyType: {
      Label: "Technology Type",
      Value:
        technologyTypes[Math.floor(Math.random() * technologyTypes.length)],
    },
    ServiceType: {
      Label: "Service Type",
      Value: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
    },
    OrderType: {
      Label: "Order Type",
      Value: orderTypes[Math.floor(Math.random() * orderTypes.length)],
    },
    ProjectCode: {
      Label: "Project Code",
      Value: `PC${Math.floor(Math.random() * 1000) + 3}LTE`,
    },
    CreatedAt: {
      Label: "Date Created",
      Value: `2 Mar 2025, 14:42`,
    },
    UpdatedAt: {
      Label: "Date Updated",
      Value: `9 Mar 2025, 09:15`,
    },
    MilestoneAge: {
      Label: "Milestone Age",
      Value: `${Math.floor(Math.random() * 10) + 1} days`,
    },
    CumulativeAge: {
      Label: "Cumulative Age",
      Value: `${Math.floor(Math.random() * 30) + 1} days`,
    },
    Area: {
      Label: "Area",
      Value: generateHarareAddress(),
    },
    StartPoint: {
      Label: "Start Point",
      Value: generateHarareAddress(),
    },
    EndPoint: {
      Label: "End Point",
      Value: generateHarareAddress(),
    },
    Coordinates: {
      Label: "Coordinates",
      Value: "-18.21564494191651,31.6489749749494",
    },
    ISPName: {
      Label: "ISP Name",
      Value: "Utande Zimbabwe (Pvt) Ltd",
    },
    Status: statuses[Math.floor(Math.random() * statuses.length)],
  };
};

// Generate a list of 100 documents
const generateDocuments = (): Document[] => {
  return Array.from({ length: 100 }, (_, index) => generateDocument(index + 1));
};

// Export the list of documents
export const documents: Document[] = generateDocuments();
