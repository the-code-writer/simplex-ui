import { ReactFormBuilder, ReactFormGenerator } from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import { Breadcrumb, Button, Col, Flex, Modal, Row, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
const DocumentsCreate = (params: any) => {
  const { colorBgContainer, borderRadiusLG } = params;

  const { Title } = Typography;

  const [formData, setFormData] = useState<any[]>([]);
  const [preview, setPreview] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("");
  const [formVersion, setFormVersion] = useState("");

  const onPost = (data: any) => {
    // This would typically be an API call to save your form
    console.log("Form data:", data);
    setFormData(data.task_data);
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  const saveForm = () => {
    // Here you would typically save the form data to your backend
    console.log("Saving form:", { formName, formData });
    alert(`Form "${formName}" saved!`);
  };

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Create New Document</Title>

        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Documents</Breadcrumb.Item>
          <Breadcrumb.Item>New</Breadcrumb.Item>
        </Breadcrumb>

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
                    <div className="col-md-3">
                      <label htmlFor="formName" className="form-label">
                        Document Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formName"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter form name"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="formDescription" className="form-label">
                        Document Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formDescription"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Enter form name"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="formType" className="form-label">
                        Document Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formType"
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        placeholder="Enter form name"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="formVersion" className="form-label">
                        Document Version Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="formVersion"
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        placeholder="Enter form name"
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
          <ReactFormBuilder onPost={onPost} locale="en" />
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
