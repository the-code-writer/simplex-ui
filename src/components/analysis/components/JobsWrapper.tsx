import { AuditOutlined, CarryOutOutlined, CheckCircleFilled, FileAddOutlined, FileDoneOutlined, FileSearchOutlined, FormOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Flex, Input, Progress, Row, Space, Tag } from "antd";
import { useEffect, useState } from "react";

import qrCode from "../../../assets/qrcode.png";

import ltzLogo from "../../../assets/ltz.png";
import { ReactFormGenerator } from "react-form-builder2";
import NoData from "../../NoData";
import DocumentCreator from "../../DocumentCreator";
import ActivityTimeLine from "../../ActivityTimeline";
const { Search } = Input;
const JobsWrapper = (params: any) => {
  
  const { jobItems } = params;

  const [formData, setFormData] = useState<any>([]);

  const [docItemx, setDocItem] = useState<any>();

  useEffect(() => {
    const formDetailsLocal = localStorage.getItem("form_details");

    if (formDetailsLocal) {
      const formDataLocalObject = JSON.parse(formDetailsLocal);

      console.log(` ::: formDataLocalObject ::: `, formDataLocalObject);

      setFormData(formDataLocalObject.listdocumentsections);
    }
  }, []);

  return (
    <>
      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
        <Col xl={6} lg={6} md={6} sm={24} xs={24}>
          <Card
            className="xcard"
            bordered={false}
            title="My Jobs"
            style={{
              height: "100%",
            }}
          >
            <Input
              size="large"
              placeholder="input search text"
              allowClear
              style={{ width: "100%" }}
              suffix={<SearchOutlined />}
            />

            <div className="xscroller w-100" style={{ paddingTop: 12 }}>
              <Row style={{ width: "100%" }}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  {jobItems
                    .reverse()
                    .map((jobItem: any, jobItemIndex: number) => (
                      <Card
                        className={`job-card ${
                          typeof docItemx !== "undefined" &&
                          docItemx.id === jobItem.id
                            ? "active"
                            : ""
                        }`}
                        id={jobItem.id}
                        key={jobItemIndex}
                        onClick={() => setDocItem(jobItem)}
                        style={{ marginBottom: 12, padding: 0 }}
                      >
                        <span className="job-title">
                          <strong>{jobItem.title}</strong>
                        </span>
                        <br />
                        <span className="job-title">{jobItem.description}</span>
                        <br />
                        <Flex
                          className="w-100"
                          justify="space-between"
                          style={{ marginTop: 6 }}
                        >
                          <span className="job-number">
                            Job #: CLM 435-00{jobItemIndex + 1}
                          </span>
                          {/* 
                        <Tag color="#0091ff" style={{ color: "#ffffff" }}>
                          New
                        </Tag>
                        */}
                        </Flex>
                        <Flex
                          className="w-100"
                          justify="space-between"
                          style={{ marginTop: 6 }}
                        >
                          <Tag>Police report filed</Tag>
                          <span>3hrs ago</span>
                        </Flex>
                      </Card>
                    ))}
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={6} sm={24} xs={24}>
          <Card
            className="xcard"
            bordered={false}
            title="Tasks"
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
                    <br />
                    <br />
                  </div>

                  <Flex align="flex-start" gap={12}>
                    <FormOutlined style={{ fontSize: 28, color: "#999999" }} />
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
                      <Tag
                        color="green"
                        style={{ color: "#389e0d !important", marginTop: 12 }}
                      >
                        <Flex>Completed</Flex>
                      </Tag>
                    </Card>
                  </Flex>
                  <Flex align="flex-start" gap={12}>
                    <FileSearchOutlined
                      style={{ fontSize: 28, color: "#999999" }}
                    />
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
                      <Button type="primary" style={{ marginTop: 12 }}>
                        Start
                      </Button>
                    </Card>
                  </Flex>
                  <Flex align="flex-start" gap={12}>
                    <FileAddOutlined
                      style={{ fontSize: 28, color: "#999999" }}
                    />
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
                      <Button type="primary" style={{ marginTop: 12 }}>
                        Start
                      </Button>
                    </Card>
                  </Flex>
                  <Flex align="flex-start" gap={12}>
                    <AuditOutlined style={{ fontSize: 28, color: "#999999" }} />
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
                      <Space>
                        <Button
                          type="primary"
                          key="ellipsis"
                          style={{ marginTop: 12 }}
                        >
                          Approve
                        </Button>
                        <Button
                          color="red"
                          type="default"
                          key="ellipsis"
                          style={{ marginTop: 12 }}
                        >
                          Decline
                        </Button>
                      </Space>
                    </Card>
                  </Flex>
                  <Flex align="flex-start" gap={12}>
                    <CarryOutOutlined
                      style={{ fontSize: 28, color: "#999999" }}
                    />
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
                      <Button
                        type="primary"
                        key="ellipsis"
                        style={{ marginTop: 12 }}
                      >
                        Complete Task
                      </Button>
                    </Card>
                  </Flex>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card
            bordered={false}
            title="Job Details"
            style={{
              height: "100%",
            }}
          >
            <Row style={{ width: "100%", maxHeight: 800, overflowY: "scroll" }}>
              <Col xl={24} lg={24} md={12} sm={24} xs={24}>
                <DocumentCreator
                  docItem={docItemx}
                  formData={formData}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Collapse
            className="activity-timeline-wrapper"
            size="large"
            style={{ marginTop: 32 }}
            items={[
              {
                key: "1",
                label: (
                  <h6>
                    <strong>Job Activity Timeline</strong>
                  </h6>
                ),
                children: <ActivityTimeLine />,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};
export default JobsWrapper;
