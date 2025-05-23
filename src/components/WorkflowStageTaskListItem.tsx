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
  Result,
  Row,
  Space,
  theme,
} from "antd";
import { FileOutlined, EllipsisOutlined } from '@ant-design/icons';

import { createStyles } from "antd-style";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI, CreatedBy } from '../libs/AxiosAPI';

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

interface MenuItem {
  label: string;
  key: string;
  icon: React.ReactNode;
}

const WorkflowStageTaskListItem: any = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { listItem, listItemIndex } = params;

  const { styles } = useStyle();

  const [listItemDetailsModalOpen, setListItemDetailsModalOpen] =
    useState(false);

  const [listItemEditorModalOpen, setListItemEditorModalOpen] = useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e);

    switch (e.key) {
      case "1": {
        setListItemDetailsModalOpen(true);
        break;
      }

      case "2": {
        setListItemEditorModalOpen(true);
        break;
      }

      case "5": {
        window.location.href = `/workflow/stage/tasks?id=${listItem.id}`;
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
      label: "View Task Details",
    },
    {
      key: "2",
      label: "Edit Task",
    },
    {
      key: "3",
      label: "Move Task Up",
    },
    {
      key: "4",
      label: "Move Task Down",
    },
  ];

  const [newItemTitle, setNewItemTitle] = useState(listItem.title);

  const [newItemDescription, setNewItemDescription] = useState(
    listItem.description
  );

  const updateListItem = async () => {
    console.log("Save Request:", [newItemTitle, newItemDescription]);

    const docResponse = await api.saveWorkflow(
      newItemTitle,
      newItemDescription
    );

    console.log("Save Request Response:", docResponse);

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
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className="label-value-pair doc-descriptio10n">
              <span className="label">Task Name:</span>
              <span className="value multi-liner">{listItem.task}</span>
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
                      <span className="input-label">Stage Task Title:</span>
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
                      <span className="input-label">
                        Stage Task Description:
                      </span>
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
        title="Stage Task Details"
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
                      <span className="input-label">Stage Task Title: </span>
                      {listItem.task}
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
                        Stage Task Description:{" "}
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
                      {listItem.createdby.firstname}{" "}
                      {listItem.createdby.lastname}
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

export default WorkflowStageTaskListItem;
