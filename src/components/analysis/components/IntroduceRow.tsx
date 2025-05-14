import { InfoCircleOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { Col, Progress, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import Yuan from '../utils/Yuan';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => {
  const { styles } = useStyles();
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="Total Claims This Month"
          action={
            <Tooltip title="Total claims">
              <InfoCircleOutlined />
            </Tooltip>
          }
          loading={loading}
          total={() => <>Claims: USD 523,452.95</>}
          footer={<Field label="Increased by" value={`USD${numeral(12423).format('0,0')}`} />}
          contentHeight={46}
        >
          <Trend
            flag="up"
            style={{
              marginRight: 16,
            }}
          >
            Monthly
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            Weekly
            <span className={styles.trendText}>11%</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Motor Vehicle Claims"
          action={
            <Tooltip title="This years Accidents">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(7446).format('0,0')}
          footer={<Field label="This Week" value={numeral(1234).format('0,0')} />}
          contentHeight={46}
        >
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={46}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="Claims Created This Month"
          action={
            <Tooltip title="...">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={numeral(26510).format('0,0')}
          footer={<Field label="% increase from previous month" value="60%" />}
          contentHeight={46}
        >
          <Column
            xField="x"
            yField="y"
            padding={-20}
            axis={false}
            height={46}
            data={visitData}
            scale={{ x: { paddingInner: 0.4 } }}
          />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="SLA Compliance"
          action={
            <Tooltip title="...">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="88%"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                Claims processed within the SLA
                <span className={styles.trendText}>12%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <Progress percent={88} strokeColor={{ from: '#108ee9', to: '#87d068' }} status="active" />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="SLA Violations"
          action={
            <Tooltip title="...">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="12%"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <Trend
                flag="up"
                style={{
                  marginRight: 16,
                }}
              >
                Claims processed within outside the SLA
                <span className={styles.trendText}>12%</span>
              </Trend>
            </div>
          }
          contentHeight={46}
        >
          <Progress percent={12} strokeColor={{ from: '#cc0000', to: '#ff0000' }} status="active" />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="Unallocated Claims"
          action={
            <Tooltip title="...">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total="374"
          footer={
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span>Number of unassigned claims of 3,463 total</span>
            </div>
          }
          contentHeight={46}
        >
          <Progress percent={78} strokeColor={{ from: '#108ee9', to: '#87d068' }} status="active" />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
