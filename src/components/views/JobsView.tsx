import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
//import { documentItems } from "../../libs/documentItemGenerator";
import DashboardCard from "../DashboardCard.tsx";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import { FormBuilderAdapter } from "../../libs/FormBuilderAdaptor.ts";
import JobListItem from '../JobListItem';

const api = new AxiosAPI();

const breadcrumbItems = [
  { title: "Home" },
  { title: "Documents" },
  { title: "Jobs" },
];

function getUrlParameter<T extends string | number>(name: string): T | null {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(name);

  if (value === null) return null;

  // Try to convert to number if it looks like one
  if (!isNaN(Number(value))) {
    return Number(value) as T;
  }

  return value as T;
}
  
const documentId: any = getUrlParameter("id");

const DocumentsView = (params: any) => {
  const {
    colorBgContainer,
    borderRadiusLG,
    setModal3Open,
    setModal4Open,
    setModal5Open,
  } = params;

  const { Title } = Typography;

  const [cards, setCards] = useState([]);

  const [documentItems, setDocumentItems] = useState([]);

  useEffect(() => {

    console.log("JOB LIST VIEW", localStorage.getItem("simplex-token"));
    
    api
      .getAllDocumentJobs(documentId)
      .then((templates: any) => {
        console.log("All JObs:", templates);
        setDocumentItems(templates);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
    
  }, []);

  const captureAndSaveFormData = async (
    templateId: string,
    fieldValues: FieldValue[]
  ) => {
    // Example usage for saving document data
    const formTitle = "Account Registration F0001";
    const description = "This is the description of the document";
    const workflowId = "cb2d2397-67fc-4100-a7d5-ff6329327cd1";

    const saveRequest = FormBuilderAdapter.prepareSaveRequest(
      formTitle,
      description,
      templateId,
      workflowId,
      fieldValues
    );

    console.log("Save Request:", JSON.stringify(saveRequest, null, 2));

    const docResponse = await api.saveDocument(saveRequest);

    console.log("docResponse:", docResponse);


  };

    const onTabChange = (key: string) => {
      console.log(key);
    };

    const tabItems: TabsProps["items"] = [
      {
        key: "1",
        label: "My Jobs",
        children: "",
      },
      {
        key: "2",
        label: "My Drafts",
        children: "",
      },
      {
        key: "3",
        label: "Unpublished Jobs",
        children: "",
      },
      {
        key: "4",
        label: "Archived Jobs",
        children: "",
      },
    ];
    
  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Jobs</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {cards.map((card: any, cardIndex: number) => (
            <Col
              key={cardIndex}
              className="gutter-row"
              xs={24}
              sm={12}
              md={6}
              lg={6}
              xl={6}
            >
              <DashboardCard
                icon={card.icon}
                value={card.value}
                label={card.label}
              />
            </Col>
          ))}
        </Row>

        <div className="h-8"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <div
              className="tabs-card shadow-1 hide-tab-contents"
              style={{
                padding: "0 24px",
                textAlign: "left",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                width: "100%",
                display: "flex",
              }}
            >
              <Tabs
                defaultActiveKey="1"
                items={tabItems}
                onChange={onTabChange}
              />
              <Flex gap="small" wrap>
                <Button
                  type="primary"
                  onClick={() => (window.location.href = "/documents/jobs/new")}
                >
                  New Job
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {documentItems.map((docItem: any, docIndex: number) => (
            <Col
              id={docItem.id}
              key={docIndex}
              className="gutter-row"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <JobListItem
                api={api}
                captureAndSaveFormData={captureAndSaveFormData}
                docItem={docItem}
                documentId={documentId}
                setModal3Open={setModal3Open}
                setModal4Open={setModal4Open}
                setModal5Open={setModal5Open}
              />
            </Col>
          ))}
        </Row>
      </Content>
    </>
  );
};

export default DocumentsView;
