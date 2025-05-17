import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import { FormBuilderAdaptor } from "../../libs/FormBuilderAdaptor.ts";
import DocumentCreator from "../DocumentCreator.tsx";
import { FormBuilderAdapter } from '../../libs/FormBuilderAdapter';
const api = new AxiosAPI();

const breadcrumbItems = [
  { title: "Home" },
  { title: "Documents" },
  { title: "New Job" },
];

const JobCreate = () => {

  const { Title } = Typography;
  const [docItem, setDocItem] = useState<any>([]);
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
  };

  const documentTemplateId: any = getUrlParameter("documentid");

  const resetFormLayout = (listsections: any) => {
    const formBuilderAdapter = new FormBuilderAdapter();

    const result = formBuilderAdapter.parseFormData({
      listdocumentsections: listsections,
    });

    console.log("Parsed Result:::::", result);

    setFormData(result);
  };

  const resetFormDetails = (document: any) => {
    setDocItem(document);
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

    api
      .getDocumentTemplate(documentTemplateId)
      .then((res: any) => {
        console.log("DOCUMENT TEMPLATE EXISTS", documentTemplateId, res);
        resetFormDetails(res);
      })
      .catch((error: any) => {
        console.error("DOCUMENT TEMPLATE EXISTS ERROR", error);
      });
    
  }, []);

  

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>New Job</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <div className="h-8"></div>

        <div style={{ margin: 24, display: "block" }}>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col
            className="gutter-row"
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
          >
            <DocumentCreator formData={formData} docItem={docItem} />
          </Col>
          </Row>
        
        </div>

      </Content>
    </>
  );
};

export default JobCreate;
