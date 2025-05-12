import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  MenuProps,
  message,
  Modal,
  Popover,
  Row,
  theme,
} from "antd";
import {
  EditOutlined,
  EditTwoTone,
  FileOutlined,
  FileTextOutlined,
  FlagOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { createStyles } from "antd-style";

import qrCode from "../assets/qrcode.png";

import ltzLogo from "../assets/ltz.png";

import ActivityTimeLine from "./ActivityTimeline";
import { ReactFormGenerator } from "react-form-builder2";
import { adaptFormData } from "../libs/FormAdapter";
import { FormBuilderForm } from "../libs/DocumentAdapter";

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

const ListViewDocumentItemCard: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { docItem, setModal3Open, setModal4Open, setModal5Open } = params;

  const { styles } = useStyle();

  /*
  const formDataFromLS = localStorage.getItem("form_data");
  const formDataFromLSParsed = JSON.parse(String(formDataFromLS));

  console.log("formDataFromLS", formDataFromLSParsed);
  */

  const [modal1Open, setModal1Open] = useState(false);
  const [formData, setFormData] = useState<FormBuilderForm | any>([]); //formDataFromLSParsed ||  FormBuilderForm[]

  useEffect(() => {
    const formBuilderData = adaptFormData(docItem.FormData);

    console.log("FORM DATA", formBuilderData);

    setFormData(formBuilderData);
  }, [docItem]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    message.info("Click on menu item.");
    console.log("click", e.key);
    switch (e.key) {
      case "so_details": {
        setModal1Open(true);
        break;
      }

      case "so_task": {
        setModal3Open(true);
        break;
      }

      case "so_notes": {
        setModal4Open(true);
        break;
      }

      case "so_reversion": {
        setModal5Open(true);
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "View SO Details",
      key: "so_details",
      icon: <FileOutlined />,
    },
    {
      label: "Update Flag",
      key: "so_task",
      icon: <FlagOutlined />,
    },
    {
      label: "Allocations",
      key: "2",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: "Contractor BOQ",
      key: "3",
      icon: <FileTextOutlined />,
    },
    {
      label: "Edit SO",
      key: "3",
      icon: <EditOutlined />,
    },
    {
      label: "Update SO Task",
      key: "so_task",
      icon: <EditOutlined />,
    },
    {
      label: "Update SO Notes",
      key: "so_notes",
      icon: <EditOutlined />,
    },
    {
      label: "Revert SO",
      key: "so_reversion",
      icon: <EditOutlined />,
    },
    {
      label: "Print SO",
      key: "6",
      icon: <PrinterOutlined />,
    },
    {
      label: "Share SO",
      key: "7",
      icon: <ShareAltOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
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
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={8} xl={8}>
            <div className="label-value-pair doc-title">
              <span className="label">Title:</span>
              <span className="value single-liner">{docItem.Title}</span>
            </div>
            <div className="label-value-pair doc-description">
              <span className="label">Description:</span>
              <span className="value multi-liner">{docItem.Description}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={7} xl={7}>
            <div className="label-value-pair doc-version">
              <span className="label">Version:</span>
              <span className="value single-liner">{docItem.Version}</span>
            </div>
            <div className="label-value-pair doc-workflow">
              <span className="label">Workflow ID:</span>
              <span className="value single-liner">{docItem.WorkflowID}</span>
            </div>
            <div className="label-value-pair doc-type">
              <span className="label">{docItem.DocumentItemType.Label}:</span>
              <span className="value single-liner">
                {docItem.DocumentItemType.Value}
              </span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={5} xl={5}>
            <div className="label-value-pair doc-created-at">
              <span className="label">{docItem.CreatedAt.Label}:</span>
              <span className="value single-liner">
                {docItem.CreatedAt.Value}
              </span>
            </div>
            <div className="label-value-pair doc-updated-at">
              <span className="label">{docItem.UpdatedAt.Label}:</span>
              <span className="value single-liner">
                {docItem.UpdatedAt.Value}
              </span>
            </div>
            <div className="label-value-pair doc-status">
              <span className="status single-liner">{docItem.Status}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={4} xl={4}>
            <div className="doc-action-button">
              <ConfigProvider
                button={{
                  className: styles.linearGradientButton,
                }}
              >
                <Dropdown.Button
                  size="middle"
                  type="primary"
                  menu={menuProps}
                  onClick={handleButtonClick}
                >
                  Select Action
                </Dropdown.Button>
              </ConfigProvider>
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        centered
        title={"Document Details"}
        style={{ top: 20 }}
        width={1320}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
      >
        <Flex align="flex-start" justify="space-between">
          <div>
            <img src={qrCode} width={96} />
          </div>
          <Flex vertical align="flex-end" style={{ width: "100%" }}>
            <img className="brand-logo" src={ltzLogo} width={150} />
            <span className="brand-address text-right">
              Sanctuary House, 04 Fairman Close
              <br />
              Mt Pleasant, Harare, Zimbabwe
              <br />
              +263 712 400 500, Email: info@sanctuary.co.zw
            </span>
          </Flex>
        </Flex>

        <div className="h-32" />
        <span className="ant-modal-card-title">{docItem.Title}</span>
        <div className="h-8" />
        <div
          className="dashboard-card shadow-1 document-details"
          style={{
            padding: 24,
            textAlign: "left",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-description">
                <span className="label">Description:</span>
                <span className="value multi-liner">{docItem.Description}</span>
              </div>
              <div className="label-value-pair doc-version">
                <span className="label">Version:</span>
                <span className="value single-liner">{docItem.Version}</span>
              </div>
              <div className="label-value-pair doc-workflow">
                <span className="label">Workflow ID:</span>
                <span className="value single-liner">{docItem.WorkflowID}</span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-type">
                <span className="label">{docItem.DocumentItemType.Label}:</span>
                <span className="value single-liner">
                  {docItem.DocumentItemType.Value}
                </span>
              </div>
              <div className="label-value-pair doc-date-created">
                <span className="label">{docItem.CreatedAt.Label}:</span>
                <span className="value single-liner">
                  {docItem.CreatedAt.Value}
                </span>
              </div>
              <div className="label-value-pair doc-date-updated">
                <span className="label">{docItem.UpdatedAt.Label}:</span>
                <span className="value single-liner">
                  {docItem.UpdatedAt.Value}
                </span>
              </div>
              <div className="label-value-pair doc-status">
                <span className="label">Current Status:</span>
                <span className="value single-liner">{docItem.Status}</span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="h-32" />
        <span className="ant-modal-card-title">Document Form</span>
        <div className="h-8" />
        <div
          className="dashboard-card shadow-1 document-details"
          style={{
            padding: 24,
            textAlign: "left",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <ReactFormGenerator
              form_action="/path/to/submit"
              form_method="POST"
              data={formData}
            />
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default ListViewDocumentItemCard;
