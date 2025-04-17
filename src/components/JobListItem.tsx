import React, { useEffect, useState } from "react";
import {
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  MenuProps,
  message,
  Modal,
  Row,
  theme,
} from "antd";
import { FileOutlined, FlagOutlined } from "@ant-design/icons";

import { createStyles } from "antd-style";

import qrCode from "../assets/qrcode.png";

import ltzLogo from "../assets/ltz.png";

//import ActivityTimeLine from "./ActivityTimeline";
import { ReactFormGenerator } from "react-form-builder2";
import { FieldValue, FormBuilderAdapter } from "../libs/FormBuilderAdaptor";

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

const JobListItem: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const {
    api,
    captureAndSaveFormData,
    docItem,
    setModal3Open,
    setModal4Open,
    setModal5Open,
  } = params;

  const { styles } = useStyle();

  const [modal1Open, setModal1Open] = useState(false);
  const [formData, setFormData] = useState<FormBuilderForm | any>([]); //formDataFromLSParsed ||  FormBuilderForm[]

  useEffect(() => {}, [docItem]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e.key);

    switch (e.key) {
      case "job_view": {
        setModal1Open(true);
        break;
      }

      case "doc_temp_docs": {
        window.location.href = `/documents/jobs?id=${docItem.id}`;
        break;
      }

      case "job_publish": {
        api
          .assignToWorkflow(docItem.id)
          .then((res: any) => {
            console.log("JOB PUBLISH", res);
          })
          .catch((error: any) => {
            console.error("JOB PUBLISH ERROR", error);
          });
        break;
      }

      case "job_advance": {
        api
          .advanceJob(docItem.id)
          .then((res: any) => {
            console.log("JOB PUBLISH", res);
          })
          .catch((error: any) => {
            console.error("JOB PUBLISH ERROR", error);
          });
        break;
      }

      case "job_revert": {
        api
          .revertJob(docItem.id)
          .then((res: any) => {
            console.log("JOB REVERT", res);
          })
          .catch((error: any) => {
            console.error("JOB REVERT ERROR", error);
          });
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "View Job",
      key: "job_view",
      icon: <FileOutlined />,
    },
    {
      label: "Publish Job",
      key: "job_publish",
      icon: <FileOutlined />,
    },
    {
      label: "Unpublish Job",
      key: "job_unpublish",
      icon: <FileOutlined />,
    },
    {
      label: "Archive Job",
      key: "job_archive",
      icon: <FileOutlined />,
    },
    {
      label: "Advance Job",
      key: "job_advance",
      icon: <FileOutlined />,
    },
    {
      label: "Revert Job",
      key: "job_revert",
      icon: <FileOutlined />,
    },
    {
      label: "Move Job",
      key: "job_move",
      icon: <FileOutlined />,
    },
    
  ];

  /*
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  */

  const [formDataObject, setFormDataObject] = useState({});

  const saveFormData = (formData: any) => {
    console.log("SAVE_FORM_DATA", formData);
    setFormDataObject(formData);
  };

  const submitFormData = () => {
    console.log("SUBMIT_FORM_DATA", formDataObject);
    captureAndSaveFormData(docItem.id, formDataObject);
  };

  const [menuProps, setMenuProps] = useState<any>({
    items: [],
    onClick: handleMenuClick,
  });

  const [stageTasksList, setStageTasksLists] = useState<any>([]);

  useEffect(() => {
    console.log("CONVERTED TASKS @@@@@@", stageTasksList); 

    const subMenued = {
      label: "Stage Tasks",
      key: "job_tasks",
      icon: <FileOutlined />,
      children: stageTasksList,
    };
      
    items.push(subMenued);


  setMenuProps({
    items,
    onClick: handleMenuClick,
  });

  }, [stageTasksList]);

  useEffect(() => {
    // nget the doc stage

    const docstage = docItem.liststages;

    if (docstage) {
      const latestWorkflowStage = docstage[0];

      if (latestWorkflowStage && "id" in latestWorkflowStage) {
        console.log("LATEST WORKFLOW STAGES", latestWorkflowStage);

        console.log("LATEST WORKFLOW STAGE", latestWorkflowStage.stage);

        console.log("LATEST WORKFLOW STAGE ID", latestWorkflowStage.stage.id);

        const stageId = latestWorkflowStage.stage.id;

        api
          .getWorkflowStageTasks(stageId)
          .then((res: any) => {
            console.log("STAGE TASKS", res);
            const sortedTasks = [...res].sort(
              (a, b) => a.taskorder - b.taskorder
            );
            console.log("SORTED TASKS", sortedTasks);
            const convertedTasks = convertTasksToMenuItems(sortedTasks);
            console.log("CONVERTED TASKS", convertedTasks);
            setStageTasksLists(convertedTasks);
          })
          .catch((error: any) => {
            console.error("STAGE TASKS ERROR", error);
          });
      }
    }
  }, [docItem]);

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
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8} xl={8}>
            <div className="label-value-pair doc-date-created">
              <span className="label">Date Created:</span>
              <span className="value single-liner">{docItem.datecreated}</span>
            </div>
            <div className="label-value-pair doc-date-updated">
              <span className="label">Created By:</span>
              <span className="value single-liner">{docItem.createdby}</span>
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
        onOk={() => submitFormData()}
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
                <span className="value single-liner">{docItem.createdby}</span>
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
          <Row
            className="form-generator-container"
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          >
            <ReactFormGenerator
              form_action="/path/to/submit"
              form_method="POST"
              data={formData}
              onChange={saveFormData}
              submitButton={<></>}
            />
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default JobListItem;
