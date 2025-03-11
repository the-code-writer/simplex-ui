import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Col,
  ConfigProvider,
  Dropdown,
  Flex,
  MenuProps,
  message,
  Modal,
  Popover,
  Row,
  theme,
} from "antd";
import {
  EditOutlined,
  EditTwoTone,
  FileOutlined,
  FileTextOutlined,
  FlagOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { createStyles } from "antd-style";

import qrCode from "../assets/qrcode.png";

import ltzLogo from "../assets/ltz.png";

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

const ListViewDocumentCard: React.FC = (params: any) => {
  const { styles } = useStyle();

  const [modal1Open, setModal1Open] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { doc } = params;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    message.info("Click on left button.");
    console.log("click left button", e);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    message.info("Click on menu item.");
    console.log("click", e.key);
    switch (e.key) {
      case "0": {
        setModal1Open(true);
        break;
      }

      default: {
        break;
      }
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "View SO Details",
      key: "0",
      icon: <FileOutlined />,
    },
    {
      label: "Update Flag",
      key: "1",
      icon: <FlagOutlined />,
    },
    {
      label: "Allocations",
      key: "2",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: "Contractor BOQ",
      key: "3",
      icon: <FileTextOutlined />,
    },
    {
      label: "Edit SO",
      key: "3",
      icon: <EditOutlined />,
    },
    {
      label: "Update SO Status",
      key: "3",
      icon: <EditOutlined />,
    },
    {
      label: "Update SO Notes",
      key: "3",
      icon: <EditOutlined />,
    },
    {
      label: "Print SO",
      key: "3",
      icon: <PrinterOutlined />,
    },
    {
      label: "Share SO",
      key: "3",
      icon: <ShareAltOutlined />,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const content = (
    <Flex gap={16}>
      <div>
        <Badge status="success" dot>
          <Avatar
            style={{ border: "1px solid #cccccccc" }}
            size={72}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </Badge>
      </div>
      <Flex gap={0} vertical>
        <span style={{ marginBottom: 0, fontSize: 24, fontWeight: 800 }}>
          <strong>{doc.User.Value}</strong>
        </span>
        <span style={{ marginBottom: 0, fontSize: 12, fontWeight: 600 }}>
          GPON Engineer
        </span>
        <span style={{ marginBottom: 0, fontSize: 12, fontWeight: 600 }}>
          +263 772 123 456
        </span>
      </Flex>
    </Flex>
  );

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
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={8} xl={8}>
            <div className="label-value-pair doc-number-status">
              <span className="label">SO #:</span>
              <span className="value single-liner">{doc.Number}</span>
            </div>
            <div className="label-value-pair doc-customer">
              <span className="label">{doc.Customer.Label}:</span>
              <span className="value single-liner">{doc.Customer.Value}</span>
            </div>
            <div className="label-value-pair doc-customer-address">
              <span className="label">{doc.CustomerAddress.Label}:</span>
              <span className="value single-liner">
                {doc.CustomerAddress.Value}
              </span>
            </div>
            <div className="label-value-pair doc-user">
              <span className="label">{doc.User.Label}:</span>
              <span className="value single-liner">
                <Popover content={content}>
                  <UserOutlined /> <a href="#">{doc.User.Value}</a>
                </Popover>
              </span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={7} xl={7}>
            <div className="label-value-pair doc-milestone">
              <span className="label">{doc.Milestone.Label}:</span>
              <span className="value single-liner">{doc.Milestone.Value}</span>
            </div>
            <div className="label-value-pair doc-techtype">
              <span className="label">{doc.TechnologyType.Label}:</span>
              <span className="value single-liner">
                {doc.TechnologyType.Value}
              </span>
            </div>
            <div className="label-value-pair doc-service-type">
              <span className="label">{doc.ServiceType.Label}:</span>
              <span className="value single-liner">
                {doc.ServiceType.Value}
              </span>
            </div>
            <div className="label-value-pair doc-order-type">
              <span className="label">{doc.OrderType.Label}:</span>
              <span className="value single-liner">{doc.OrderType.Value}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={5} xl={5}>
            <div className="label-value-pair doc-milestone-age">
              <span className="label">{doc.MilestoneAge.Label}:</span>
              <span className="value single-liner">
                {doc.MilestoneAge.Value}
              </span>
            </div>
            <div className="label-value-pair doc-cumulative-age">
              <span className="label">{doc.CumulativeAge.Label}:</span>
              <span className="value single-liner">
                {doc.CumulativeAge.Value}
              </span>
            </div>
            <div className="label-value-pair doc-status">
              <span className="status single-liner">{doc.Status}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={4} xl={4}>
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
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={8} xl={8}>
            <div className="label-value-pair doc-number">
              <span className="label">SO #:</span>
              <span className="value single-liner">{doc.Number}</span>
            </div>
            <div className="label-value-pair doc-customer">
              <span className="label">{doc.Customer.Label}:</span>
              <span className="value single-liner">{doc.Customer.Value}</span>
            </div>
            <div className="label-value-pair doc-customer-address">
              <span className="label">{doc.CustomerAddress.Label}:</span>
              <span className="value single-liner">
                {doc.CustomerAddress.Value}
              </span>
            </div>
            <div className="label-value-pair doc-user">
              <span className="label">{doc.User.Label}:</span>
              <span className="value single-liner">
                <Popover content={content}>
                  <UserOutlined /> <a href="#">{doc.User.Value}</a>
                </Popover>
              </span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={7} xl={7}>
            <div className="label-value-pair doc-milestone">
              <span className="label">{doc.Milestone.Label}:</span>
              <span className="value single-liner">{doc.Milestone.Value}</span>
            </div>
            <div className="label-value-pair doc-techtype">
              <span className="label">{doc.TechnologyType.Label}:</span>
              <span className="value single-liner">
                {doc.TechnologyType.Value}
              </span>
            </div>
            <div className="label-value-pair doc-service-type">
              <span className="label">{doc.ServiceType.Label}:</span>
              <span className="value single-liner">
                {doc.ServiceType.Value}
              </span>
            </div>
            <div className="label-value-pair doc-order-type">
              <span className="label">{doc.OrderType.Label}:</span>
              <span className="value single-liner">{doc.OrderType.Value}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={5} xl={5}>
            <div className="label-value-pair doc-milestone-age">
              <span className="label">{doc.MilestoneAge.Label}:</span>
              <span className="value single-liner">
                {doc.MilestoneAge.Value}
              </span>
            </div>
            <div className="label-value-pair doc-cumulative-age">
              <span className="label">{doc.CumulativeAge.Label}:</span>
              <span className="value single-liner">
                {doc.CumulativeAge.Value}
              </span>
            </div>
            <div className="label-value-pair doc-status">
              <span className="status single-liner">{doc.Status}</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={4} xl={4}>
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
        title="Service Order Details"
        style={{ top: 20 }}
        width={1200}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
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
        <span className="ant-modal-card-title">SO Summary</span>

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
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="label-value-pair doc-number-status-wrapper">
                <span className="number single-liner">{doc.Number}</span>
                <span className="status single-liner">{doc.Status}</span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-customer">
                <span className="label">{doc.Customer.Label}:</span>
                <span className="value single-liner">{doc.Customer.Value}</span>
              </div>
              <div className="label-value-pair doc-customer-address">
                <span className="label">{doc.CustomerAddress.Label}:</span>
                <span className="value single-liner">
                  {doc.CustomerAddress.Value}
                </span>
              </div>
              <div className="label-value-pair doc-user">
                <span className="label">{doc.User.Label}:</span>
                <span className="value single-liner">
                  <Popover content={content}>
                    <UserOutlined /> <a href="#">{doc.User.Value}</a>
                  </Popover>
                </span>
              </div>
              <div className="label-value-pair doc-user">
                <span className="label">{doc.AccountManager.Label}:</span>
                <span className="value single-liner">
                  <Popover content={content}>
                    <UserOutlined /> <a href="#">{doc.AccountManager.Value}</a>
                  </Popover>
                </span>
              </div>
              <div className="label-value-pair doc-milestone">
                <span className="label">{doc.Milestone.Label}:</span>
                <span className="value single-liner">
                  {doc.Milestone.Value}
                </span>
              </div>
              <div className="label-value-pair doc-techtype">
                <span className="label">{doc.TechnologyType.Label}:</span>
                <span className="value single-liner">
                  {doc.TechnologyType.Value}
                </span>
              </div>
              <div className="label-value-pair doc-service-type">
                <span className="label">{doc.ServiceType.Label}:</span>
                <span className="value single-liner">
                  {doc.ServiceType.Value}
                </span>
              </div>
              <div className="label-value-pair doc-order-type">
                <span className="label">{doc.OrderType.Label}:</span>
                <span className="value single-liner">
                  {doc.OrderType.Value}
                </span>
              </div>
              <div className="label-value-pair doc-order-type">
                <span className="label">{doc.ProjectCode.Label}:</span>
                <span className="value single-liner">
                  {doc.ProjectCode.Value}
                </span>
              </div>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="label-value-pair doc-date-created">
                <span className="label">{doc.CreatedAt.Label}:</span>
                <span className="value single-liner">
                  {doc.CreatedAt.Value}
                </span>
              </div>
              <div className="label-value-pair doc-date-updated">
                <span className="label">{doc.UpdatedAt.Label}:</span>
                <span className="value single-liner">
                  {doc.UpdatedAt.Value}
                </span>
              </div>
              <div className="label-value-pair doc-milestone-age">
                <span className="label">{doc.MilestoneAge.Label}:</span>
                <span className="value single-liner">
                  {doc.MilestoneAge.Value}
                </span>
              </div>
              <div className="label-value-pair doc-cumulative-age">
                <span className="label">{doc.CumulativeAge.Label}:</span>
                <span className="value single-liner">
                  {doc.CumulativeAge.Value}
                </span>
              </div>
              <div className="label-value-pair doc-area">
                <span className="label">{doc.Area.Label}:</span>
                <span className="value single-liner">{doc.Area.Value}</span>
              </div>
              <div className="label-value-pair doc-start-point">
                <span className="label">{doc.StartPoint.Label}:</span>
                <span className="value single-liner">
                  {doc.StartPoint.Value}
                </span>
              </div>
              <div className="label-value-pair doc-end-point">
                <span className="label">{doc.EndPoint.Label}:</span>
                <span className="value single-liner">{doc.EndPoint.Value}</span>
              </div>
              <div className="label-value-pair doc-coordinates">
                <span className="label">{doc.Coordinates.Label}:</span>
                <span className="value single-liner">
                  {doc.Coordinates.Value}
                </span>
              </div>
              <div className="label-value-pair doc-isp-name">
                <span className="label">{doc.ISPName.Label}:</span>
                <span className="value single-liner">{doc.ISPName.Value}</span>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default ListViewDocumentCard;
