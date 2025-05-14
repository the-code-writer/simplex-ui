import { Column } from '@ant-design/plots';
import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';

export type TimeType = 'today' | 'week' | 'month' | 'year';

const { RangePicker } = DatePicker;

const rankingListData: {
  title: string;
  total: number;
}[] = [];

const claimTypes = ['Accident', 'Theft', 'Vandalism', 'Other'];

for (let i = 0; i < claimTypes.length; i++) {
  rankingListData.push({
    title: claimTypes[i],
    total: Math.floor(Math.random() * 1000) + 100, // Random amount between 100-1100
  });
}

const getActiveList = (): number => {
  return Math.min(1, 10);
};

const monthlyData = [
  { x: 'Jan', y: 939 },
  { x: 'Feb', y: 901 },
  { x: 'Mar', y: 274 },
  { x: 'Apr', y: 356 },
  { x: 'May', y: 292 },
  { x: 'Jun', y: 1012 },
  { x: 'Jul', y: 203 },
  { x: 'Aug', y: 761 },
  { x: 'Sep', y: 268 },
  { x: 'Oct', y: 971 },
  { x: 'Nov', y: 986 }, // Changed from 11月 to Nov
  { x: 'Dec', y: 250 },
];

// If you need to generate this programmatically with random values between 200-1000:
function generateMonthlyData() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return months.map((month) => ({
    x: month,
    y: Math.floor(Math.random() * 800) + 200, // Random value between 200-1000
  }));
}

const SalesCard2 = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}: {
  rangePickerValue: RangePickerProps<dayjs.Dayjs>['value'];
  isActive: (key: TimeType) => string;
  salesData: DataItem[];
  loading: boolean;
  handleRangePickerChange: RangePickerProps<dayjs.Dayjs>['onChange'];
  selectDate: (key: TimeType) => void;
}) => {
  const { styles } = useStyles();

  const [barGraph, setBarGraph] = useState([]);

  useEffect(() => {
    setBarGraph(generateMonthlyData());
  }, [salesData]);

  return (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  Today
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  Week
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  Month
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  Year
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{
                  width: 256,
                }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: 'sales',
              label: 'Monthly Claims Amount',
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={barGraph}
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                            gridLineDash: null,
                            gridStroke: '#ccc',
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: '...',
                          channel: 'y',
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>Claims By Category</h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < getActiveList() ? styles.rankingItemNumberActive : ''
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className={styles.rankingItemTitle} title={item.title}>
                              {item.title}
                            </span>
                            <span>{numeral(item.total).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'views',
              label: 'Yearly Claims Amount',
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={barGraph}
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: '访问量',
                          channel: 'y',
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>Claims By Category</h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span
                              className={`${
                                i < getActiveList()
                                  ? styles.rankingItemNumberActive
                                  : styles.rankingItemNumber
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className={styles.rankingItemTitle} title={item.title}>
                              {item.title}
                            </span>
                            <span>{numeral(item.total).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default SalesCard2;
