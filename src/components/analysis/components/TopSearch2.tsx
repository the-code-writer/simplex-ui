import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Button, Card, Col, Flex, Row, Table, Tooltip } from 'antd';
import numeral from 'numeral';
import React, { useEffect } from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
import NumberInfo from './NumberInfo';

const generateRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
const generateRandomNumber = (digits: number) =>
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

const generateData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    count: Math.floor(Math.random() * 500) + 1000, // Random count between 100-600
    index: index + 1,
    keyword: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`, // Random full name
    range: Math.floor(Math.random() * 30) + 1, // Random range between 1-30
    status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
    regno: `A${generateRandomLetter()}${generateRandomLetter()} ${generateRandomNumber(4)}`, // Format: AXX1234
  }));
};

const TopSearch2 = ({
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
      title="Claim Approval"
      extra={dropdownGroup}
      style={{
        height: '100%',
      }}
    >
      <Row>
        <Col xl={24} lg={24} md={12} sm={24} xs={24}>
          <div>
            <ul className={styles.rankingList} style={{ margin: "-8px 0 0 0", padding: 0 }}>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Claim Number</strong>
                </span>
                <span>SIC03492</span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Policy Number</strong>
                </span>
                <span>PXR000154-763</span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Policy Holder</strong>
                </span>
                <span>Tapiwa H. Zingoni</span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Vehicle Reg Number</strong>
                </span>
                <span>AEG 3874</span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Claim Amount</strong>
                </span>
                <span>USD 1,893.00</span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Policy Manager</strong>
                </span>
                <span>Alice Munatsi </span>
              </li>
              <li>
                <span className={styles.rankingItemTitle}>
                  <strong>Claim Amount</strong>
                </span>
                <span>USD 1,893.00</span>
              </li>
            </ul>
            <br />
            <Flex>
              <Button type="primary" color="red" variant="filled" style={{marginRight: 24}}>
                <strong>Decline</strong>
              </Button>{' '}
              <Button type="primary" color="cyan" variant="filled">
                <strong>Approve</strong>
              </Button>
            </Flex>
          </div>
        </Col>
      </Row>
    </Card>
  );
};
export default TopSearch2;
