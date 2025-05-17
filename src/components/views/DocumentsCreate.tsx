import {
  ReactFormBuilder,
  ReactFormGenerator,
} from "react-form-builder2";
import "react-form-builder2/dist/app.css";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Flex,
  Input,
  Modal,
  Row,
  Tag,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { FormBuilderAdapter } from "../../libs/FormBuilderAdapter";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI } from "../../libs/AxiosAPI";
import { FileOutlined } from "@ant-design/icons";

import qrCode from "../../assets/qrcode.png";

import ltzLogo from "../../assets/ltz.png";

import { ImageEditor } from '../image-editor/index';

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
  const [formMetadataValues, setFormMetadataValue] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOrganizationAddress, setFormOrganizationAddress] = useState("");
  const [formVersion, setFormVersion] = useState("");
  const [documentFormLogo, setDocumentFormLogo] = useState("");

  function getUrlParameter<T extends string | number>(name: string): T | null {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(name);

    if (value === null) return null;

    // Try to convert to number if it looks like one
    if (!isNaN(Number(value))) {
      return Number(value) as T;
    }

    return value as T;
  }

  const composeMetadata = () => {

    const metadata = {
      documentFormLogo,
      formOrganizationAddress,
      formMetadata,
    };

    console.log("META_DATA", metadata);

    setFormMetadataValue(JSON.stringify(metadata));

  }

  const documentTemplateId: any = getUrlParameter("documentid");

  const exisitngDocument: boolean = documentTemplateId !== null;

  const documentName: any = getUrlParameter("name");

  const breadcrumbItems = [
    { title: "Home" },
    { title: "Documents" },
    { title: exisitngDocument ? "Edit / " + documentName : "Create" },
  ];

  useEffect(() => {
    composeMetadata();
  }, [documentFormLogo, formMetadata, formOrganizationAddress]);

  const onPost = (data: any) => {
    // This would typically be an API call to save your form
    localStorage.setItem("form_data", JSON.stringify(data.task_data));
    localStorage.setItem(
      "form_details",
      JSON.stringify({
        title: formName,
        description: formDescription,
        metadata: formMetadataValues,
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
      version: {
        version: formVersion,
        description: "New document",
        versiondate: Date.now(),
      },
      status: "DRAFT",
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
    
  };

  function convertTasksToMenuItems(tasks: Task[]): MenuItem[] {
    return tasks.map((task) => ({
      label: task.title, // Use the 'task' property as label
      key: task.id, // Use the 'id' property as key
      icon: <FileOutlined />, // Use FileOutlined icon for all items
    }));
  }

  const resetFormLayout = (listsections: any) => {
    const formBuilderAdapter = new FormBuilderAdapter();

    const result = formBuilderAdapter.parseFormData({
      listdocumentsections: listsections,
    });

    console.log("Parsed Result:::::", result);

    setFormData(result);

  };

  const resetFormDetails = (document: any) => {
      setFormWorkflowId(document.id);
      setFormMetadata(document.metadata);
      setFormName(document.title);
      setFormDescription(document.description);
      setFormOrganizationAddress(document.id);
      setFormVersion(document.version.version);
      setDocumentFormLogo(document.id);
      resetFormLayout(document.listsections);
  };

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
    
    if (exisitngDocument) {
      api
        .getDocumentTemplate(documentTemplateId)
        .then((res: any) => {
          console.log("DOCUMENT TEMPLATE EXISTS", documentTemplateId, res);
          resetFormDetails(res);
        })
        .catch((error: any) => {
          console.error("DOCUMENT TEMPLATE EXISTS ERROR", error);
        });
    }

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
        <Title level={1}>
          {exisitngDocument ? "Edit" : "New"} Document:{" "}
          {exisitngDocument ? documentName : ""}
        </Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <div className="h-8"></div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
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
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div className="container mt-4">
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 mb-4">
                          <label htmlFor="formName" className="form-label">
                            Document Title
                          </label>
                          <Input
                            maxLength={64}
                            count={{
                              show: true,
                              max: 56,
                            }}
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
                          <label htmlFor="formVersion" className="form-label">
                            Version Number{" "}
                            {exisitngDocument && (
                              <>
                                <Tag><small><strong>CURRENT: {formVersion}</strong></small></Tag>
                              </>
                            )}
                          </label>
                          <Input
                            maxLength={12}
                            count={{
                              show: true,
                              max: 12,
                            }}
                            type="text"
                            className="form-control"
                            id="formVersion"
                            value={formVersion}
                            onChange={(e) => setFormVersion(e.target.value)}
                            placeholder="Enter Document Version Number"
                          />
                        </div>
                        <div className="col-md-12 mb-4">
                          <label
                            htmlFor="formDescription"
                            className="form-label"
                          >
                            Document Description
                          </label>
                          <TextArea
                            className="form-control"
                            id="formDescription"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Enter Document Description"
                          />
                        </div>
                        <div className="col-md-12 mb-4">
                          <label
                            htmlFor="formDescription"
                            className="form-label"
                          >
                            Organization Address
                          </label>
                          <TextArea
                            className="form-control"
                            id="formDescription"
                            value={formOrganizationAddress}
                            onChange={(e) =>
                              setFormOrganizationAddress(e.target.value)
                            }
                            placeholder="Enter Organization Address"
                          />
                        </div>
                      </div>
                    </div>

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
          </Col>

          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
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
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <div className="w-100">
                    <ImageEditor onNewImage={setDocumentFormLogo} />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
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
