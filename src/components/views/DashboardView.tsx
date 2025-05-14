import {
  Breadcrumb,
  Row,
  Col,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import Analysis from "../analysis/index";

const breadcrumbItems = [
  { title: "Home" },
  { title: "Dashboard" },
];

const DashboardView = () => {
  const { Title } = Typography;

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Dashboard</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Analysis
              dashboardAndanalysis={{
                visitData: [],
                visitData2: [],
                salesData: [],
                searchData: [],
                offlineData: [],
                offlineChartData: [],
                salesTypeData: [],
                salesTypeDataOnline: [],
                salesTypeDataOffline: [],
                radarData: [],
              }}
              loading={false}
            />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default DashboardView;
