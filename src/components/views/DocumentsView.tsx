import { Breadcrumb, Row, Col, Tabs, Flex, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
//import { documentItems } from "../../libs/documentItemGenerator";
import DashboardCard from "../DashboardCard";
import { useEffect, useState } from "react";
import DocumentTemplateListItem from "../DocumentTemplateListItem.tsx";
import { AxiosAPI } from "../../libs/AxiosAPI";

const api = new AxiosAPI("http://192.168.100.23:8081");

// Set authentication token if required
api.setAuthToken(
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaXNzIjoiaHR0cDovL2luYm94LmNvLnp3IiwiaWF0IjoxNzQ0MjA3OTcwLCJleHAiOjE3NDQyMjU5NzB9.06SgtZVi2eZebncrAk_tsYkc7-Kry505f5gfb8Mf0IE");


const DocumentsView = (params: any) => {
  const {
    colorBgContainer,
    borderRadiusLG,
    tabItems,
    onTabChange,
    setModal2Open,
    setModal1Open,
    itemsToShow,
    loadMoreItems,
    itemsPerPage,
    page,
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
      .then((templates) => {
        console.log("All templates:", templates);
        setDocumentItems(templates);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Document Templates</Title>

        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Documents</Breadcrumb.Item>
        </Breadcrumb>

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
              className="tabs-card shadow-1"
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
                <Button type="primary" onClick={() => setModal1Open(true)}>
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
              key={docIndex}
              className="gutter-row"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <DocumentTemplateListItem
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