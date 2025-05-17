import React, { createContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  message,
  Modal,
  Result,
  Row,
  Select,
  Space,
  theme,
} from "antd";
import {
  FileOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { createStyles } from "antd-style";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI, CreatedBy } from "../libs/AxiosAPI";

const api = new AxiosAPI();

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(180deg, #1677ff, #0052c4);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const ReachableContext = createContext<string | null>(null);

const WorkflowStageListItem: any = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { listItem, listItemIndex } = params;

  const { styles } = useStyle();

  const [modal, contextHolder] = Modal.useModal();

  const [listItemDetailsModalOpen, setListItemDetailsModalOpen] =
    useState(false);

  const [listItemEditorModalOpen, setListItemEditorModalOpen] = useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e);

    console.log("listItem ::: 1", listItem);

    switch (e.key) {
      case "1": {
        setListItemDetailsModalOpen(true);
        break;
      }

      case "2": {
        setListItemEditorModalOpen(true);
        break;
      }

      case "3": {
        moveStepUp();
        break;
      }

      case "5": {
        window.location.href = `/workflow/stage/tasks?id=${listItem.id}&title=Workflow Stage Tasks&name=${listItem.title}`;
        break;
      }

      default: {
        break;
      }
    }
  };

  const moveStepUp = async () => {
    const config = {
      title: "Confirm Move Stage",
      content: <>`Are you sure you want to Move`</>,
    };

    const confirmed = await modal.confirm(config);

    console.log("MOVE UP", confirmed);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "View Stage Details",
    },
    {
      key: "2",
      label: "Edit Stage",
    },
    {
      key: "3",
      label: "Move Stage Up",
    },
    {
      key: "4",
      label: "Move Stage Down",
    },
    {
      key: "5",
      label: "View Stage Tasks",
    },
  ];

  const [newItemTitle, setNewItemTitle] = useState(listItem.title);

  const [newItemDescription, setNewItemDescription] = useState(
    listItem.description
  );

  const [optionsUserRoles, setOptionsUserRoles] = useState([]);

  useEffect(() => {
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

  const saveListItem = async () => {
    console.log("Save Request:", [
      newItemTitle,
      newItemDescription,
      listItem.workflowid,
    ]);

    const docResponse = await api.saveWorkflowStage(
      newItemTitle,
      newItemDescription,
      listItem.workflowid
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

    setListItemEditorModalOpen(true);
    setModalAjaxResultOpen(true);

    setModalAjaxResultTitle(`Success!`);
    setModalAjaxResultSubTitle(
      `Workflow Stage ${newItemTitle} updated successfully!`
    );
  };

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleChangeSelectedRoles = (value: string[]) => {
    console.log(`selected ${value}`);
    setSelectedRoles(value); // This updates the state
  };

  return (
    <>
      <ReachableContext.Provider value={listItem}>
        {contextHolder}
        <div
          className="dashboard-card shadow-1"
          style={{
            padding: 24,
            textAlign: "left",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            width: "100%",
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-descriptio10n">
                <span className="label">Stage Name:</span>
                <span className="value multi-liner">{listItem.title}</span>
              </div>
              <div className="label-value-pair doc-description">
                <span className="label">Stage Number:</span>
                <span className="value multi-liner">{listItemIndex + 1}</span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={9} lg={9} xl={9}>
              <div className="label-value-pair doc-date-created">
                <span className="value two-line-ellipsis">
                  {listItem.description}
                </span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={1} lg={1} xl={1}>
              <div className="doc-action-button">
                <ConfigProvider
                  button={{
                    className: styles.linearGradientButton,
                  }}
                >
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["1"],
                      onClick: handleMenuClick,
                    }}
                  >
                    <Button type="primary">
                      Select Action <EllipsisOutlined />
                    </Button>
                  </Dropdown>
                </ConfigProvider>
              </div>
            </Col>
          </Row>
        </div>
      </ReachableContext.Provider>

      <Modal
        centered
        title="Edit Workflow"
        style={{ top: 20 }}
        width={750}
        open={listItemEditorModalOpen}
        onOk={() => saveListItem()}
        onCancel={() => setListItemEditorModalOpen(false)}
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

      <Modal
        centered
        title="Workflow Stage Details"
        style={{ top: 20 }}
        open={listItemDetailsModalOpen}
        onOk={() => setListItemDetailsModalOpen(false)}
        onCancel={() => setListItemDetailsModalOpen(false)}
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
                      <span className="input-label">Workflow Title: </span>
                      {listItem.title}
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
                        Workflow Description:{" "}
                      </span>
                      {listItem.description}
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
                      <span className="input-label">Created By: </span>
                      {listItem.createdby.firstname}
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

export default WorkflowStageListItem;
