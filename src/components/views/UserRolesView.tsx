import {
  Breadcrumb,
  Row,
  Col,
  Tabs,
  Flex,
  Button,
  TabsProps,
  Space,
  Modal,
  Input,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { AxiosAPI } from "../../libs/AxiosAPI.ts";
import WorkFlowListItem from "../WorkFlowListItem.tsx";
import TextArea from "antd/es/input/TextArea";
import UserRoleListItem from "../UserRolesListItem.tsx";

const api = new AxiosAPI();

const breadcrumbItems = [{ title: "Home" }, { title: "UserRole" }];

const UserRoleView = (params: any) => {
  const { colorBgContainer, borderRadiusLG } = params;

  const { Title } = Typography;

  const [newUserRoleModalOpen, setNewUserRoleModalOpen] = useState(false);

  const [listViewItems, setListViewItems] = useState([]);

  const [newItemTitle, setNewItemTitle] = useState("");

  const [newItemDescription, setNewItemDescription] = useState("");

  useEffect(() => {
    api
      .getUserRoles()
      .then((listViewItemsList: any) => {
        console.log(
          "All Items: listViewItemsList : UserRole",
          listViewItemsList
        );
        setListViewItems(listViewItemsList);
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
  }, [api]);

  const saveListItem = async () => {
    console.log("Save Request:", [newItemTitle, newItemDescription]);

    const docResponse = await api.saveUserRole(
      newItemTitle,
      newItemDescription
    );

    console.log("docResponse:", docResponse);

    window.location.reload();
  };

  const onTabChange = (key: string) => {
    console.log(key);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Active UserRole",
      children: "Content of Tab Pane 1",
    },
    {
      key: "1",
      label: "Disabled UserRole",
      children: "Content of Tab Pane 1",
    },
  ];

  return (
    <>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        <Title level={1}>User Roles</Title>

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
              }}
            >
              <Tabs
                defaultActiveKey="1"
                items={tabItems}
                onChange={onTabChange}
              />
              <Flex gap="small" wrap>
                <Button
                  type="primary"
                  onClick={() => setNewUserRoleModalOpen(true)}
                >
                  New UserRole
                </Button>
              </Flex>
            </div>
          </Col>
        </Row>

        <div className="h-24"></div>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {listViewItems.map((listItem: any, listItemIndex: number) => (
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
              <UserRoleListItem listItem={listItem} />
            </Col>
          ))}
        </Row>
      </Content>

      <Modal
        centered
        title="Create A New UserRole"
        style={{ top: 20 }}
        width={750}
        open={newUserRoleModalOpen}
        onOk={() => saveListItem()}
        onCancel={() => setNewUserRoleModalOpen(false)}
        className="new-so"
      >
        <Space direction="vertical" size={24}>
          <div className="section-card">
            <div
              className="dashboard-card shadow-1"
              style={{
                padding: 24,
                textAlign: "left",
                background: "#ffffff",
                borderRadius: borderRadiusLG,
              }}
            >
              <Space direction="vertical" size={24} className="w-100">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">UserRole Title:</span>
                      <Input
                        size="large"
                        className="w-100"
                        placeholder="Enter userRole title here"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                      />
                    </div>
                  </Col>

                  <Col
                    className="gutter-row mb-16px"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    xl={24}
                  >
                    <div className="input-wrapper">
                      <span className="input-label">UserRole Description:</span>
                      <TextArea
                        size="large"
                        className="w-100"
                        placeholder="Enter your userRole description here"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                      />
                    </div>
                  </Col>
                </Row>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default UserRoleView;
