import {
  Breadcrumb,
  Row,
  Col,
  Tabs,
  Flex,
  Button,
  TabsProps,
  Space,
  Modal,
  Input,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import WorkFlowListItem from "../WorkFlowListItem";
import TextArea from "antd/es/input/TextArea";
import NoData from "../NoData";
import Editor from "react-simple-wysiwyg";
const api = new AxiosAPI();

const breadcrumbItems = [{ title: "Home" }, { title: "Workflows" }];

const WorkflowsView = (params: any) => {
  const { colorBgContainer, borderRadiusLG } = params;

  const { Title } = Typography;

  const [newWorkflowModalOpen, setNewWorkflowModalOpen] = useState(false);

  const [listViewItems, setListViewItems] = useState([]);

  const [newItemTitle, setNewItemTitle] = useState("");

  const [newItemDescription, setNewItemDescription] = useState("");

  useEffect(() => {
    api
      .getWorkflows()
      .then((listViewItemsList: any) => {
        console.log(
          "All Items: listViewItemsList : Workflows",
          listViewItemsList
        );
        setListViewItems(listViewItemsList);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  const [workFlowMeta, setWorkFlowMeta] = useState({ timestamp: Date.now() });

  const [workFlowState, setWorkFlowState] = useState("DRAFT");

  const saveListItem = async () => {
    console.log("Save Request:", [
      newItemTitle,
      newItemDescription,
      workFlowMeta,
      workFlowState,
    ]);

    const docResponse = await api.saveWorkflow(
      newItemTitle,
      newItemDescription,
      workFlowState,
      workFlowMeta
    );

    console.log("docResponse:", docResponse);

    window.location.reload();
  };

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Workflows",
      children: "Content of Tab Pane 1",
    },
  ];

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Workflows</Title>

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
                  onClick={() => setNewWorkflowModalOpen(true)}
                >
                  New Workflow
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {Array.isArray(listViewItems) && listViewItems.length > 0 ? (
            <>
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
                  <WorkFlowListItem listItem={listItem} />
                </Col>
              ))}
            </>
          ) : (
            <NoData
              onButtonClick={() => setNewWorkflowModalOpen(true)}
              buttonLabel={"New Workflow"}
              description="No workflow configured yet"
            />
          )}
        </Row>
      </Content>

      <Modal
        centered
        title="Create A New Workflow"
        style={{ top: 20 }}
        width={750}
        open={newWorkflowModalOpen}
        onOk={() => saveListItem()}
        onCancel={() => setNewWorkflowModalOpen(false)}
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
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Workflow Title:</span>
                      <Input
                        maxLength={64}
                        count={{
                          show: true,
                          max: 56,
                        }}
                        size="large"
                        className="w-100"
                        placeholder="Enter workflow title here"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
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
                      <span className="input-label">Workflow Description:</span>
                      <Editor
                        className="w-100"
                        placeholder="Enter your workflow description here"
                        value={newItemDescription}
                        onChange={(e) => {
                          setNewItemDescription(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default WorkflowsView;
