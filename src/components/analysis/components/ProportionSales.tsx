import { Pie } from "@ant-design/plots";
import { Card, Radio, Typography } from "antd";
import type { RadioChangeEvent } from "antd/es/radio";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import type { DataItem } from "../data.d";
import useStyles from "../style.style";
const { Text } = Typography;

const zimbabweTowns = [
  { x: "Harare", y: 52580 }, // Capital city - highest value
  { x: "Bulawayo", y: 25620 }, // Second largest city
  { x: "Chitungwiza", y: 8480 }, // High-density suburb of Harare
  { x: "Mutare", y: 2420 }, // Major eastern city
  { x: "Gweru", y: 1380 }, // Midlands capital
  { x: "Kwekwe", y: 1340 }, // Industrial city
  { x: "Kadoma", y: 1300 }, // Mining town
  { x: "Masvingo", y: 880 }, // Provincial capital
  { x: "Chinhoyi", y: 250 }, // Provincial capital
  { x: "Bindura", y: 220 }, // Mining town
  { x: "Beitbridge", y: 200 }, // Border town
  { x: "Hwange", y: 180 }, // Mining town
  { x: "Victoria Falls", y: 170 }, // Tourist destination
  { x: "Rusape", y: 150 }, // Smaller town
  { x: "Marondera", y: 140 }, // Agricultural town
  { x: "Kariba", y: 120 }, // Tourist destination
  { x: "Chipinge", y: 110 }, // Agricultural town
  { x: "Gwanda", y: 100 }, // Provincial capital
  { x: "Shurugwi", y: 90 }, // Mining town
  { x: "Zvishavane", y: 85 }, // Mining town
  { x: "Lupane", y: 80 }, // Provincial capital
];

// If you need to generate this programmatically:
function generateZimbabweTowns() {
  const provinces = [
    "Harare",
    "Bulawayo",
    "Chitungwiza",
    "Mutare",
    "Gweru",
    "Kwekwe",
    "Kadoma",
    "Masvingo",
    "Chinhoyi",
    "Bindura",
    "Beitbridge",
    "Hwange",
    "Victoria Falls",
    "Rusape",
    "Marondera",
    "Kariba",
    "Chipinge",
    "Gwanda",
    "Shurugwi",
    "Zvishavane",
    "Lupane",
  ];

  return provinces.map((province, index) => {
    // Major cities get higher values
    if (index < 3)
      return { x: province, y: Math.floor(Math.random() * 20000) + 400 };
    // Medium cities
    if (index < 7)
      return { x: province, y: Math.floor(Math.random() * 1050) + 250 };
    // Smaller towns
    return { x: province, y: Math.floor(Math.random() * 5020) + 80 };
  });
}

const generatedTowns = generateZimbabweTowns();
const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: "all" | "online" | "stores";
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  const { styles } = useStyles();

  const [provicesData, setProvicesData] = useState([]);

  useEffect(() => {
    const _data = generateZimbabweTowns();
    console.log("_data", _data);
    setProvicesData(_data);
  }, []);

  const handleChangeSalesTypem = () => {
    const _data = generateZimbabweTowns();
    console.log("_data", _data);
    setProvicesData(_data);
  };

  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="Claims By Towns"
      style={{
        height: "100%",
      }}
      extra={
        <div className={styles.salesCardExtra}>
          {dropdownGroup}
          <div className={styles.salesTypeRadio}>
            <Radio.Group value={salesType} onChange={handleChangeSalesTypem}>
              <Radio.Button value="online">This Week</Radio.Button>
              <Radio.Button value="month">This Month</Radio.Button>
              <Radio.Button value="stores">This Year</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
    >
      <div>
        <Text>Towns Chart</Text>
        <Pie
          height={340}
          radius={0.8}
          innerRadius={0.5}
          angleField="y"
          colorField="x"
          data={provicesData as any}
          legend={false}
          label={{
            position: "spider",
            text: (item: { x: number; y: number }) => {
              return `${item.x}: ${numeral(item.y).format("0,0")}`;
            },
          }}
        />
      </div>
    </Card>
  );
};
export default ProportionSales;
