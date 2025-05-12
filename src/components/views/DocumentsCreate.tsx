import {
  ReactFormBuilder,
  ReactFormGenerator,
  ElementStore,
  Registry,
} from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Flex,
  Modal,
  Row,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { forwardRef, useEffect, useState } from "react";
import { BackendForm, FormBuilderAdaptor } from "../../libs/FormBuilderAdaptor";
import { FormBuilderAdapter } from "../../libs/FormBuilderAdapter";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI } from "../../libs/AxiosAPI";
import { FileOutlined } from "@ant-design/icons";

import qrCode from "../../assets/qrcode.png";

import ltzLogo from "../../assets/ltz.png";

const api = new AxiosAPI();
const DocumentsCreate = (params: any) => {
  const { colorBgContainer, borderRadiusLG } = params;

  const { Title } = Typography;

  const [formData, setFormData] = useState<any>([]);
  const [preview, setPreview] = useState(false);
  const [formWorkflowText, setFormWorkflowText] = useState(
    "Select Document Workflow"
  );
  const [formWorkflowId, setFormWorkflowId] = useState("");
  const [formMetadata, setFormMetadata] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formVersion, setFormVersion] = useState("");

  const breadcrumbItems = [
    { title: "Home" },
    { title: "Documents" },
    { title: "Create" },
  ];

  const onPost = (data: any) => {
    // This would typically be an API call to save your form
    localStorage.setItem("form_data", JSON.stringify(data.task_data));
    localStorage.setItem(
      "form_details",
      JSON.stringify({
        title: formName,
        description: formDescription,
        metadata: formMetadata,
        workflowid: formWorkflowId,
        version: formVersion,
        listdocumentsections: data.task_data,
      })
    );
    console.log("Form data:", data);
    setFormData(data.task_data);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const saveForm = () => {
    const documentTemplateData: any = {
      title: formName,
      description: formDescription,
      metadata: formMetadata,
      workflowid: formWorkflowId,
      version: formVersion,
      listdocumentsections: [],
    };
    // Here you would typically save the form data to your backend
    console.log("Saving form:::::", { formName, formData });

    const formBuilderAdapter = new FormBuilderAdapter();

    const result = formBuilderAdapter.convert(formData);

    console.log("Parsed Result:::::", result);

    documentTemplateData.listdocumentsections = result.listdocumentsections;

    console.log("Saving Result:::::", documentTemplateData);

    api
      .createDocumentTemplate(documentTemplateData)
      .then((res: any) => {
        console.log("DOCUMENT TEMPLATE SAVED", res.data);
        console.log(`Form 1 "${formName}" saved!`);
      })
      .catch((error: any) => {
        console.error("STAGE TASKS ERROR", error);
      });
    return;

    const fm: BackendForm = FormBuilderAdapter.toBackendFormat(
      { task_data: formData },
      {
        title: formName,
        description: formDescription,
        metadata: formMetadata,
        workflowid: formWorkflowId,
        version: formVersion,
      }
    );
    console.log(`Form :  "${formName}" saved!`, fm);
  };

  function convertTasksToMenuItems(tasks: Task[]): MenuItem[] {
    return tasks.map((task) => ({
      label: task.title, // Use the 'task' property as label
      key: task.id, // Use the 'id' property as key
      icon: <FileOutlined />, // Use FileOutlined icon for all items
    }));
  }

  useEffect(() => {
    const formDetailsLocal = localStorage.getItem("form_details");

    if (formDetailsLocal) {
      const formDataLocalObject = JSON.parse(formDetailsLocal);

      console.log(` ::: formDataLocalObject ::: `, formDataLocalObject);

      setFormData(formDataLocalObject.listdocumentsections);
    }

    api
      .getWorkflows()
      .then((res: any) => {
        console.log("WORKFLOWS", res);
        const sortedTasks = [...res].sort((a, b) => a.taskorder - b.taskorder);
        console.log("SORTED WORKFLOWS", sortedTasks);
        const convertedTasks = convertTasksToMenuItems(sortedTasks);
        console.log("CONVERTED WORKFLOWS", convertedTasks);
        setWorkflowMenuProps({
          items: convertedTasks,
          onClick: handleWorkflowMenuClick,
        });
      })
      .catch((error: any) => {
        console.error("STAGE TASKS ERROR", error);
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.reload();
        }
      });
  }, []);

  // Simulate loading saved form data (e.g., from an API or localStorage)
  const loadSavedFormData = async () => {
    const savedData = localStorage.getItem("form_data");
    return savedData ? JSON.parse(savedData) : [];
  };

  const handleWorkflowMenuClick: MenuProps["onClick"] = (e) => {
    console.log("handleTaskMenuClick", e);
    setFormWorkflowText(e.domEvent.target.innerText);
    setFormWorkflowId(e.key);
  };

  const [workflowMenuProps, setWorkflowMenuProps] = useState<any>({
    items: [],
    onClick: handleWorkflowMenuClick,
  });

  useEffect(() => {
    const TestComponent = () => <h2>Hello</h2>;
    //Custom Component with input element
    const MyInput = forwardRef((props: any, ref: any) => {
      const { name, defaultValue, disabled } = props;
      return (
        <input
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      );
    });
    //Register custom components to be used in form builder
    Registry.register("MyInput" + Date.now(), MyInput);
    Registry.register("TestComponent" + Date.now(), TestComponent); //
  }, []);

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>New Document</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <div className="h-8"></div>
        <div
          className="dashboard-card shadow-1 document-details card-rounded-shadow"
          style={{
            padding: 24,
            textAlign: "left",
            background: "#ffffff",
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="container mt-4">
                <div className="mb-3">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="formName" className="form-label">
                        Document Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formName"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter Document Title"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="formName" className="form-label">
                        Document WorkFlow
                      </label>
                      <Dropdown menu={workflowMenuProps}>
                        <Button size="large" className="w-100">
                          {formWorkflowText || "Document WorkFlow"}
                        </Button>
                      </Dropdown>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="formDescription" className="form-label">
                        Document Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formDescription"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Enter Document Description"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="formVersion" className="form-label">
                        Document Version Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formVersion"
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        placeholder="Enter Document Version Number"
                      />
                    </div>
                  </div>
                </div>

                <hr />

                <Flex gap="small" wrap>
                  <Button
                    type="primary"
                    onClick={saveForm}
                    disabled={!formName}
                  >
                    Save Form
                  </Button>
                  <Button onClick={togglePreview}>Preview Form</Button>
                  <Button onClick={togglePreview}>Reset Form</Button>
                </Flex>
              </div>
            </Col>
          </Row>
        </div>
        <div className="h-8"></div>
        <div
          className="dashboard-card shadow-1 document-details card-rounded-shadow"
          style={{
            padding: 24,
            textAlign: "left",
            background: "#ffffff",
            borderRadius: borderRadiusLG,
          }}
        >
          <ReactFormBuilder
            onPost={onPost}
            onLoad={loadSavedFormData} // Initialize with saved data
            locale="en"
          />
        </div>
        <div className="h-8"></div>
        <div className="h-8"></div>
        <div
          className="dashboard-card shadow-1 document-details card-rounded-shadow"
          style={{
            padding: 24,
            textAlign: "left",
            background: "#ffffff",
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <h5>
                <strong>Metadata</strong>
              </h5>
              <TextArea
                size="large"
                className="w-100"
                placeholder="Enter your notes here"
                value={formMetadata}
                autoSize={{ minRows: 2, maxRows: 6 }}
                onChange={(e) => setFormMetadata(e.target.value)}
              />
            </Col>
          </Row>
        </div>
        <div className="h-8"></div>
        <div className="h-8"></div>
        <div
          className="dashboard-card shadow-1 document-details card-rounded-shadow"
          style={{
            padding: 24,
            textAlign: "left",
            background: "#ffffff",
            borderRadius: borderRadiusLG,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <h5>
                <strong>Debug</strong>
              </h5>
              <TextArea
                size="large"
                className="w-100"
                placeholder="Enter your notes here"
                value={JSON.stringify(formData)}
                autoSize={{ minRows: 2, maxRows: 6 }}
                readOnly
                disabled
              />
            </Col>
          </Row>
        </div>
        <div className="h-8"></div>
      </Content>
      <Modal
        centered
        title="Document Preview"
        style={{ top: 20 }}
        width={1320}
        open={preview}
        onOk={() => setPreview(false)}
        onCancel={() => setPreview(false)}
      >
        <div
          className="dashboard-card shadow-1 document-details"
          style={{
            padding: 24,
            textAlign: "left",
            background: "#ffffff",
            borderRadius: borderRadiusLG,
          }}
        >
          <Flex align="flex-start" justify="space-between">
            <div style={{ width: "50%" }}>
              <img src={qrCode} width={96} />
              <h2
                style={{
                  width: "100%",
                  fontWeight: 800,
                  fontSize: 28,
                  marginTop: 24,
                  color: "#777777",
                }}
              >
                {formName}
              </h2>
            </div>
            <Flex vertical align="flex-end" style={{ width: "50%" }}>
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

          <hr />

          <ReactFormGenerator
            form_action="/path/to/submit"
            form_method="POST"
            data={formData}
          />
        </div>
      </Modal>
    </>
  );
};

export default DocumentsCreate;
