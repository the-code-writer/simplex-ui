import { Breadcrumb, Row, Col, Tabs, Flex, Button, TabsProps, Collapse, CollapseProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
//import { documentItems } from "../../libs/documentItemGenerator";
import DashboardCard from "../DashboardCard.tsx";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import { FormBuilderAdaptor } from "../../libs/FormBuilderAdaptor.ts";
import JobListItem from '../JobListItem';
import NoData from "../NoData";
import { CSSTransition } from "react-transition-group";
import Analysis from '../analysis/index';
import JobsWrapper from '../analysis/components/JobsWrapper';
const api = new AxiosAPI();

const breadcrumbItems = [
  { title: "Home" },
  { title: "Documents" },
  { title: "Jobs" },
];

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
  
const documentId: any = getUrlParameter("id");
  
const isNewListView: any = getUrlParameter("new-list-view");

const DocumentsView = (params: any) => {
  const {
    colorBgContainer,
    borderRadiusLG,
  } = params;

  const { Title } = Typography;

  const [documentItems, setDocumentItems] = useState([]);

  useEffect(() => {

    console.log("JOB LIST VIEW", localStorage.getItem("simplex-token"));

    if (documentId) {
      api
        .getAllDocumentJobs(documentId)
        .then((templates: any) => {
          console.log("All JObs:", templates);
          setDocumentItems(templates);
        })
        .catch((error) => {
          console.error("Retrieval failed:", error);
        });
    } else {
      if (true) {
        api
          .getAllDocumentJobsList()
          .then((templates: any) => {
            console.log("All JObs:", templates);
            setDocumentItems(templates);
          })
          .catch((error) => {
            console.error("Retrieval failed:", error);
          });
      }
    }
    
    
  }, []);

  const captureAndSaveFormData = async (
    templateId: string,
    fieldValues: FieldValue[]
  ) => {
    // Example usage for saving document data
    const formTitle = "Account Registration F0001";
    const description = "This is the description of the document";
    const workflowId = "cb2d2397-67fc-4100-a7d5-ff6329327cd1";

    const saveRequest = FormBuilderAdaptor.prepareSaveRequest(
      formTitle,
      description,
      templateId,
      workflowId,
      fieldValues
    );

    console.log("Save Request:", JSON.stringify(saveRequest, null, 2));

    const docResponse = await api.saveDocument(saveRequest);

    console.log("docResponse:", docResponse);


  };

    const onTabChange = (key: string) => {
      console.log(key);
    };

    const tabItems: TabsProps["items"] = [
      {
        key: "1",
        label: "My Jobs",
        children: "",
      },
      {
        key: "2",
        label: "Recent Jobs",
        children: "",
      },
      {
        key: "3",
        label: "Archived Jobs",
        children: "",
      },
    ];
  
  const [isExpanded, setIsExpanded] = useState(false);
 
  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>Jobs</Title>

        <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbItems} />

        <div className="h-8"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <div
              className="tabs-card shadow-1 hide-tab-contents"
              style={{
                padding: "0 24px",
                textAlign: "left",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignContent: "space-between",
                flexWrap: "nowrap",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  alignContent: "center",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                }}
              >
                <Tabs
                  defaultActiveKey="1"
                  items={tabItems}
                  onChange={onTabChange}
                />
                <Flex gap="small" wrap>
                  <Button
                    type="default"
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isExpanded ? <>Hide</> : <>Show</>} Dashboard
                  </Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      (window.location.href = "/documents/jobs/new")
                    }
                  >
                    New Job
                  </Button>
                </Flex>
              </div>
              <CSSTransition
                in={isExpanded}
                timeout={1000}
                classNames="collapse"
                unmountOnExit
              >
                <div className="content" style={{ marginTop: 24 }}>
                  <Title level={1}>Dashboard</Title>
                  <Analysis
                    dashboardAndanalysis={{
                      visitData: [],
                      visitData2: [],
                      salesData: [],
                      searchData: [],
                      offlineData: [],
                      offlineChartData: [],
                      salesTypeData: [],
                      salesTypeDataOnline: [],
                      salesTypeDataOffline: [],
                      radarData: [],
                    }}
                    loading={false}
                  />
                </div>
              </CSSTransition>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        {isNewListView ? (
          <>
            {Array.isArray(documentItems) && documentItems.length > 0 ? (
              <JobsWrapper jobItems={documentItems} />
            ) : (
              <NoData
                onButtonClick={() =>
                  (window.location.href = "/documents/jobs/new")
                }
                buttonLabel={"New Job"}
                description="No jobs created yet"
              />
            )}
          </>
        ) : (
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {Array.isArray(documentItems) && documentItems.length > 0 ? (
                <>
                  {documentItems.map((listItem: any, listItemIndex: number) => (
                    <Col
                      id={listItem.id}
                      key={listItemIndex}
                      className="gutter-row"
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      xl={24}
                    >
                      <JobListItem docItem={listItem} />
                    </Col>
                  ))}
                </>
              ) : (
                <NoData
                  onButtonClick={() =>
                    (window.location.href = "/documents/jobs/new")
                  }
                  buttonLabel={"New Job"}
                  description="No jobs created yet"
                />
              )}
            </Row>
          </>
        )}
      </Content>
    </>
  );
};

export default DocumentsView;
