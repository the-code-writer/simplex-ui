import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps, Space, Modal, Input, Result, Checkbox, CheckboxProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import TextArea from "antd/es/input/TextArea";
import WorkflowStageTaskListItem from "../WorkflowStageTaskListItem.tsx";
import NoData from "../NoData.tsx";

const api = new AxiosAPI();

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

const stageId: any = getUrlParameter("id");

const pageTitle: any = getUrlParameter("title");

const name: any = getUrlParameter("name");

const breadcrumbItems = [
  { title: "Home" },
  { title: "Workflows" },
  { title: "Workflow Stages" },
  { title: "Stage Tasks" },
  { title: name },
];

const WorkflowStageTasksView = (params: any) => {
  const { colorBgContainer, borderRadiusLG, listItem } = params;

  const { Title } = Typography;

  const [newWorkflowStageModalOpen, setNewWorkflowStageModalOpen] =
    useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const [listViewItems, setListViewItems] = useState([]);

  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [roleid, setRoleid] = useState("");

  useEffect(() => {
    api
      .getWorkflowStageTasks(stageId)
      .then((listViewItemsList: any) => {
        console.log("All Items: listViewItemsList : Stage Tasks", stageId, [
          listViewItemsList,
        ]);
        const sortedListItems = listViewItemsList.sort(
          (a: any, b: any) => a.stageorder - b.stageorder
        );
        setListViewItems(sortedListItems);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  const saveListItem = async () => {

    console.log("Save Request:", [newItemTitle, newItemDescription, roleid]);

    const docResponse = await api.saveWorkflowStageTask(
      newItemTitle,
      moveToNextChangeValue,
      moveToPreviousChangeValue,
      stageId
    );

    console.log("docResponse:", docResponse);

    setNewWorkflowStageModalOpen(false);
    setModalAjaxResultOpen(true);

    setModalAjaxResultTitle(`Success!`);
    setModalAjaxResultSubTitle(
      `Stage Task ${newItemTitle} saved successfully!`
    );
  };

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Active Stage Tasks",
      children: "Content of Tab Pane 1",
    },
    {
      key: "1",
      label: "Disabled Stage Tasks",
      children: "Content of Tab Pane 1",
    },
  ];

  const [moveToPreviousChangeValue, setMoveToPreviousChangeValue] = useState(false);

  const onMoveToPreviousChange: CheckboxProps["onChange"] = (e: any) => {
    console.log(`onMoveToPreviousChange checked = ${e.target.checked}`);
    setMoveToPreviousChangeValue(e.target.checked);
    if (e.target.checked) {
      setMoveToNextChangeValue(false);
    }
  };

  const [moveToNextChangeValue, setMoveToNextChangeValue] =
    useState(false);

  const onMoveToNextChange: CheckboxProps["onChange"] = (e: any) => {
    console.log(`onMoveToNextChange checked = ${e.target.checked}`);
    setMoveToNextChangeValue(e.target.checked);
    if (e.target.checked) {
      setMoveToPreviousChangeValue(false);
    }
  };

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>{pageTitle + ": " + name}</Title>

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
                  New Stage Task
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {Array.isArray(listViewItems) && listViewItems.length > 0 ? (
            <>
              {listViewItems.map((listViewItem: any, listItemIndex: number) => (
                <Col
                  id={listViewItem.id}
                  key={`${listItemIndex}-${listViewItem.id}`}
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <WorkflowStageTaskListItem
                    listItemIndex={listItemIndex}
                    listItem={listViewItem}
                  />
                </Col>
              ))}
            </>
          ) : (
            <NoData
              onButtonClick={() => setNewWorkflowStageModalOpen(true)}
              buttonLabel={"New Stage Task"}
              description="No workflow stages configured yet"
            />
          )}
        </Row>
      </Content>

      <Modal
        centered
        title="Create A New Stage Task"
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
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Task Name:</span>
                      <Input
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
                  ><hr />
                  </Col>
                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Checkbox
                      checked={moveToPreviousChangeValue}
                      onChange={onMoveToPreviousChange}
                    >
                      Move document to <strong>previous</strong> stage
                    </Checkbox>
                  </Col>

                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                  >
                    <Checkbox
                      checked={moveToNextChangeValue}
                      onChange={onMoveToNextChange}
                    >
                      Move document to <strong>next</strong> stage
                    </Checkbox>
                  </Col>

                  {false && (
                    <Col
                      className="gutter-row mb-16px"
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <div className="input-wrapper">
                        <span className="input-label">Task Description:</span>
                        <TextArea
                          size="large"
                          className="w-100"
                          placeholder="Enter your workflow description here"
                          value={newItemDescription}
                          onChange={(e) =>
                            setNewItemDescription(e.target.value)
                          }
                          autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                      </div>
                    </Col>
                  )}
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

export default WorkflowStageTasksView;
