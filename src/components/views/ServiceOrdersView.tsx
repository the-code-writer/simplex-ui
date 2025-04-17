import { Breadcrumb, Row, Col, Tabs, Flex, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardCard from "../DashboardCard";
import ListViewDocumentCard from "../ListViewDocumentCard";

const ServiceOrdersView = (params: any) => {

  const {
    cards,
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

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>My Service Orders</Title>

        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Service Orders</Breadcrumb.Item>
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
                <Button onClick={() => setModal2Open(true)}>
                  New Customer
                </Button>
                <Button type="primary" onClick={() => setModal1Open(true)}>
                  New SO
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <InfiniteScroll
          dataLength={itemsToShow.length}
          next={loadMoreItems}
          hasMore={page * itemsPerPage < documents.length}
          loader={<h4>Loading...</h4>}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {documents.map((doc: any, docIndex: number) => (
              <Col
                key={docIndex}
                className="gutter-row"
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <ListViewDocumentCard
                  doc={doc}
                  setModal3Open={setModal3Open}
                  setModal4Open={setModal4Open}
                  setModal5Open={setModal5Open}
                />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      </Content>
    </>
  );
};

export default ServiceOrdersView;