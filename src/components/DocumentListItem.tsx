import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  MenuProps,
  message,
  Modal,
  Row,
  Space,
  Tag,
  theme,
} from "antd";
import {
  ExclamationCircleFilled,
  FileOutlined,
  FlagOutlined,
} from "@ant-design/icons";

import { createStyles } from "antd-style";

//import ActivityTimeLine from "./ActivityTimeline";

import { FormBuilderAdapter } from "../libs/FormBuilderAdapter";
import DocumentCreator from "./DocumentCreator";

const formBuilderAdapter = new FormBuilderAdapter();

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

const DocumentListItem: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const {
    captureAndSaveFormData,
    docItem,
    setModal3Open,
    setModal4Open,
    setModal5Open,
  } = params;

  const { styles } = useStyle();

  const [modal1Open, setModal1Open] = useState(false);
  const [formData, setFormData] = useState<FormBuilderForm | any>([]); //formDataFromLSParsed ||  FormBuilderForm[]

  useEffect(() => {
    //

    renderForm();
  }, [docItem]);

  const renderForm = () => {
    if ("listsections" in docItem) {
      docItem.listdocumentsections = docItem.listsections;
      console.log("DOC ITEM::", docItem);
      const reactForm = formBuilderAdapter.parseFormData(docItem);
      console.log("REACT FORM::", reactForm);
      setFormData(reactForm);
    }
  };

  const handleButtonClickNewJob = () => {
    window.location.href = "/documents/jobs/new";
  };

  const handleButtonClickEdit = () => {
    window.location.href =
      "/documents/new?documentid=" + docItem.id + "&name=" + docItem.title;
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };

  const { confirm } = Modal;

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e.key);

    switch (e.key) {
      case "doc_temp_details": {
        setModal1Open(true);
        console.warn("DOCUMENT ITEM", docItem);
        break;
      }

      case "doc_temp_edit": {
        window.location.href = `/documents/new?documentid=${docItem.id}&name=${docItem.title}`;
        console.warn("DOCUMENT ITEM", docItem);
        break;
      }

      case "doc_temp_jobs": {
        window.location.href = `/documents/jobs/list?documentid=${docItem.id}`;
        break;
      }

      case "doc_temp_job_new": {
        window.location.href = `/documents/jobs/new?documentid=${docItem.id}`;
        break;
      }

      case "doc_temp_status": {
        confirm({
          title: docItem.status === "PUBLISHED" ? "Unpublish Document" : "Publish Document",
          icon: <ExclamationCircleFilled />,
          content: `Are you sure you want to ${
            docItem.status === "PUBLISHED" ? "Unpublish" : "Publish"
          } the document?`,
          centered: true,
          onOk() {},
          onCancel() {},
        });
        break;
      }

      case "doc_temp_workflow": {
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "View Details",
      key: "doc_temp_details",
      icon: <FileOutlined />,
    },
    {
      label: "Edit Document",
      key: "doc_temp_edit",
      icon: <FileOutlined />,
    },
    {
      label: "View Jobs",
      key: "doc_temp_jobs",
      icon: <FileOutlined />,
    },
    {
      label: "Create New Job",
      key: "doc_temp_job_new",
      icon: <FileOutlined />,
    },
    {
      label:
        docItem.status === "PUBLISHED"
          ? "Unpublish Document"
          : "Publish Document",
      key: "doc_temp_status",
      icon: <FileOutlined />,
    },
    {
      label:
        docItem.workflows.length === 0
          ? "Add To Workflow"
          : "Remove From Workflow",
      key: "doc_temp_workflow",
      icon: <FileOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const [formDataObject, setFormDataObject] = useState({});

  const saveFormData = (formData: any) => {
    console.log("SAVE_FORM_DATA", formData);
    setFormDataObject(formData);
  };

  const submitFormData = () => {
    console.log("SUBMIT_FORM_DATA", formDataObject);
    captureAndSaveFormData(docItem.id, formDataObject);
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
        <Row id={docItem.id} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className="label-value-pair doc-descriptio10n">
              <span className="label">Title:</span>
              <span className="value multi-liner">{docItem.title}</span>
            </div>
            <div className="label-value-pair doc-description">
              <span className="label">Description:</span>
              <span className="value multi-liner">
                {String(docItem.description).replace(/<[^>]*>/g, "")}
              </span>
            </div>
            <div className="label-value-pair doc-version">
              <span className="label">Workflow Name:</span>
              <span className="value single-liner">
                {docItem.workflows.length > 0 ? (
                  <>{docItem.workflows[0].title}</>
                ) : (
                  <>None</>
                )}
              </span>
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
                {docItem.createdby.firstname} {docItem.createdby.lastname}
              </span>
            </div>
            <div className="label-value-pair doc-status">
              <span className="label">Current Status:</span>
              <span className="value single-liner">
                <Tag>{docItem.status || "DRAFT"}</Tag>v{" "}
                {docItem.version.version || "1.0.0"}
              </span>
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
        onOk={() => submitFormData()}
        onCancel={() => setModal1Open(false)}
      >

        <DocumentCreator docItem={docItem} formData={formData} />

      </Modal>
    </>
  );
};

export default DocumentListItem;
