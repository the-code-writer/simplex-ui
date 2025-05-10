import { ReactFormBuilder, ReactFormGenerator } from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import { Breadcrumb, Button, Col, Dropdown, Flex, Modal, Row, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { BackendForm, FormBuilderAdapter } from "../../libs/FormBuilderAdaptor";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI } from "../../libs/AxiosAPI";
import { FileOutlined } from "@ant-design/icons";

const api = new AxiosAPI();
const DocumentsCreate = (params: any) => {
  const { colorBgContainer, borderRadiusLG } = params;

  const { Title } = Typography;

  const [formData, setFormData] = useState<any>([]);
  const [preview, setPreview] = useState(false);
  const [formWorkflowText, setFormWorkflowText] = useState("Select Document Workflow");
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
    console.log("Form data:", data);
    setFormData(data.task_data);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const saveForm = () => {
    // Here you would typically save the form data to your backend
    console.log("Saving form:::::", { formName, formData });
    
    const fm:BackendForm = FormBuilderAdapter.toBackendFormat(
      { task_data: formData },
      {
        title: formName,
        description: formDescription,
        metadata: formMetadata,
        workflowid: formWorkflowId,
        version: formVersion
      }
    );
    console.log(`Form :  "${formName}" saved!`, fm);
    api
      .createDocumentTemplate(fm)
      .then((res: any) => {
        console.log("DOCUMENT TEMPLATE SAVED", res.data);
        console.log(`Form 1 "${formName}" saved!`);
      })
      .catch((error: any) => {
        console.error("STAGE TASKS ERROR", error);
      });
  };

  function convertTasksToMenuItems(tasks: Task[]): MenuItem[] {
    return tasks.map((task) => ({
      label: task.title, // Use the 'task' property as label
      key: task.id, // Use the 'id' property as key
      icon: <FileOutlined />, // Use FileOutlined icon for all items
    }));
  }

  useEffect(() => {

    const formDataLocal = localStorage.getItem("form_data");

    if (formDataLocal) {

      const formDataLocalObject = JSON.parse(formDataLocal);

      console.log(` ::: formDataLocalObject ::: `, formDataLocalObject);

      setFormData(formDataLocalObject);

    }

      api
        .getWorkflows()
        .then((res: any) => {
          console.log("WORKFLOWS", res);
          const sortedTasks = [...res].sort(
            (a, b) => a.taskorder - b.taskorder
          );
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
