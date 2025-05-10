import React from "react";
import { Button, Empty, Typography } from "antd";

const NoData: any = (params: any) => {
  
  const { description, buttonLabel, onButtonClick } = params;

  return (
    <div className="no-data-wrapper">
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        styles={{ image: { height: 200 } }}
        description={<Typography.Text>{description}</Typography.Text>}
      >
        <br/>
        <Button onClick={onButtonClick} type="primary">
          {buttonLabel || "Create Now"}
        </Button>
      </Empty>
    </div>
  );
};

export default NoData;
