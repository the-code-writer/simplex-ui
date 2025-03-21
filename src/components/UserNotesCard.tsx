import React from "react";
import { Avatar, Badge, Button, Flex, theme } from "antd";
import {
  EllipsisOutlined,
  MailOutlined,
  MoreOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
const UserNotesCard: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { title, notes } = params;

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
      <Button className="more" shape="round" type="text">
        <MoreOutlined />
      </Button>
      <Flex gap={16}>
        <div>
          <Avatar
            style={{ border: "1px solid #cccccccc" }}
            size={36}
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
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
            <strong>{title}</strong>
          </span>
          <span
            className="multi-liner text-left"
            style={{
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {notes}
          </span>
        </Flex>
      </Flex>
    </div>
  );
};

export default UserNotesCard;
