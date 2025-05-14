import { Card, Col, Row } from "antd";
import { useEffect } from "react";

const V3DChart = () => {
  const options = {
    chart: {
      type: "scatter3d",
      animation: true,
      backgroundColor: "#f8f9fa",
      height: "80%",
    },
    title: {
      text: "Insurance Portfolio Analysis",
      style: {
        color: "#2c3e50",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "Premium Volume by Product and Month",
      style: {
        color: "#7f8c8d",
      },
    },
    plotOptions: {
      scatter3d: {
        width: 10,
        height: 10,
        depth: 10,
        tooltip: {
          headerFormat: "<b>{point.category}</b><br>",
          pointFormat:
            "Month: {point.y}<br>Amount: ${point.z:,.0f}<br>Policies: {point.policies}",
        },
      },
    },
    xAxis: {
      title: {
        text: "Insurance Products",
        style: {
          color: "#2c3e50",
        },
      },
      categories: [
        "Auto Insurance",
        "Homeowners Insurance",
        "Health Insurance",
        "Life Insurance",
        "Travel Insurance",
        "Liability Insurance",
      ],
      labels: {
        style: {
          color: "#34495e",
        },
      },
      gridLineWidth: 1,
      gridLineColor: "#eaecef",
    },
    yAxis: {
      title: {
        text: "Months",
        style: {
          color: "#2c3e50",
        },
      },
      categories: [
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "January",
        "February",
        "March",
        "April",
        "May",
      ],
      labels: {
        style: {
          color: "#34495e",
        },
      },
      gridLineWidth: 1,
      gridLineColor: "#eaecef",
    },
    zAxis: {
      title: {
        text: "Premium Amount ($)",
        style: {
          color: "#2c3e50",
        },
      },
      labels: {
        format: "${value:,.0f}",
        style: {
          color: "#34495e",
        },
      },
    },
    legend: {
      enabled: true,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        color: "#34495e",
      },
    },
    series: [
      {
        name: "Premium Volume",
        colorByPoint: true,
        data: [
          // Auto Insurance
          {
            x: 0,
            y: 0,
            z: 450000,
            name: "June",
            policies: 1250,
            color: "#3498db",
          },
          {
            x: 0,
            y: 1,
            z: 420000,
            name: "July",
            policies: 1150,
            color: "#3498db",
          },
          {
            x: 0,
            y: 2,
            z: 480000,
            name: "August",
            policies: 1350,
            color: "#3498db",
          },
          {
            x: 0,
            y: 3,
            z: 460000,
            name: "September",
            policies: 1280,
            color: "#3498db",
          },
          {
            x: 0,
            y: 4,
            z: 490000,
            name: "October",
            policies: 1400,
            color: "#3498db",
          },

          // Homeowners Insurance
          {
            x: 1,
            y: 0,
            z: 320000,
            name: "June",
            policies: 850,
            color: "#2ecc71",
          },
          {
            x: 1,
            y: 1,
            z: 310000,
            name: "July",
            policies: 820,
            color: "#2ecc71",
          },
          {
            x: 1,
            y: 5,
            z: 380000,
            name: "November",
            policies: 950,
            color: "#2ecc71",
          },
          {
            x: 1,
            y: 6,
            z: 350000,
            name: "December",
            policies: 900,
            color: "#2ecc71",
          },

          // Health Insurance
          {
            x: 2,
            y: 0,
            z: 620000,
            name: "June",
            policies: 2100,
            color: "#e74c3c",
          },
          {
            x: 2,
            y: 7,
            z: 680000,
            name: "January",
            policies: 2250,
            color: "#e74c3c",
          },
          {
            x: 2,
            y: 8,
            z: 650000,
            name: "February",
            policies: 2150,
            color: "#e74c3c",
          },

          // Life Insurance
          {
            x: 3,
            y: 3,
            z: 280000,
            name: "September",
            policies: 750,
            color: "#9b59b6",
          },
          {
            x: 3,
            y: 9,
            z: 310000,
            name: "March",
            policies: 800,
            color: "#9b59b6",
          },
          {
            x: 3,
            y: 10,
            z: 290000,
            name: "April",
            policies: 780,
            color: "#9b59b6",
          },

          // Travel Insurance
          {
            x: 4,
            y: 2,
            z: 180000,
            name: "August",
            policies: 650,
            color: "#f1c40f",
          },
          {
            x: 4,
            y: 5,
            z: 220000,
            name: "November",
            policies: 750,
            color: "#f1c40f",
          },
          {
            x: 4,
            y: 6,
            z: 250000,
            name: "December",
            policies: 850,
            color: "#f1c40f",
          },

          // Liability Insurance
          {
            x: 5,
            y: 0,
            z: 150000,
            name: "June",
            policies: 450,
            color: "#e67e22",
          },
          {
            x: 5,
            y: 4,
            z: 170000,
            name: "October",
            policies: 500,
            color: "#e67e22",
          },
        ],
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      
        window.Highcharts.setOptions({
          colors: window.Highcharts.getOptions().colors.map(function (color:any) {
            return {
              radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5,
              },
              stops: [
                [0, color],
                [1, window.Highcharts.color(color).brighten(-0.2).get("rgb")],
              ],
            };
          }),
        });

        // Set up the chart
        new window.Highcharts.Chart({
          chart: {
            renderTo: "container",
            margin: 100,
            type: "scatter3d",
            animation: false,
            options3d: {
              enabled: true,
              alpha: 10,
              beta: 30,
              depth: 250,
              viewDistance: 5,
              fitToPlot: false,
              frame: {
                bottom: { size: 1, color: "rgba(0,0,0,0.02)" },
                back: { size: 1, color: "rgba(0,0,0,0.04)" },
                side: { size: 1, color: "rgba(0,0,0,0.06)" },
              },
            },
          },
          title: {
            text: "Draggable box",
          },
          subtitle: {
            text: "Click and drag the plot area to rotate in space",
          },
          plotOptions: {
            scatter: {
              width: 10,
              height: 10,
              depth: 10,
            },
          },
          yAxis: {
            min: 0,
            max: 10,
            title: null,
          },
          xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1,
          },
          zAxis: {
            min: 0,
            max: 10,
            showFirstLabel: false,
          },
          legend: {
            enabled: false,
          },
          series: [
            {
              name: "Data",
              colorByPoint: true,
              accessibility: {
                exposeAsGroupOnly: true,
              },
              data: [
                [1, 6, 5],
                [8, 7, 9],
                [1, 3, 4],
                [4, 6, 8],
                [5, 7, 7],
                [6, 9, 6],
                [7, 0, 5],
                [2, 3, 3],
                [3, 9, 8],
                [3, 6, 5],
                [4, 9, 4],
                [2, 3, 3],
                [6, 9, 9],
                [0, 7, 0],
                [7, 7, 9],
                [7, 2, 9],
                [0, 6, 2],
                [4, 6, 7],
                [3, 7, 7],
                [0, 1, 7],
                [2, 8, 6],
                [2, 3, 7],
                [6, 4, 8],
                [3, 5, 9],
                [7, 9, 5],
                [3, 1, 7],
                [4, 4, 2],
                [3, 6, 2],
                [3, 1, 6],
                [6, 8, 5],
                [6, 6, 7],
                [4, 1, 1],
                [7, 2, 7],
                [7, 7, 0],
                [8, 8, 9],
                [9, 4, 1],
                [8, 3, 4],
                [9, 8, 9],
                [3, 5, 3],
                [0, 2, 4],
                [6, 0, 2],
                [2, 1, 3],
                [5, 8, 9],
                [2, 1, 1],
                [9, 7, 6],
                [3, 0, 2],
                [9, 9, 0],
                [3, 4, 8],
                [2, 6, 1],
                [8, 9, 2],
                [7, 6, 5],
                [6, 3, 1],
                [9, 3, 1],
                [8, 9, 3],
                [9, 1, 0],
                [3, 8, 7],
                [8, 0, 0],
                [4, 9, 7],
                [8, 6, 2],
                [4, 3, 0],
                [2, 3, 5],
                [9, 1, 4],
                [1, 1, 4],
                [6, 0, 2],
                [6, 1, 6],
                [3, 8, 8],
                [8, 8, 7],
                [5, 5, 0],
                [3, 9, 6],
                [5, 4, 3],
                [6, 8, 3],
                [0, 1, 5],
                [6, 7, 3],
                [8, 3, 2],
                [3, 8, 3],
                [2, 1, 6],
                [4, 6, 7],
                [8, 9, 9],
                [5, 4, 2],
                [6, 1, 3],
                [6, 9, 5],
                [4, 8, 2],
                [9, 7, 4],
                [5, 4, 2],
                [9, 6, 1],
                [2, 7, 3],
                [4, 5, 4],
                [6, 8, 1],
                [3, 4, 0],
                [2, 2, 6],
                [5, 1, 2],
                [9, 9, 7],
                [6, 9, 9],
                [8, 4, 3],
                [4, 1, 7],
                [6, 2, 5],
                [0, 4, 9],
                [3, 5, 9],
                [6, 9, 1],
                [1, 9, 2],
              ],
            },
          ],
        });

    }, 20000);
    //
  }, []);

  return (
    <Card
      bordered={false}
      title="3D Visualization"
      style={{
        height: "100%",
      }}
    >
      <Row>
        <Col xl={24} lg={24} md={12} sm={24} xs={24}>
          <div id="container"></div>
        </Col>
      </Row>
    </Card>
  );
};
export default V3DChart;
