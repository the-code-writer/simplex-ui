import "./App.scss";
import logoWhite from "./assets/logo-white.png";
import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BoxPlotOutlined,
  DollarOutlined,
  FileOutlined,
  FileTextOutlined,
  HeatMapOutlined,
  HomeOutlined,
  InboxOutlined,
  LayoutOutlined,
  LineChartOutlined,
  MailOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps, GetProp } from "antd";
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Input,
  Layout,
  Menu,
  Modal,
  Row,
  Select,
  Tabs,
  theme,
  DatePicker,
  Space,
  InputNumber,
  Upload,
  message,
} from "antd";
import DashboardCard from "./components/DashboardCard";
import Title from "antd/es/typography/Title";
import ListViewDocumentCard from "./components/ListViewDocumentCard";
import InfiniteScroll from "react-infinite-scroll-component";
import UserContactCard from "./components/UserContactCard";
import CustomerContactCard from "./components/CustomerContactCard";
import TextArea from "antd/es/input/TextArea";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import ServiceOrdersView from "./components/views/ServiceOrdersView";
import DocumentsView from "./components/views/DocumentsView";
import DocumentsCreate from "./components/views/DocumentsCreate";
import JobsView from "./components/views/JobsView";
import WorkflowsView from "./components/views/WorkflowsView";
import WorkflowStagesView from "./components/views/WorkflowStagesView";
import UsersView from "./components/views/UsersView";
import UserRolesView from "./components/views/UserRolesView";
import LoginView from "./components/LoginView";
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

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    label: "Home",
    classes: "",
    url: "/service-orders",
    id: "service_orders",
    icon: HomeOutlined,
  },
  {
    label: "Dashboard",
    classes: "",
    url: "/service-orders",
    id: "service_orders",
    icon: AppstoreOutlined,
  },

  {
    label: "Documents",
    classes: "",
    url: "/document-management",
    id: "document_management",
    icon: FileTextOutlined,
    children: [
      {
        key: "documents_list",
        label: "List View",
        classes: "",
        url: "/documents/list",
        id: "documents_list",
      },
      {
        key: "documents_new",
        label: "Create New",
        classes: "",
        url: "/documents/new",
        id: "documents_new",
      },
      {
        key: "documents_archive",
        label: "Archived",
        classes: "",
        url: "/documents/archive",
        id: "documents_archive",
      },
    ],
  },

  {
    label: "Jobs",
    classes: "",
    url: "/jobs-management",
    id: "jobs_management",
    icon: BoxPlotOutlined,
    children: [
      {
        key: "jobs_list",
        label: "List View",
        classes: "",
        url: "/jobs/list",
        id: "jobs_list",
      },
      {
        key: "jobs_new",
        label: "Create New",
        classes: "",
        url: "/jobs/new",
        id: "jobs_new",
      },
      {
        key: "jobs_archive",
        label: "Archived",
        classes: "",
        url: "/jobs/archive",
        id: "jobs_archive",
      },
    ],
  },

  {
    label: "Users",
    classes: "",
    url: "/document-management",
    id: "document_management",
    icon: UserOutlined,
    children: [
      {
        key: "users_list",
        label: "List View",
        classes: "",
        url: "/users/list",
        id: "users_list",
      },
      {
        key: "users_new",
        label: "Create New",
        classes: "",
        url: "/users/new",
        id: "users_new",
      },
      {
        key: "users_archive",
        label: "Archived",
        classes: "",
        url: "/users/archive",
        id: "users_archive",
      },
    ],
  },

  {
    label: "Users Roles",
    classes: "",
    url: "/roles-management",
    id: "roles_management",
    icon: UserSwitchOutlined,
    children: [
      {
        key: "roles_list",
        label: "List View",
        classes: "",
        url: "/roles/list",
        id: "roles_list",
      },
      {
        key: "roles_new",
        label: "Create New",
        classes: "",
        url: "/roles/new",
        id: "roles_new",
      },
    ],
  },

  {
    label: "Workflows",
    classes: "",
    url: "/workflows-management",
    id: "workflows_management",
    icon: ShareAltOutlined,
    children: [
      {
        key: "workflows_list",
        label: "List View",
        classes: "",
        url: "/workflows/list",
        id: "workflows_list",
      },
      {
        key: "workflows_new",
        label: "Create New",
        classes: "",
        url: "/workflows/new",
        id: "workflows_new",
      },
    ],
  },

  { label: "Analytics", classes: "", url: "", id: "", icon: LineChartOutlined },
  { label: "Reports", classes: "", url: "", id: "", icon: FileTextOutlined },
  { label: "Support", classes: "", url: "", id: "", icon: HeatMapOutlined },
].map((item, index) => ({
  key: String(index + 1),
  itemx: item,
  icon: React.createElement(item.icon),
  label: `${item.label}`,
  children: item.children,
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

const viewTypes = {
  serviceOrders: "service-orders",
  purchaseOrders: "purchase-orders",
  documents: "documents",
  workflows: "workflows",
};

interface NavMenuProps {
  item: any;
  key: any;
  keyPath: any;
  selectedKeys: any;
  domEvent: any;
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const [modal1Open, setModal1Open] = useState(false);

  const [modal2Open, setModal2Open] = useState(false);

  const [modal3Open, setModal3Open] = useState(false);

  const [modal4Open, setModal4Open] = useState(false);

  const [modal5Open, setModal5Open] = useState(false);

  const [itemsToShow, setItemsToShow] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const history = useHistory();

  useEffect(() => {
    loadMoreItems();
  }, []);

  const menuClicked = ({ item }: NavMenuProps) => {
    console.log(item.props);
    window.location.href = item.props.url;
  };

  const loadMoreItems = () => {};

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

  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    
    setIsPageLoading(true);

    const simplexToken = localStorage.getItem("simplex-token");

    console.log("SOMPLEX TOKEN", simplexToken);

    setTimeout(() => {
      setIsPageLoading(false);
      if (simplexToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, 2000);

  }, []);

  useEffect(() => {}, []);

  return (
    <Router>
      <>
      {isPageLoading ? (
        <>
          <div className="page-loader"><img src="https://i.pinimg.com/originals/76/77/ed/7677edd5a44b10130b8824ca020ba60b.gif" alt="Loading..." width={180} />
          <h6 style={{color: "#aaaaaa"}}>Loading...</h6></div>
      </>
      ) : (
        <>
          {isLoggedIn ? (
            <>
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
                    onSelect={menuClicked}
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

                  <Switch>
                    <Route path="/service-orders">
                      <ServiceOrdersView
                        cards={cards}
                        colorBgContainer={colorBgContainer}
                        borderRadiusLG={borderRadiusLG}
                        tabItems={tabItems}
                        onTabChange={onTabChange}
                        setModal2Open={setModal2Open}
                        setModal1Open={setModal1Open}
                        itemsToShow={itemsToShow}
                        loadMoreItems={loadMoreItems}
                        itemsPerPage={itemsPerPage}
                        page={page}
                        setModal3Open={setModal3Open}
                        setModal4Open={setModal4Open}
                        setModal5Open={setModal5Open}
                      />
                    </Route>
                    <Route path="/documents/list">
                      <DocumentsView />
                    </Route>
                    <Route path="/workflows/list">
                      <WorkflowsView />
                    </Route>
                    <Route path="/workflow/stages">
                      <WorkflowStagesView />
                    </Route>
                    <Route path="/users/list">
                      <UsersView />
                    </Route>
                    <Route path="/roles/list">
                      <UserRolesView />
                    </Route>
                    <Route path="/documents/jobs/list">
                      <JobsView />
                    </Route>
                    <Route path="/documents/new">
                      <DocumentsCreate />
                    </Route>
                  </Switch>

                  <Footer style={{ textAlign: "center" }}>
                    SimplexAI ©{new Date().getFullYear()}. All rights reserved.
                  </Footer>
                </Layout>
              </Layout>
              <Modal
                centered
                title="Create Service Order"
                style={{ top: 20 }}
                width={1320}
                open={modal1Open}
                onOk={() => setModal1Open(false)}
                onCancel={() => setModal1Open(false)}
                className="new-so"
              >
                <Row
                  className="w-100"
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                >
                  <Col flex="1 1 200px">
                    <span className="ant-modal-card-title">
                      Company Contact Details
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Customer Name</span>

                            <Select
                              size="large"
                              className="w-100"
                              defaultValue="Demo Customer 1"
                              allowClear
                              options={[
                                { value: "lucy", label: "Demo Customer 1" },
                                { value: "lucy2", label: "Demo Customer 2" },
                                { value: "lucy3", label: "Demo Customer 3" },
                              ]}
                              placeholder="Select Customer"
                            />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Branch / Site:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">
                              Ready for Service Date:
                            </span>
                            <DatePicker size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">CreationDate:</span>
                            <DatePicker size="large" className="w-100" />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="h-32" />
                    <span className="ant-modal-card-title">
                      Service Details
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" className="w-100" size={24}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Country</span>

                              <Select
                                size="large"
                                className="w-100"
                                defaultValue="Zimbabwe"
                                allowClear
                                options={[
                                  { value: "lucy", label: "Zimbabwe" },
                                  { value: "lucy2", label: "DRC" },
                                  { value: "lucy3", label: "Zambia" },
                                ]}
                                placeholder="Select Country"
                              />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">City:</span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                GPS Coordinates:
                              </span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                Technology Type
                              </span>

                              <Select
                                size="large"
                                className="w-100"
                                defaultValue="GPON"
                                allowClear
                                options={[
                                  { value: "lucy", label: "GPON" },
                                  { value: "lucy2", label: "MPLS" },
                                ]}
                                placeholder="Select Customer"
                              />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Service Type:</span>
                              <Select
                                size="large"
                                className="w-100"
                                defaultValue="Service Type"
                                allowClear
                                options={[
                                  { value: "lucy", label: "Zimbabwe" },
                                  { value: "lucy2", label: "DRC" },
                                  { value: "lucy3", label: "Zambia" },
                                ]}
                                placeholder="Select Service Type"
                              />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={4}
                            xl={4}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Order Type:</span>
                              <Select
                                size="large"
                                className="w-100"
                                defaultValue="Order Type"
                                allowClear
                                options={[
                                  { value: "lucy", label: "Zimbabwe" },
                                  { value: "lucy2", label: "DRC" },
                                  { value: "lucy3", label: "Zambia" },
                                ]}
                                placeholder="Select Order Type"
                              />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={4}
                            xl={4}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">SFDC Number:</span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                        </Row>

                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Start Point:</span>

                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={8}
                            xl={8}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">End Point:</span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={4}
                            xl={4}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Bandwidth:</span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>
                          <Col
                            className="gutter-row"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={4}
                            xl={4}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Units:</span>
                              <Select
                                size="large"
                                className="w-100"
                                defaultValue="Kbps"
                                allowClear
                                options={[
                                  { value: "lucy", label: "Kbps" },
                                  { value: "lucy2", label: "Mbps" },
                                ]}
                                placeholder="Select Bandwidth Units"
                              />
                            </div>
                          </Col>
                        </Row>
                      </Space>
                    </div>

                    <div className="h-32" />
                    <span className="ant-modal-card-title">ISP Details</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">ISP Name</span>

                            <Select
                              size="large"
                              className="w-100"
                              defaultValue="DLTZ"
                              allowClear
                              options={[{ value: "lucy", label: "LTZ" }]}
                              placeholder="Select ISP"
                            />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">
                              Physical Address:
                            </span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">VAT Number:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Contact:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="h-32" />
                    <span className="ant-modal-card-title">
                      Account Manager
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Name:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={8}
                          xl={8}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Designation:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Phone Number:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                        >
                          <div className="input-wrapper">
                            <span className="input-label">Email Address:</span>
                            <Input size="large" className="w-100" />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="h-32" />
                    <span className="ant-modal-card-title">Financials</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col
                          className="gutter-row"
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                        >
                          <div className="financials-table-wrapper">
                            <table
                              className="table table-bordered"
                              border={1}
                              cellPadding={3}
                              cellSpacing={0}
                              style={{ borderColor: "#efefef" }}
                            >
                              <tbody>
                                <tr bgcolor="#e1e1e1">
                                  <th width="48%" rowSpan={2}>
                                    Description
                                  </th>
                                  <th
                                    width="8%"
                                    style={{ textAlign: "center !important" }}
                                    rowSpan={2}
                                  >
                                    Units
                                  </th>
                                  <th
                                    width="8%"
                                    style={{ textAlign: "center !important" }}
                                    rowSpan={2}
                                  >
                                    Initial Term <br />
                                    (12 months)
                                  </th>
                                  <th
                                    width="8%"
                                    style={{ textAlign: "center !important" }}
                                  >
                                    Install Charges
                                  </th>
                                  <th
                                    width="8%"
                                    style={{ textAlign: "center !important" }}
                                  >
                                    Monthly Charges
                                  </th>
                                  <th
                                    width="10%"
                                    style={{ textAlign: "center !important" }}
                                  >
                                    Install Charges
                                  </th>
                                  <th
                                    width="10%"
                                    style={{ textAlign: "center !important" }}
                                  >
                                    Monthly Charges
                                  </th>
                                </tr>
                                <tr bgcolor="#e1e1e1">
                                  <td
                                    bgcolor="#eeeeee"
                                    colSpan={2}
                                    style={{ textAlign: "center !important" }}
                                  >
                                    <span
                                      style={{ textAlign: "center !important" }}
                                    >
                                      Unit price ($)
                                    </span>
                                  </td>
                                  <td
                                    bgcolor="#eeeeee"
                                    colSpan={2}
                                    style={{ textAlign: "center !important" }}
                                  >
                                    <span
                                      style={{ textAlign: "center !important" }}
                                    >
                                      Total ($)
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                              <tbody id="dt_fin_detail">
                                <tr>
                                  <td className="talft">
                                    <Input size="large" className="w-100" />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <InputNumber
                                      min={1}
                                      max={100000}
                                      defaultValue={0}
                                    />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <InputNumber
                                      min={1}
                                      max={100000}
                                      defaultValue={0}
                                    />
                                  </td>
                                  <td>
                                    <span className="dsign2" />
                                    <span className="dsign2 text-right">
                                      <InputNumber
                                        min={1}
                                        max={100000}
                                        defaultValue={0}
                                        formatter={(value) =>
                                          `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value?.replace(
                                            /\$\s?|(,*)/g,
                                            ""
                                          ) as unknown as number
                                        }
                                      />
                                    </span>
                                  </td>
                                  <td>
                                    <span className="dsign2" />
                                    <span className="dsign2 text-right">
                                      <InputNumber
                                        min={1}
                                        max={100000}
                                        defaultValue={0}
                                        formatter={(value) =>
                                          `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value?.replace(
                                            /\$\s?|(,*)/g,
                                            ""
                                          ) as unknown as number
                                        }
                                      />
                                    </span>
                                  </td>
                                  <td align="right">
                                    <span className="" />
                                    <span className="text-right">
                                      <InputNumber
                                        min={1}
                                        max={100000}
                                        defaultValue={0}
                                        formatter={(value) =>
                                          `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value?.replace(
                                            /\$\s?|(,*)/g,
                                            ""
                                          ) as unknown as number
                                        }
                                      />
                                    </span>
                                  </td>
                                  <td align="right">
                                    <span className="" />
                                    <span className="text-right">
                                      <InputNumber
                                        min={1}
                                        max={100000}
                                        defaultValue={0}
                                        formatter={(value) =>
                                          `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )
                                        }
                                        parser={(value) =>
                                          value?.replace(
                                            /\$\s?|(,*)/g,
                                            ""
                                          ) as unknown as number
                                        }
                                      />
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                              <tbody>
                                <tr>
                                  <td colSpan={5} align="right">
                                    Subtotal
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_install_subtotal"
                                    >
                                      0.00
                                    </span>
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_monthly_subtotal"
                                    >
                                      0.00
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={5} align="right">
                                    Excise Duty@ 10%
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_excise_duty_install"
                                    >
                                      0.00
                                    </span>
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_excise_duty_monthly"
                                    >
                                      30.00
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={5} align="right" id="vat_label">
                                    VAT @ 14.50%
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_install_vat"
                                    >
                                      0.00
                                    </span>
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_monthly_vat"
                                    >
                                      43.50
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={5} align="right">
                                    <strong>Total(Incl VAT)</strong>
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt text-right"
                                      id="dt_install_total"
                                    >
                                      0.00
                                    </span>
                                  </td>
                                  <td>
                                    <span className="dsign2">$</span>
                                    <span
                                      className="valtxt"
                                      id="dt_monthly_total"
                                    >
                                      373.50
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col flex="0 1 300px">
                    <span className="ant-modal-card-title">SO Preview</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Flex gap={0} vertical>
                        <span
                          className="single-liner text-left"
                          style={{
                            marginBottom: 0,
                            fontSize: 16,
                            fontWeight: 800,
                          }}
                        >
                          <img
                            src="https://acmeprintco.com/wp-content/themes/understrap-child-master/images/logo.png"
                            width={100}
                          />
                        </span>
                        <span
                          className="single-liner text-left"
                          style={{
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: 800,
                          }}
                        >
                          ACME (Pvt) Ltd
                        </span>

                        <span
                          className="single-liner text-left alink"
                          style={{
                            marginBottom: 10,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          No. 21 Samora Machel Avenue, <br />
                          Harare, Zimbabwe
                          <br />
                          Reg: 0215/2013
                          <br />
                          VAT: 1005596969
                          <br />
                          MSA: 254000588
                        </span>
                        <span
                          className="single-liner text-left alink"
                          style={{
                            marginBottom: 0,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          <PhoneOutlined />
                          &nbsp;&nbsp;+263 772 123 456
                        </span>
                        <span
                          className="single-liner text-left alink"
                          style={{
                            marginBottom: 0,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          <MailOutlined />
                          &nbsp;&nbsp;info@acme.co.zw
                        </span>
                      </Flex>
                      <br />
                      <Space direction="vertical">
                        <Space direction="vertical">
                          <h3 className="summary-title">
                            <strong>SITE DETAILS</strong>
                          </h3>

                          <span className="summary-values">
                            <strong>Ready For Service Date:</strong>
                            <br />
                            2025-12-31
                          </span>

                          <span className="summary-values">
                            <strong>Created Datee:</strong>
                            <br />
                            2025-12-25
                          </span>

                          <span className="summary-values">
                            <strong>Site:</strong>
                            <br />
                            Avondale, Harare
                          </span>

                          <span className="summary-values">
                            <strong>City:</strong>
                            <br />
                            Harare
                          </span>

                          <span className="summary-values">
                            <strong>Country:</strong>
                            <br />
                            Zimbabwe
                          </span>
                        </Space>
                        <Space direction="vertical">
                          <h3 className="summary-title">
                            <strong>SERVICE DETAILS</strong>
                          </h3>

                          <span className="summary-values">
                            <strong>SFDC Opportunity No:</strong>
                            <br />
                            DRC938473
                          </span>

                          <span className="summary-values">
                            <strong>Technology Type:</strong>
                            <br />
                            Enterprise Business
                          </span>

                          <span className="summary-values">
                            <strong>Service Type:</strong>
                            <br />
                            LAN Extension Installation
                          </span>

                          <span className="summary-values">
                            <strong>Order Type:</strong>
                            <br />
                            Physical
                          </span>

                          <span className="summary-values">
                            <strong>Bandwidth:</strong>
                            <br />
                            1024 kbps
                          </span>

                          <span className="summary-values">
                            <strong>Start Point:</strong>
                            <br />
                            21 Samora Machel Ave, Harare
                          </span>

                          <span className="summary-values">
                            <strong>End Point:</strong>
                            <br />
                            21 Samora Machel Ave, Harare
                          </span>

                          <span className="summary-values">
                            <strong>GPS Coordinates:</strong>
                            <br />
                            -18.225455,34.55445
                          </span>

                          <span className="summary-values">
                            <strong>ISP Name:</strong>
                            <br />
                            Liquid Telecomms Zimbabwe
                          </span>

                          <span className="summary-values">
                            <strong>Account Manager:</strong>
                            <br />
                            Sheila Hwititi
                          </span>
                        </Space>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Modal>

              <Modal
                centered
                title="Create New Customer"
                style={{ top: 20 }}
                width={1320}
                open={modal2Open}
                onOk={() => setModal2Open(false)}
                onCancel={() => setModal2Open(false)}
                className="new-so"
              >
                <Space direction="vertical" size={24}>
                  <Row
                    className="w-100"
                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                  >
                    <Col flex="1 1 200px">
                      <Space direction="vertical" size={24}>
                        <div className="section-card">
                          <span className="ant-modal-card-title">
                            Company Contact Details
                          </span>
                          <div className="h-8" />
                          <div
                            className="dashboard-card shadow-1"
                            style={{
                              padding: 24,
                              textAlign: "left",
                              background: colorBgContainer,
                              borderRadius: borderRadiusLG,
                            }}
                          >
                            <Space direction="vertical" size={24}>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Customer Name:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      MSA Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      VAT Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Registration Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>

                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Physical Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Postal Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Phone Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Email Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>
                            </Space>
                          </div>
                        </div>

                        <div className="section-card">
                          <span className="ant-modal-card-title">
                            Primary Contact
                          </span>
                          <div className="h-8" />
                          <div
                            className="dashboard-card shadow-1"
                            style={{
                              padding: 24,
                              textAlign: "left",
                              background: colorBgContainer,
                              borderRadius: borderRadiusLG,
                            }}
                          >
                            <Space direction="vertical" size={24}>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Full Name:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Designation:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Phone Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Email Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>
                            </Space>
                          </div>
                        </div>

                        <div className="section-card">
                          <span className="ant-modal-card-title">
                            Billing Contact
                          </span>
                          <div className="h-8" />
                          <div
                            className="dashboard-card shadow-1"
                            style={{
                              padding: 24,
                              textAlign: "left",
                              background: colorBgContainer,
                              borderRadius: borderRadiusLG,
                            }}
                          >
                            <Space direction="vertical" size={24}>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Full Name:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Designation:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Phone Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Email Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>
                            </Space>
                          </div>
                        </div>

                        <div className="section-card">
                          <span className="ant-modal-card-title">
                            Technical Contact
                          </span>
                          <div className="h-8" />
                          <div
                            className="dashboard-card shadow-1"
                            style={{
                              padding: 24,
                              textAlign: "left",
                              background: colorBgContainer,
                              borderRadius: borderRadiusLG,
                            }}
                          >
                            <Space direction="vertical" size={24}>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Full Name:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Designation:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Phone Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Email Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>
                            </Space>
                          </div>
                        </div>
                        <div className="section-card">
                          <span className="ant-modal-card-title">
                            Site Contact
                          </span>
                          <div className="h-8" />
                          <div
                            className="dashboard-card shadow-1"
                            style={{
                              padding: 24,
                              textAlign: "left",
                              background: colorBgContainer,
                              borderRadius: borderRadiusLG,
                            }}
                          >
                            <Space direction="vertical" size={24}>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Full Name:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Designation:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Phone Number:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>

                                <Col
                                  className="gutter-row"
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={6}
                                  xl={6}
                                >
                                  <div className="input-wrapper">
                                    <span className="input-label">
                                      Email Address:
                                    </span>
                                    <Input size="large" className="w-100" />
                                  </div>
                                </Col>
                              </Row>
                            </Space>
                          </div>
                        </div>
                      </Space>
                    </Col>
                    <Col flex="0 1 300px">
                      <span className="ant-modal-card-title">
                        Preview: Company Details
                      </span>
                      <div className="h-8" />
                      <div
                        className="dashboard-card shadow-1"
                        style={{
                          padding: 24,
                          textAlign: "left",
                          background: colorBgContainer,
                          borderRadius: borderRadiusLG,
                        }}
                      >
                        <Flex gap={0} vertical>
                          <span
                            className="single-liner text-left"
                            style={{
                              marginBottom: 0,
                              fontSize: 16,
                              fontWeight: 800,
                            }}
                          >
                            <img
                              src="https://acmeprintco.com/wp-content/themes/understrap-child-master/images/logo.png"
                              width={100}
                            />
                          </span>
                          <span
                            className="single-liner text-left"
                            style={{
                              marginBottom: 10,
                              fontSize: 16,
                              fontWeight: 800,
                            }}
                          >
                            ACME (Pvt) Ltd
                          </span>

                          <span
                            className="single-liner text-left alink"
                            style={{
                              marginBottom: 10,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            No. 21 Samora Machel Avenue, <br />
                            Harare, Zimbabwe
                            <br />
                            Reg: 0215/2013
                            <br />
                            VAT: 1005596969
                            <br />
                            MSA: 254000588
                          </span>
                          <span
                            className="single-liner text-left alink"
                            style={{
                              marginBottom: 0,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <PhoneOutlined />
                            &nbsp;&nbsp;+263 772 123 456
                          </span>
                          <span
                            className="single-liner text-left alink"
                            style={{
                              marginBottom: 0,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <MailOutlined />
                            &nbsp;&nbsp;info@acme.co.zw
                          </span>
                        </Flex>
                      </div>

                      <br />

                      <span className="ant-modal-card-title">
                        Preview: Billing Contact
                      </span>
                      <div className="h-1" />
                      <CustomerContactCard
                        fullname="Primrose Chikwaka"
                        designation="Finance Manager"
                        phoneNumber="+263 772 123 456"
                        emailAddress="primrose.chikwaka@acme.co.zw"
                      />

                      <br />

                      <span className="ant-modal-card-title">
                        Preview: Technical Contact
                      </span>
                      <div className="h-1" />
                      <CustomerContactCard
                        fullname="Primrose Chikwaka"
                        designation="Finance Manager"
                        phoneNumber="+263 772 123 456"
                        emailAddress="primrose.chikwaka@acme.co.zw"
                      />

                      <br />

                      <span className="ant-modal-card-title">
                        Preview: Site Contact
                      </span>
                      <div className="h-1" />
                      <CustomerContactCard
                        fullname="Primrose Chikwaka"
                        designation="Finance Manager"
                        phoneNumber="+263 772 123 456"
                        emailAddress="primrose.chikwaka@acme.co.zw"
                      />
                    </Col>
                  </Row>
                </Space>
              </Modal>

              <Modal
                centered
                title="Update Task"
                style={{ top: 20 }}
                width={750}
                open={modal3Open}
                onOk={() => setModal3Open(false)}
                onCancel={() => setModal3Open(false)}
                className="new-so"
              >
                <Space direction="vertical" size={24}>
                  <div className="section-card">
                    <span className="ant-modal-card-title">SO Task</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                Task For Milestone:
                              </span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>

                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">Task Notes:</span>
                              <TextArea
                                size="large"
                                className="w-100"
                                placeholder="Enter your notes here"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Space>
                    </div>
                  </div>
                  <div className="section-card">
                    <span className="ant-modal-card-title">
                      Task Attachments:
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                      </Space>
                    </div>
                  </div>
                </Space>
              </Modal>

              <Modal
                centered
                title="Update Notes"
                style={{ top: 20 }}
                width={750}
                open={modal4Open}
                onOk={() => setModal4Open(false)}
                onCancel={() => setModal4Open(false)}
                className="new-so"
              >
                <Space direction="vertical" size={24}>
                  <div className="section-card">
                    <span className="ant-modal-card-title">SO Stage</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                Notes For Stage:
                              </span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>

                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">So Notes:</span>
                              <TextArea
                                size="large"
                                className="w-100"
                                placeholder="Enter your notes here"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Space>
                    </div>
                  </div>
                  <div className="section-card">
                    <span className="ant-modal-card-title">
                      File Attachments:
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                      </Space>
                    </div>
                  </div>
                </Space>
              </Modal>

              <Modal
                centered
                title="Revert SO"
                style={{ top: 20 }}
                width={750}
                open={modal5Open}
                onOk={() => setModal5Open(false)}
                onCancel={() => setModal5Open(false)}
                className="new-so"
              >
                <Space direction="vertical" size={24}>
                  <div className="section-card">
                    <span className="ant-modal-card-title">SO Stage</span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                Revert To Stage:
                              </span>
                              <Input size="large" className="w-100" />
                            </div>
                          </Col>

                          <Col
                            className="gutter-row mb-16px"
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className="input-wrapper">
                              <span className="input-label">
                                Reversion Notes:
                              </span>
                              <TextArea
                                size="large"
                                className="w-100"
                                placeholder="Enter your notes here"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Space>
                    </div>
                  </div>
                  <div className="section-card">
                    <span className="ant-modal-card-title">
                      File Attachments:
                    </span>
                    <div className="h-8" />
                    <div
                      className="dashboard-card shadow-1"
                      style={{
                        padding: 24,
                        textAlign: "left",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      <Space direction="vertical" size={24}>
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                      </Space>
                    </div>
                  </div>
                </Space>
              </Modal>
            </>
          ) : (
            <LoginView onLogin={setIsLoggedIn} />
          )}
        </>
        )}
      </>
    </Router>
  );
};

export default App;
