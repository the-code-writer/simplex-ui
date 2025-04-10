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
import { FormBuilderAdapter } from "../libs/FormBuilderAdaptor";

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

const DocumentTemplateListItem: React.FC = (params: any) => {
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

    const reactForm = FormBuilderAdapter.toReactFormat(docItem);
    
    console.log("DOCUMENT ITEM::", docItem);
    console.log("React Form:001:", JSON.stringify(reactForm.task_data, null, 2));
    console.log("React Form:002:", reactForm.task_data);
    setFormData(reactForm.task_data);

  }, [docItem]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    message.info("Click on menu item.");
    console.log("click", e.key);
    switch (e.key) {
      case "doc_temp_details": {
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
      label: "View Template Details",
      key: "doc_temp_details",
      icon: <FileOutlined />,
    },
    {
      label: "View Documents (34)",
      key: "doc_temp_docs",
      icon: <FileOutlined />,
    },
    {
      label: "Update Title",
      key: "so_task",
      icon: <FlagOutlined />,
    },
    {
      label: "Update Description",
      key: "2",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: "Update Version Number",
      key: "3",
      icon: <FileTextOutlined />,
    },
    {
      label: "Publish Template",
      key: "3",
      icon: <EditOutlined />,
    },
    {
      label: "Unpublish Template",
      key: "so_task",
      icon: <EditOutlined />,
    },
    {
      label: "Attach Workflow",
      key: "so_notes",
      icon: <EditOutlined />,
    },
    {
      label: "Detach Workflow",
      key: "so_reversion",
      icon: <EditOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const saveFormData = (formData:any) => {

    console.log("SAVE_FORM_DATA", formData);

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
              <span className="label">Title:</span>
              <span className="value multi-liner">{docItem.title}</span>
            </div>
            <div className="label-value-pair doc-description">
              <span className="label">Description:</span>
              <span className="value multi-liner">{docItem.description}</span>
            </div>
            <div className="label-value-pair doc-version">
              <span className="label">Version:</span>
              <span className="value single-liner">{docItem.version||"1.0.0"}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8} xl={8}>
            <div className="label-value-pair doc-date-created">
              <span className="label">Date Created:</span>
              <span className="value single-liner">{docItem.datecreated}</span>
            </div>
            <div className="label-value-pair doc-date-updated">
              <span className="label">Created By:</span>
              <span className="value single-liner">
                {docItem.createdby.firstname}
              </span>
            </div>
            <div className="label-value-pair doc-status">
              <span className="label">Current Status:</span>
              <span className="value single-liner">Draft</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={2} lg={2} xl={2}>
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
        title={"Document Template Details"}
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
              Block B, Stand 45 and 47, Sam Levy Office Office Park
              <br />
              Piers Rd, Borrowdale, Harare, Zimbabwe
              <br />
              Tel:+263-8677033000
            </span>
          </Flex>
        </Flex>

        <div className="h-32" />
        <span className="ant-modal-card-title">{docItem.title}</span>
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
                <span className="label">Title:</span>
                <span className="value multi-liner">{docItem.title}</span>
              </div>
              <div className="label-value-pair doc-description">
                <span className="label">Description:</span>
                <span className="value multi-liner">{docItem.description}</span>
              </div>
              <div className="label-value-pair doc-version">
                <span className="label">Version:</span>
                <span className="value single-liner">{docItem.version}</span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-date-created">
                <span className="label">Date Created:</span>
                <span className="value single-liner">
                  {docItem.datecreated}
                </span>
              </div>
              <div className="label-value-pair doc-date-updated">
                <span className="label">Created By:</span>
                <span className="value single-liner">
                  {docItem.createdby.firstname}
                </span>
              </div>
              <div className="label-value-pair doc-status">
                <span className="label">Current Status:</span>
                <span className="value single-liner">Draft</span>
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
          <Row className="form-generator-container" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <ReactFormGenerator
              form_action="/path/to/submit"
              form_method="POST"
              data={formData}
              onSubmit={saveFormData}
            />
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default DocumentTemplateListItem;
