import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Card, Col, Flex, Progress, Row, Space } from "antd";
import { useEffect } from "react";

const JobsWrapper = (params: any) => {
  const { jobItems } = params;

  useEffect(() => {}, []);

  return (
    <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
        <Card
          bordered={false}
          title="My Jobs"
          style={{
            height: "100%",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              {jobItems.map((jobItem: any, jobItemIndex: number) => (
                <Card
                  className="job-card"
                  key={jobItemIndex}
                  style={{ marginBottom: 12, padding: 0 }}
                >
                  <span className="job-title">
                    <strong>{jobItem.title}</strong>
                  </span>
                  <br />
                  <span className="job-number">Job #: 23434</span>
                </Card>
              ))}
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xl={6} lg={6} md={6} sm={24} xs={24}>
        <Card
          bordered={false}
          title="Job Tasks"
          style={{
            height: "100%",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Col xl={24} lg={24} md={12} sm={24} xs={24}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <span className="job-title">
                    <strong>Progress</strong>
                                  </span>
                                  <br />
                <Progress
                  percent={50}
                  status="active"
                  strokeColor={{ from: "#108ee9", to: "cyan" }}
                />
                </div>

                <Card
                  className="job-task"
                  style={{ marginBottom: 12, padding: 0 }}
                >
                  <span className="job-title">
                    <strong>Job Task Title 1</strong>
                  </span>
                  <br />
                  <span className="job-number">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                  <br />
                  <Flex style={{ marginTop: 12 }}>
                    <CheckCircleFilled
                      style={{ color: "green", marginRight: 8 }}
                    />{" "}
                    Completed
                  </Flex>
                </Card>

                <Card
                  className="job-task"
                  style={{ marginBottom: 12, padding: 0 }}
                >
                  <span className="job-title">
                    <strong>Job Task Title 1</strong>
                  </span>
                  <br />
                  <span className="job-number">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                  <br />
                  <span className="job-status">
                    Due: <span style={{ color: "orange" }}>Today</span>
                  </span>
                  <br />
                  <Button key="ellipsis" style={{ marginTop: 12 }}>
                    Begin Task
                  </Button>
                </Card>

                <Card
                  className="job-task"
                  style={{ marginBottom: 12, padding: 0 }}
                >
                  <span className="job-title">
                    <strong>Job Task Title 1</strong>
                  </span>
                  <br />
                  <span className="job-number">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                  <br />
                  <span className="job-status">
                    Status: <span style={{ color: "red" }}>Overdue</span>
                  </span>
                  <br />
                  <Button key="ellipsis" style={{ marginTop: 12 }}>
                    Begin Task
                  </Button>
                </Card>

                <Card
                  className="job-task"
                  style={{ marginBottom: 12, padding: 0 }}
                >
                  <span className="job-title">
                    <strong>Job Task Title 1</strong>
                  </span>
                  <br />
                  <span className="job-number">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </span>
                  <br />
                  <Button type="primary" key="ellipsis" style={{ marginTop: 12 }}>
                    Complete Task
                  </Button>
                </Card>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xl={10} lg={10} md={10} sm={24} xs={24}>
        <Card
          bordered={false}
          title="Job Details"
          style={{
            height: "100%",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Col xl={24} lg={24} md={12} sm={24} xs={24}>
              <div id="container"></div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};
export default JobsWrapper;
