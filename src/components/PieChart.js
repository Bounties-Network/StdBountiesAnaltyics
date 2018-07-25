
import React from 'react';
import Highcharts from 'highcharts';

function getSeriesData(datas) {
	datas = datas[0].data;
	datas.sort(function(a, b){return a[1] - b[1]})

	const series = [];
	for (let i = 0; i < datas.length; i += 1) {
	series.push({
	  name: datas[i][0],
	  y: datas[i][1]
	});
	}
	return series;
}

class PieChart extends React.Component {
	constructor(props) {
    super(props);
  }

  // When the DOM is ready, create the chart.
  componentDidMount() {
    this.chart = Highcharts.chart(this.props.id, {
      chart: {
        type: 'pie'
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
      tooltip: {
	    pointFormat: '{series.name}: <b>{point.y}</b>'
	  },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f}%',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
      },
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: getSeriesData(this.props.data)
	    }]
    });
    setTimeout(() => {
      this.chart.reflow();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.chart.update({ series: getSeriesData(nextProps.data) }, true);
    }
  }
  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div>
        <div id={this.props.id} />
      </div>);
  }
}

export default PieChart;