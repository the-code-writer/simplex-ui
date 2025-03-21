import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import UserContactCard from "./UserContactCard";
import UserNotesCard from "./UserNotesCard";

const ActivityTimeLine: React.FC = () => (
  <Timeline
    mode="alternate"
    items={[
      {
        dot: (
          <>
            <div className="timeline-dot-wrapper color-orange">
              <ClockCircleOutlined />
            </div>
          </>
        ),
        children: (
          <>
            <h3>Account Manager Details</h3>
            <h5>Thur 25 Sep 2024, 13:49</h5>
            <div className="item-content">
              <UserContactCard
                fullname={"Sheila Hwititi"}
                designation={"Account Manager"}
                phoneNumber={"+263 772 123 456"}
                emailAddress={"sheila.hwititi@liquid.tech"}
              />
            </div>
          </>
        ),
      },
      {
        dot: (
          <>
            <div className="timeline-dot-wrapper color-orange">
              <ClockCircleOutlined />
            </div>
          </>
        ),
        children: (
          <>
            <h3>Notes</h3>
            <h5>Thur 25 Sep 2024, 13:49</h5>
            <div className="item-content notes">
              <UserNotesCard
                title={"Sheila Hwititi"}
                notes={
                  "Lorem ipsum odor amet, consectetuer adipiscing elit. Placerat tortor. Lacinia morbi? Conubia. Feugiat varius. Eros. Inceptos sagittis. Dignissim mollis."
                }
              />
            </div>
          </>
        ),
      },
      {
        dot: (
          <>
            <div className="timeline-dot-wrapper color-orange">
              <ClockCircleOutlined />
            </div>
          </>
        ),
        children: (
          <>
            <h3>Account Manager Details</h3>
            <h5>Thur 25 Sep 2024, 13:49</h5>
            <div className="item-content">
              <UserContactCard
                fullname={"Sheila Hwititi"}
                designation={"Account Manager"}
                phoneNumber={"+263 772 123 456"}
                emailAddress={"sheila.hwititi@liquid.tech"}
              />
            </div>
          </>
        ),
      },
      {
        dot: (
          <>
            <div className="timeline-dot-wrapper color-orange">
              <ClockCircleOutlined />
            </div>
          </>
        ),
        children: (
          <>
            <h3>Account Manager Details</h3>
            <h5>Thur 25 Sep 2024, 13:49</h5>
            <div className="item-content">
              <UserContactCard
                fullname={"Sheila Hwititi"}
                designation={"Account Manager"}
                phoneNumber={"+263 772 123 456"}
                emailAddress={"sheila.hwititi@liquid.tech"}
              />
            </div>
          </>
        ),
      },
    ]}
  />
);

export default ActivityTimeLine;
