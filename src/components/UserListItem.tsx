import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  message,
  Modal,
  notification,
  Result,
  Row,
  Select,
  Space,
  Tag,
  theme,
} from "antd";
import { FileOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';

import { createStyles } from "antd-style";
import TextArea from "antd/es/input/TextArea";
import { AxiosAPI } from '../libs/AxiosAPI';

const api = new AxiosAPI();

const Context = React.createContext({ name: "Default" });

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

interface MenuItem {
  label: string;
  key: string;
  icon: React.ReactNode;
}

const UserListItem: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { listItem } = params;

  const { styles } = useStyle();

  const [listItemDetailsModalOpen, setListItemDetailsModalOpen] =
    useState(false);

  const [listItemEditorModalOpen, setListItemEditorModalOpen] = useState(false);

  const [modalAjaxResultOpen, setModalAjaxResultOpen] = useState(false);

  const [modalAjaxResultTitle, setModalAjaxResultTitle] = useState("");

  const [modalAjaxResultSubTitle, setModalAjaxResultSubTitle] = useState("");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click ::: 1", e);

    switch (e.key) {
      case "1": {
        setListItemDetailsModalOpen(true);
        break;
      }

      case "2": {
        setListItemEditorModalOpen(true);
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "View User Details",
    },
    {
      key: "2",
      label: "Edit User",
    },
    {
      key: "3",
      label: "Activate User",
    },
    {
      key: "4",
      label: "Deactivate User",
    },
    {
      key: "5",
      label: "Reset User Password",
    },
  ];

  const [apix, contextHolder] = notification.useNotification();

  const reassignRoles = () => {
    selectedRoles.map((selectedRole: any) => {

      api
        .assignUserRole(listItem.id, selectedRole)
        .then((result: any) => {
          console.log("ROLE ASSIGNMENT", [listItem.id, selectedRole, result]);
          apix.info({
            message: `Role Assigned`,
            description: `Role [${result.role}] assigned to ${listItem.firstname} ${listItem.lastname} !`,
            placement: "bottomRight",
          });
        })
        .catch((error: any) => {
          console.error("Role Assignment failed:", error);
        });
  
    });
  };

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleChangeSelectedRoles = (value: string[]) => {
    console.log(`selected ${value}`);
    setSelectedRoles(value); // This updates the state
  };

  const [userAssignedRoles, setUserAssignedRoles] = useState([]);

  const [optionsUserRoles, setOptionsUserRoles] = useState([]);

  useEffect(() => {
    api
      .getUserAssignedRoles(listItem.id)
      .then((userRoles: any) => {
        console.log("All Items: getUserAssignedRoles : UserRole", userRoles);
        const userAssignedRoles: any = userRoles.map(
          (roleObj: any) => roleObj.id
        );
        setUserAssignedRoles(userAssignedRoles);
      })
      .catch((error: any) => {
        console.error("Retrieval failed: getUserAssignedRoles", error);
      });
    
    api
      .getUserRoles()
      .then((userRoles: any) => {
        console.log("All Items: userRoles", userRoles);

        // Transform API response to your desired format
        const formattedRoles:any = userRoles.map((roleObj: any) => ({
          label: roleObj.role,
          value: roleObj.id,
          emoji: <UserOutlined />, // or a placeholder if needed
          desc: roleObj.role,
        }));

        // Append the Super Admin option
        const updatedRoles:any = [
          ...formattedRoles,
          {
            label: "Super Admin",
            value: "admin",
            emoji: <UserOutlined />,
            desc: "Admin",
          },
        ];

        setOptionsUserRoles(updatedRoles);

        
      })
      .catch((error) => {
        console.error("Retrieval failed:", error);
      });
    
  }, [listItem]);

 const [firstname, setFirstname] = useState(listItem.firstname);
 const [lastname, setLastname] = useState(listItem.lastname);
 const [email, setEmail] = useState(listItem.email);
 const [password, setPassword] = useState("");
 const [password2, setPassword2] = useState("");
 const [roleid, setRoleid] = useState();

  const saveListItem = async () => {

    console.log("Save Request:", [firstname, lastname, email]);

    /*

    "email": "user@domain.com",
    "firstname": "string",
    "id": "0000-0000-0000-0000",
    "middlename": "string",
    "lastname": "string",
    "enabled": false

  */

    const docResponse = await api.updateUser(
      firstname,
      lastname,
      email,
    );

    console.log("docResponse:", docResponse);

    setListItemEditorModalOpen(false);
    setModalAjaxResultOpen(true);

    setModalAjaxResultTitle(`Success!`);
    setModalAjaxResultSubTitle(`User ${firstname} ${lastname} data updated!`);
  };

  const contextValue = useMemo(() => ({ name: "Simplex AI" }), []);

  return (
    <>
      <Context.Provider value={contextValue}>
        {contextHolder}
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
                <span className="label">First Name:</span>
                <span className="value multi-liner">{listItem.firstname}</span>
              </div>
              <div className="label-value-pair doc-description">
                <span className="label">Last Name:</span>
                <span className="value multi-liner">{listItem.lastname}</span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={9} lg={9} xl={9}>
              <div className="label-value-pair doc-date-created">
                <span className="label">Email:</span>
                <span className="value single-liner">{listItem.email}</span>
              </div>
              <div className="label-value-pair doc-date-updated">
                <span className="label">Status:</span>
                <span className="value single-liner">
                  {listItem.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={1} lg={1} xl={1}>
              <div className="doc-action-button">
                <ConfigProvider
                  button={{
                    className: styles.linearGradientButton,
                  }}
                >
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["1"],
                      onClick: handleMenuClick,
                    }}
                  >
                    <Button type="primary">
                      Select Action <EllipsisOutlined />
                    </Button>
                  </Dropdown>
                </ConfigProvider>
              </div>
            </Col>
          </Row>
        </div>

        <Modal
          centered
          title="Edit User"
          style={{ top: 20 }}
          width={750}
          open={listItemEditorModalOpen}
          onOk={() => saveListItem()}
          onCancel={() => setListItemEditorModalOpen(false)}
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
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <div className="input-wrapper">
                        <span className="input-label">First Name:</span>
                        <Input
                          size="large"
                          className="w-100"
                          placeholder="Enter first here"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </div>
                    </Col>

                    <Col
                      className="gutter-row mb-16px"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <div className="input-wrapper">
                        <span className="input-label">Last Name:</span>
                        <Input
                          size="large"
                          className="w-100"
                          placeholder="Enter user last name here"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
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
                        <span className="input-label">Email:</span>
                        <Input
                          size="large"
                          className="w-100"
                          placeholder="Enter user email address here"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </Col>

                    <Col
                      className="gutter-row mb-16px"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <div className="input-wrapper">
                        <span className="input-label">Password:</span>
                        <Input
                          type="password"
                          size="large"
                          className="w-100"
                          placeholder="Enter user password here"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </Col>

                    <Col
                      className="gutter-row mb-16px"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <div className="input-wrapper">
                        <span className="input-label">Confirm Password:</span>
                        <Input
                          type="password"
                          size="large"
                          className="w-100"
                          placeholder="Enter user password here"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                </Space>
              </div>
            </div>
          </Space>
        </Modal>

        <Modal
          centered
          title="User Details"
          style={{ top: 20 }}
          open={listItemDetailsModalOpen}
          onOk={() => setListItemDetailsModalOpen(false)}
          onCancel={() => setListItemDetailsModalOpen(false)}
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
                        <span className="input-label">First Name: </span>
                        {listItem.firstname}
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
                        <span className="input-label">Last Name: </span>
                        {listItem.lastname}
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
                        <span className="input-label">Email Address: </span>
                        {listItem.email}
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
                        <span className="input-label">Status: </span>{" "}
                        <Tag>{listItem.enabled ? "Enabled" : "Disabled"}</Tag>
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
                      <hr />
                      <div className="input-wrapper">
                        <span className="input-label">User Roles: </span>{" "}
                        <Select
                          mode="multiple"
                          style={{ width: "100%" }}
                          placeholder="select one or more user roles"
                          defaultValue={userAssignedRoles}
                          onChange={handleChangeSelectedRoles}
                          options={optionsUserRoles}
                          optionRender={(option) => (
                            <Space>
                              <span role="img" aria-label={option.data.label}>
                                {option.data.emoji}
                              </span>
                              {option.data.desc}
                            </Space>
                          )}
                        />
                        <br />
                        <br />
                        <Button
                          size="small"
                          type="primary"
                          onClick={reassignRoles}
                        >
                          Assign Roles
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Space>
              </div>
            </div>
          </Space>
        </Modal>

        <Modal centered open={modalAjaxResultOpen} footer={[<></>]}>
          <Result
            status="success"
            title={modalAjaxResultTitle}
            subTitle={modalAjaxResultSubTitle}
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  setModalAjaxResultOpen(false);
                  window.location.reload();
                }}
              >
                Close
              </Button>,
            ]}
          />
        </Modal>
      </Context.Provider>
    </>
  );
};

export default UserListItem;
