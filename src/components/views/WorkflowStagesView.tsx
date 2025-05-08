import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps, Space, Modal, Input, Result } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import WorkFlowListItem from '../WorkFlowListItem.tsx';
import TextArea from "antd/es/input/TextArea";
import WorkflowStageListItem from '../WorkflowStageListItem.tsx';

const api = new AxiosAPI();

const breadcrumbItems = [
  { title: "Home" },
  { title: "Workflow Stages" },
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

const workflowId: any = getUrlParameter("id");

const WorkflowStagesView = (params: any) => {

  const { colorBgContainer, borderRadiusLG, listItem } = params;

  const { Title } = Typography;

  const [newWorkflowStageModalOpen, setNewWorkflowStageModalOpen] = useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const [listViewItems, setListViewItems] = useState([]);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [roleid, setRoleid] = useState("");

  useEffect(() => {
    api
      .getWorkflowStages(workflowId)
      .then((listViewItemsList: any) => {
        console.log(
          "All Items: listViewItemsList : Workflow Stages",
          listViewItemsList
        );
        setListViewItems(listViewItemsList);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  const saveListItem = async () => {
    console.log("Save Request:", [
      firstname,
      lastname,
      email,
      password,
      roleid,
    ]);

    const docResponse = await api.saveWorkflowStage(
      firstname,
      lastname,
      email,
      password,
      roleid
    );

    console.log("docResponse:", docResponse);

    setNewWorkflowStageModalOpen(false);
    setModalAjaxResultOpen(true);

    setModalAjaxResultTitle(`Success!`);
    setModalAjaxResultSubTitle(`Workflow Stage ${firstname} ${lastname} data saved!`);
  };

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Active Workflow Stages",
      children: "Content of Tab Pane 1",
    },
    {
      key: "1",
      label: "Disabled Workflow Stages",
      children: "Content of Tab Pane 1",
    },
  ];

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Workflow Stages</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

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
                  onClick={() => setNewWorkflowStageModalOpen(true)}
                >
                  New Workflow Stage
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {listViewItems.map((listItem: any, listItemIndex: number) => (
            <Col
              id={listItem.id}
              key={listItemIndex}
              className="gutter-row"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <WorkflowStageListItem listItem={listItem} />
            </Col>
          ))}
        </Row>
      </Content>

      <Modal
        centered
        title="Create A New Workflow Stage"
        style={{ top: 20 }}
        width={750}
        open={newWorkflowStageModalOpen}
        onOk={() => saveListItem()}
        onCancel={() => setNewWorkflowStageModalOpen(false)}
        className="new-so"
      >
        <Space direction="vertical" size={24}>
          <div className="section-card">
            <div
              className="dashboard-card shadow-1"
              style={{
                padding: 24,
                textAlign: "left",
                background: "#ffffff",
                borderRadius: borderRadiusLG,
              }}
            >
              <Space direction="vertical" size={24} className="w-100">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">First Name:</span>
                      <Input
                        size="large"
                        className="w-100"
                        placeholder="Enter first here"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>
                  </Col>

                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Last Name:</span>
                      <Input
                        size="large"
                        className="w-100"
                        placeholder="Enter workflowStage last name here"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
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
                      <span className="input-label">Email:</span>
                      <Input
                        size="large"
                        className="w-100"
                        placeholder="Enter workflowStage email address here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </Col>

                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Password:</span>
                      <Input
                        type="password"
                        size="large"
                        className="w-100"
                        placeholder="Enter workflowStage password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </Col>

                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Confirm Password:</span>
                      <Input
                        type="password"
                        size="large"
                        className="w-100"
                        placeholder="Enter workflowStage password here"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>

      <Modal centered open={modalAjaxResultOpen} footer={[<></>]}>
        <Result
          status="success"
          title={modalAjaxResultTitle}
          subTitle={modalAjaxResultSubTitle}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setModalAjaxResultOpen(false);
                window.location.reload();
              }}
            >
              Close
            </Button>,
          ]}
        />
      </Modal>
    </>
  );
};

export default WorkflowStagesView;
