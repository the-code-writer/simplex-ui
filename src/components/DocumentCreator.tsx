import React, { useEffect, useState } from "react";
import { Button, Col, Flex, Input, Row, Space, Tag, theme } from "antd";
import { ReactFormGenerator } from "react-form-builder2";
import qrCode from "../assets/qrcode.png";
import ltzLogo from "../assets/ltz.png";
import { FormBuilderAdaptor } from "../libs/FormBuilderAdaptor";
import { AxiosAPI } from "../libs/AxiosAPI";
import { FormBuilderAdapter } from "../libs/FormBuilderAdapter";

const api = new AxiosAPI();

const DocumentCreator: any = ({ docItem, formData }) => {

  const [fieldValues, setFieldValues] = useState([]);

  const [jobTitle, setJobTitle] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [parsedFormDatax, setParsedFormDatax] = useState<any>([]);

  const [finalDocItem, setFinalDocItem] = useState<any>(docItem);

  const saveFormData = (formDataWithValues: any) => {
    console.log("SAVE_FORM_DATA", formDataWithValues);

    setFieldValues(formDataWithValues);
  };

  const resetForm = () => {
    console.log("RESET_FORM");
  };

  const saveJob = async () => {
    const saveRequest = FormBuilderAdaptor.prepareSaveRequest(
      jobTitle,
      jobDescription,
      docItem.id,
      docItem.workflows[0].id,
      fieldValues
    );

    console.log("Save Request:", JSON.stringify(saveRequest, null, 2));

    const docResponse = await api.saveDocument(saveRequest);

    console.log("docResponse:", docResponse);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (typeof docItem === "object") {

      api
        .getDocument(docItem.id)
        .then((res: any) => {
          console.log("DOCUMENT :::: EXISTS", res);
          setFinalDocItem(res);
        })
        .catch((error: any) => {
          console.error("DOCUMENT ITEM EXISTS ERROR", error);
        });

    }
    
  }, [docItem, formData]);

  useEffect(() => {
    console.log("finalDocItem :::::", finalDocItem);

    if (typeof finalDocItem !== "undefined") {
      
    const formBuilderAdapter = new FormBuilderAdapter();
    const parsedFormData = formBuilderAdapter.parseFormData({
      listdocumentsections: finalDocItem.listsections,
    });
    setParsedFormDatax(parsedFormData);

    console.log("parsedFormDatax :::::", parsedFormData);

    }

  }, [finalDocItem]);

  return (
    <>
      {typeof finalDocItem !== "undefined" &&
      typeof finalDocItem === "object" &&
      "workflows" in finalDocItem ? (
        <>
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

          <hr />

          <div className="h-32" />
          <span className="ant-modal-card-title">Job Details</span>
          <div className="h-8" />

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
              <Col className="gutter-row" xs={24} sm={24} md={9} lg={9} xl={9}>
                <Input
                  maxLength={32}
                  count={{
                    show: true,
                    max: 32,
                  }}
                  type="text"
                  className="form-control"
                  id="formVersion"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </Col>
              <Col className="gutter-row" xs={24} sm={24} md={9} lg={9} xl={9}>
                <Input
                  maxLength={64}
                  count={{
                    show: true,
                    max: 64,
                  }}
                  type="text"
                  className="form-control"
                  id="formVersion"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter job description"
                />
              </Col>
              <Col className="gutter-row" xs={24} sm={24} md={6} lg={6} xl={6}>
                <Flex justify="flex-end" align="center">
                  <></>
                  <Space size={24}>
                    <Button size="large" onClick={resetForm}>
                      Reset Form
                    </Button>
                    <Button size="large" type="primary" onClick={saveJob}>
                      Save Job
                    </Button>
                  </Space>
                </Flex>
              </Col>
            </Row>
          </div>

          <div className="h-32" />
          <span className="ant-modal-card-title">{finalDocItem.title}</span>
          <div className="h-8" />

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
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
              >
                <div className="label-value-pair doc-descriptio10n">
                  <span className="label">Title:</span>
                  <span className="value multi-liner">
                    {finalDocItem.title}
                  </span>
                </div>
                <div className="label-value-pair doc-description">
                  <span className="label">Description:</span>
                  <span className="value multi-liner">
                    {String(finalDocItem.description).replace(/<[^>]*>/g, "")}
                  </span>
                </div>
                <div className="label-value-pair doc-version">
                  <span className="label">Workflow Name:</span>
                  <span className="value single-liner">
                    {finalDocItem.workflows.length > 0 ? (
                      <>{finalDocItem.workflows[0].title}</>
                    ) : (
                      <>None</>
                    )}
                  </span>
                </div>
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
              >
                <div className="label-value-pair doc-date-created">
                  <span className="label">Date Created:</span>
                  <span className="value single-liner">
                    {finalDocItem.datecreated}
                  </span>
                </div>
                <div className="label-value-pair doc-date-updated">
                  <span className="label">Created By:</span>
                  <span className="value single-liner">
                    {finalDocItem.createdby.firstname}{" "}
                    {finalDocItem.createdby.lastname}
                  </span>
                </div>
                <div className="label-value-pair doc-status">
                  <span className="label">Current Status:</span>
                  <span className="value single-liner">
                    <Tag>{finalDocItem.status || "DRAFT"}</Tag>v{" "}
                    {finalDocItem.version.version || "1.0.0"}
                  </span>
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
                data={parsedFormDatax}
                onChange={saveFormData}
                submitButton={<></>}
              />
            </Row>
            <hr />
            <Flex justify="flex-end" align="center">
              <></>
              <Space size={24}>
                <Button size="large" onClick={resetForm}>
                  Reset Form
                </Button>
                <Button size="large" type="primary" onClick={saveJob}>
                  Save Job
                </Button>
              </Space>
            </Flex>
          </div>
        </>
      ) : (
        <>Loading ....</>
      )}
    </>
  );
};

export default DocumentCreator;
