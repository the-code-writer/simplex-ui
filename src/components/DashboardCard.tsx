import React from "react";
import { theme } from "antd";
const DashboardCard: React.FC = (params: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { icon, value, label } = params;

  return (
    <div
      className="dashboard-card shadow-1"
      style={{
        padding: 24,
        textAlign: "center",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: "100%",
      }}
    >
      <div className="stats-wrapper">
        <div className="icon">{icon}</div>
        <div className="value single-liner">{value}</div>
      </div>
      <div className="stats-label single-liner text-left">{label}</div>
    </div>
  );
};

export default DashboardCard;