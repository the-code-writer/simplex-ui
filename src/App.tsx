import "./App.scss";
import logoWhite from "./assets/logo-white.png";
import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  DollarOutlined,
  FileOutlined,
  FileTextOutlined,
  HeatMapOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Breadcrumb, Button, Col, Flex, Layout, Menu, Row,  Tabs, theme } from "antd";
import DashboardCard from "./components/DashboardCard";
import Title from "antd/es/typography/Title";
import ListViewDocumentCard from "./components/ListViewDocumentCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { documents } from "./libs/documentGenerator";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const items: MenuProps["items"] = [
  { label: "Home", classes: "", url: "", id: "", icon: HomeOutlined },
  {
    label: "Dashboard",
    classes: "",
    url: "",
    id: "",
    icon: AppstoreOutlined,
  },
  {
    label: "Service Orders",
    classes: "",
    url: "",
    id: "",
    icon: FileOutlined,
  },
  {
    label: "Purchase Order",
    classes: "",
    url: "",
    id: "",
    icon: DollarOutlined,
  },
  {
    label: "Summary Sheets",
    classes: "",
    url: "",
    id: "",
    icon: LayoutOutlined,
  },
  { label: "Analytics", classes: "", url: "", id: "", icon: LineChartOutlined },
  { label: "Reports", classes: "", url: "", id: "", icon: FileTextOutlined },
  { label: "Support", classes: "", url: "", id: "", icon: HeatMapOutlined },
].map((item, index) => ({
  key: String(index + 1),
  icon: React.createElement(item.icon),
  label: `${item.label}`,
}));

const cards: any = [
  {
    icon: <FileOutlined />,
    label: "Pending BOQs",
    value: "14",
  },
  {
    icon: <FileOutlined />,
    label: "Pending Summary Sheets",
    value: "3",
  },
  {
    icon: <FileOutlined />,
    label: "Declined POs",
    value: "5",
  },
  {
    icon: <FileOutlined />,
    label: "Declined PAT",
    value: "1",
  },
];

const App: React.FC = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const [itemsToShow, setItemsToShow] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadMoreItems();
  }, []);

  const loadMoreItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextItems = documents.slice(startIndex, endIndex);

    setItemsToShow((prevItems:any) => [...prevItems, ...nextItems]);
    setPage((prevPage) => prevPage + 1);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Normal SOs",
      children: "",
    },
    {
      key: "2",
      label: "Billed & Commisioned SOs",
      children: "",
    },
  ];

  // Add a scroll event listener to detect when the user reaches the bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [itemsToShow]);

  return (
    <Layout hasSider>
      <Sider style={siderStyle}>
        <div className="logo-vertical">
          <img src={logoWhite} width={128} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          className="shadow-1"
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        />
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
                  <Button>New Customer</Button>
                  <Button type="primary">New SO</Button>
                </Flex>
              </div>
            </Col>
          </Row>

          <div className="h-8"></div>
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
                  <ListViewDocumentCard doc={doc} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          SimplexAI ©{new Date().getFullYear()}. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
