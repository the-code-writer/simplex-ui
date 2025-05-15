import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps, Space, Modal, Input, Result, Select, message } from 'antd';
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import TextArea from "antd/es/input/TextArea";
import WorkflowStageListItem from '../WorkflowStageListItem.tsx';
import NoData from "../NoData.tsx";
import { UserOutlined } from "@ant-design/icons";

const api = new AxiosAPI();

import { notification } from "antd";
import React from "react";

const Context = React.createContext({ name: 'Default' }); 

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

const name: any = getUrlParameter("name");

const pageTitle: any = getUrlParameter("title");

const breadcrumbItems = [
  { title: "Home" },
  { title: "Workflows" },
  { title: name },
  { title: "Stages" },
];

const WorkflowStagesView = (params: any) => {

  const { colorBgContainer, borderRadiusLG, listItem } = params;

  const { Title } = Typography;

  const [newWorkflowStageModalOpen, setNewWorkflowStageModalOpen] = useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const [listViewItems, setListViewItems] = useState([]);

  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [roleid, setRoleid] = useState("");

  const [optionsUserRoles, setOptionsUserRoles] = useState([]);

  useEffect(() => {

    api
      .getWorkflowStages(workflowId)
      .then((listViewItemsList: any) => {
        console.log(
          "All Items: listViewItemsList : Workflow Stages",
          workflowId,
          [listViewItemsList]
        );
        if (listViewItemsList.length > 0) {
          const sortedListItems = listViewItemsList.sort(
            (a:any, b:any) => a.stageorder - b.stageorder
          );
          setListViewItems(sortedListItems);
        } else {
          console.log(
            "Empty Workflow Stages", 
          );
        }
        
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
    
    api
      .getUserRoles()
      .then((userRoles: any) => {
        console.log("All Items: userRoles", userRoles);

        // Transform API response to your desired format
        const formattedRoles = userRoles.map((roleObj: any) => ({
          label: roleObj.role,
          value: roleObj.id,
          emoji: <UserOutlined />, // or a placeholder if needed
          desc: roleObj.role,
        }));

        // Append the Super Admin option
        const updatedRoles = [
          ...formattedRoles,
          {
            label: "Super Admin",
            value: "admin",
            emoji: <UserOutlined />,
            desc: "Admin",
          },
        ];

        setOptionsUserRoles(updatedRoles);

      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
    
  }, []);

  const [apiNotification, contextHolder] = notification.useNotification();

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleChangeSelectedRoles = (value: string[]) => {
    console.log(`selected ${value}`);
    setSelectedRoles(value); // This updates the state
  };

  const saveListItem = async () => {

    console.log("Save Request:", [newItemTitle, newItemDescription, roleid]);

    const docResponse = await api.saveWorkflowStage(
      newItemTitle,
      newItemDescription,
      workflowId
    );

    console.log("docResponse:", docResponse, [optionsUserRoles]);

    selectedRoles.map((role: any) => {
      api
        .assignRoleToWorkflowStage(role, docResponse.id)
        .then((response: any) => {
          if (response.message === "ASSIGNED") {
            console.log({
              //apiNotification.info
              message: `Role Assigned`,
              description: `Role '${role}' has been assigned to Stage: ${newItemTitle}`,
              placement: "bottomRight",
            });
          }
        })
        .catch((error) => {
          console.error("Saving role failed:", error);
        });
    });

    setNewWorkflowStageModalOpen(false);
    setModalAjaxResultOpen(true);

    setModalAjaxResultTitle(`Success!`);
    setModalAjaxResultSubTitle(`Workflow Stage ${newItemTitle} saved successfully!`);

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


const contextValue = useMemo(() => ({ name: "Ant Design" }), []);


  return (
    <>
      <Context.Provider value={contextValue}>
      {contextHolder}
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
                  New Workflow Stage
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
                  <WorkflowStageListItem
                    listItemIndex={listItemIndex}
                    listItem={listViewItem}
                  />
                </Col>
              ))}
            </>
          ) : (
            <NoData
              onButtonClick={() => setNewWorkflowStageModalOpen(true)}
              buttonLabel={"New Workflow Stage"}
              description="No workflow stages configured yet"
            />
          )}
        </Row>
      </Content>
      </Context.Provider>

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
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Stage Title:</span>
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
                  >
                    <div className="input-wrapper">
                      <span className="input-label">Stage Description:</span>
                      <TextArea
                        size="large"
                        className="w-100"
                        placeholder="Enter your workflow description here"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
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
                    <hr />
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
                      <span className="input-label">Stage User Roles:</span>
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="select one or more user roles"
                        defaultValue={[]}
                        onChange={handleChangeSelectedRoles}
                        options={optionsUserRoles}
                        optionRender={(option) => (
                          <Space>
                            <span role="img" aria-label={option.data.label}>
                              {option.data.emoji}
                            </span>
                            {option.data.desc}
                          </Space>
                        )}
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
