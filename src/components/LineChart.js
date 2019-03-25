
import React from 'react';
import { Select } from 'antd';
import Highcharts from 'highcharts';
import noDataToDisplay from 'highcharts/modules/no-data-to-display.js';

const { Option } = Select;

function getSeries(analyticsData, period) {
  const series = [];
  for (let i = 0; i < analyticsData.length; i += 1) {
    const data = [];
    Object.assign(data, analyticsData[i].data[period === 'week' ? 1 : 0]);
    series.push({
      name: analyticsData[i].name,
      data
    });
  }
  return series;
}

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    noDataToDisplay(Highcharts);
    this.state = { period: props.period };
    this.handleSwitch = this.handleSwitch.bind(this);
  }

  // When the DOM is ready, create the chart.
  componentDidMount() {
    this.chart = Highcharts.chart(this.props.id, {
      chart: {
        type: 'spline',
        backgroundColor: "#37474f"
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.props.title,
        style: {
  				color: "white"
  			}
      },
      subtitle: {
        text: this.props.subtitle,
        style: {
  				color: "white"
  			}
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        color: 'white',
        itemStyle: {
          color: "white"
        }
      },
      colors: ['#2f7ed8', '#8bbc21', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2018,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 3
              }
            }
          }
        }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%d %b'
        },
        style: {
          color: "white"
        },
        labels: {
          style: {
            color: "white"
          }
        },
        title: {
          style: {
            color: "white"
          }
        }
      },
      yAxis: {
        style: {
          color: "white"
        },
        labels: {
          style: {
            color: "white"
          }
        },
        title: {
          style: {
            color: "white"
          }
        }
      },
      series: getSeries(this.props.data, this.props.period),
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    });
    setTimeout(() => {
      this.chart.reflow();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data || nextProps.period !== this.props.period) {
      this.setState({ period: nextProps.period });
      this.chart.update({ series: getSeries(nextProps.data, nextProps.period) }, true);
    }
  }
  componentWillUnmount() {
    this.chart.destroy();
  }
  handleSwitch(value) {
    this.setState({ period: value });
    this.chart.update({ series: getSeries(this.props.data, value) }, true);
  }

  render() {
    return (
      <div>
        <div id={this.props.id} />
        <Select
          style={{
            position: 'absolute', top: '0px', right: '20px', width: '85px'
          }}
          value={this.state.period}
          onSelect={this.handleSwitch}
        >
          <Option key="day" value="day">Daily</Option>
          <Option key="week" value="week">Weekly</Option>
          <Option key="month" value="month">Monthly</Option>
        </Select>
      </div>);
  }
}

export default LineChart;
