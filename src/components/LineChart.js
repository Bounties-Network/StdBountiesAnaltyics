
import React from 'react';
import { Select } from 'antd';
import Highcharts from 'highcharts';
import noDataToDisplay from 'highcharts/modules/no-data-to-display.js';

const { Option } = Select;

function getSeries(datas, period) {
  const series = [];
  for (let i = 0; i < datas.length; i += 1) {
    const data = [];
    Object.assign(data, datas[i].data[period === 'week' ? 1 : 0]);
    series.push({
      name: datas[i].name,
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
        type: this.props.type
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.props.title
      },
      subtitle: {
        text: this.props.subtitle
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },
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
        </Select>
      </div>);
  }
}

export default LineChart;
