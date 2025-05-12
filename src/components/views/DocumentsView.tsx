import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
//import { documentItems } from "../../libs/documentItemGenerator";
import DashboardCard from "../DashboardCard";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI";
import { FormBuilderAdaptor } from "../../libs/FormBuilderAdaptor.ts";
import DocumentListItem from '../DocumentListItem';

const api = new AxiosAPI();

const breadcrumbItems = [
  { title: "Home" },
  { title: "Documents" },
];

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
    api
      .getAllDocumentTemplates()
      .then((templates:any) => {
        console.log("All templates:", templates);
        setDocumentItems(templates);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  const captureAndSaveFormData = async (
    templateId: string,
    fieldValues: FieldValue[]
  ) => {
    // Example usage for saving document data
    const formTitle = "Account Registration F0001";
    const description = "This is the description of the document";
    const workflowId = "cb2d2397-67fc-4100-a7d5-ff6329327cd1";

    const saveRequest = FormBuilderAdaptor.prepareSaveRequest(
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
        label: "Documents",
        children: "Content of Tab Pane 1",
      },
      {
        key: "2",
        label: "Revisions",
        children: "Content of Tab Pane 3",
      },
    ];
    
  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Documents</Title>

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
                  onClick={() => (window.location.href = "/documents/new")}
                >
                  New Document
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
              <DocumentListItem
                captureAndSaveFormData={captureAndSaveFormData}
                docItem={docItem}
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
