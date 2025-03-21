import React from "react";
import { Avatar, Badge, Button, Flex, theme } from "antd";
import { EllipsisOutlined, MailOutlined, MoreOutlined, PhoneOutlined } from "@ant-design/icons";
const UserContactCard: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { fullname, designation, phoneNumber, emailAddress } = params;

  return (
    <div
      className="dashboard-card shadow-1"
      style={{
        padding: 14,
        textAlign: "center",
        background: colorBgContainer,
        borderRadius: 16,
        width: "100%",
        marginTop: 16,
        marginLeft: 24,
      }}
    >
          <Button className="more" shape="round" type="text"><MoreOutlined /></Button>
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
          <span
            className="single-liner text-left"
            style={{
              marginBottom: 0,
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            <strong>{fullname}</strong>
          </span>
          <span
            className="single-liner text-left"
            style={{
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {designation}
          </span>
          <span
            className="single-liner text-left alink"
            style={{
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <PhoneOutlined />
            &nbsp;&nbsp;{phoneNumber}
          </span>
          <span
            className="single-liner text-left alink"
            style={{
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <MailOutlined />
            &nbsp;&nbsp;{emailAddress}
          </span>
        </Flex>
          </Flex>
    </div>
  );
};

export default UserContactCard;
