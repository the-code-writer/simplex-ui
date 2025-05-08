import React, { useEffect, useState } from "react";
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
  Row,
  Space,
  theme,
} from "antd";
import {
  FileOutlined,
  FlagOutlined,
  InboxOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { createStyles } from "antd-style";
import TextArea from "antd/es/input/TextArea";

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

interface Task {
  description: string | null;
  id: string;
  datecreated: string | null;
  createdby: {
    email: string | null;
    firstname: string | null;
    id: string;
    middlename: string | null;
    lastname: string | null;
    enabled: boolean;
  };
  deleted: boolean;
  task: string;
  stage: string | null;
  taskorder: number;
}

interface MenuItem {
  label: string;
  key: string;
  icon: React.ReactNode;
}

function convertTasksToMenuItems(tasks: Task[]): MenuItem[] {
  return tasks.map((task) => ({
    label: task.task, // Use the 'task' property as label
    key: task.id, // Use the 'id' property as key
    icon: <FileOutlined />, // Use FileOutlined icon for all items
  }));
}

const UserRolesListItem: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { listItem } = params;

  const { styles } = useStyle();

  const [listItemDetailsModalOpen, setListItemDetailsModalOpen] =
    useState(false);

  const [listItemEditorModalOpen, setListItemEditorModalOpen] = useState(false);

  useEffect(() => {}, [listItem]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e);

    switch (e.key) {
      case "1": {
        setListItemDetailsModalOpen(true);
        break;
      }

      case "2": {
        window.location.href = `/workflow/stages?id=${listItem.id}`;
        break;
      }

      case "3": {
        setListItemEditorModalOpen(true);
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "View Workflow Details",
    },
    {
      key: "2",
      label: "View Workflow Stages",
    },
    {
      key: "3",
      label: "Edit Workflow",
    },
  ];

  const [newItemTitle, setNewItemTitle] = useState(listItem.title);

  const [newItemDescription, setNewItemDescription] = useState(
    listItem.description
  );

  const saveListItem = async () => {
    console.log("Save Request:", [newItemTitle, newItemDescription]);

    const docResponse = await api.saveWorkflow(
      newItemTitle,
      newItemDescription
    );

    console.log("docResponse:", docResponse);

    window.location.reload();
  };

  return (
    <>
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
          <Col className="gutter-row" xs={24} sm={24} md={20} lg={20} xl={20}>
            <div className="label-value-pair doc-descriptio10n">
              <span className="label">{listItem.role}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={4} lg={4} xl={4}>
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
                      <span className="input-label">Workflow Title:</span>
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
                      <span className="input-label">Workflow Description:</span>
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
                </Row>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>

      <Modal
        centered
        title="Workflow Details"
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
                </Row>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default UserRolesListItem;
