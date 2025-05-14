import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Card, Col, Row, Table, Tooltip } from 'antd';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import NumberInfo from './NumberInfo';
import Trend from './Trend';

const generateRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
const generateRandomNumber = (digits:number) =>
  Math.floor(Math.random() * 10 ** digits)
    .toString()
    .padStart(digits, '0');

const statuses = ['Pending', 'Processing', 'Completed', 'Declined'];
const firstNames = [
  'James',
  'Mary',
  'John',
  'Patricia',
  'Robert',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Wilson',
];

const formatCurrency = (num:any) =>
  num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });


const generateData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    count: "USD " + formatCurrency(Math.floor(Math.random() * 50000) + 1000), // Random count between 100-600
    index: index + 1,
    keyword: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`, // Random full name
    range: Math.floor(Math.random() * 30) + 1, // Random range between 1-30
    status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
    regno: `A${generateRandomLetter()}${generateRandomLetter()} ${generateRandomNumber(
      4
    )}`, // Format: AXX1234
  }));
};

const TopSearch = ({
  loading,
  visitData2,
  searchData,
  dropdownGroup,
}: {
  loading: boolean;
  visitData2: DataItem[];
  dropdownGroup: React.ReactNode;
  searchData: DataItem[];
}) => {
  const { styles } = useStyles();
  const columns = [
    {
      title: 'Claim',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Insured Person',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text: React.ReactNode) => <a href="/">{text}</a>,
    },
    {
      title: 'Item',
      dataIndex: 'regno',
      key: 'regno',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Claim Amount USD',
      dataIndex: 'count',
      key: 'count',
      sorter: (
        a: {
          count: number;
        },
        b: {
          count: number;
        },
      ) => a.count - b.count,
    },
  ];

  useEffect(() => {

    console.log('visitData2', visitData2);

    console.log('searchData', searchData);

  }, [searchData, visitData2]);

  return (
    <Card
      loading={loading}
      bordered={false}
      title="Latest Claims"
      extra={dropdownGroup}
      style={{
        height: '100%',
      }}
    >
      <Row gutter={68}>
        <Col
          sm={12}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <NumberInfo
            subTitle={
              <span>
                Today
                <Tooltip title="FF">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            gap={8}
            total={numeral(12321).format('0,0')}
            status="up"
            subTotal={17.1}
          />
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={45}
            axis={false}
            padding={-12}
            style={{ fill: 'linear-gradient(-90deg, white 0%, #6294FA 100%)', fillOpacity: 0.4 }}
            data={visitData2}
          />
        </Col>
        <Col
          sm={12}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <NumberInfo
            subTitle={
              <span>
                Yesterday
                <Tooltip title="HH">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 8,
                    }}
                  />
                </Tooltip>
              </span>
            }
            total={2.7}
            status="down"
            subTotal={26.2}
            gap={8}
          />
          <Area
            xField="x"
            yField="y"
            shapeField="smooth"
            height={45}
            padding={-12}
            style={{ fill: 'linear-gradient(-90deg, white 0%, #6294FA 100%)', fillOpacity: 0.4 }}
            data={visitData2}
            axis={false}
          />
        </Col>
      </Row>
      <Table<any>
        rowKey={(record) => record.index}
        size="small"
        columns={columns}
        dataSource={generateData(10)}
        pagination={{
          style: {
            marginBottom: 0,
          },
          pageSize: 5,
        }}
      />
    </Card>
  );
};
export default TopSearch;
