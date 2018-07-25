
import React from 'react';
import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown.js';

function getCategoriesSeriesData(datas) {
	datas = datas[0].data;
	datas.sort(function(a, b){return b[1] - a[1]});

	const series = [];
	let count = 0;
	for (let i = 0; i < datas.length; i += 1) {
		if (datas[i][1] < 15) {
			count += datas[i][1];
		} else {
			series.push({
			  name: datas[i][0],
			  y: datas[i][1]
			});
		}
	}
	series.push({
		name: 'Other',
		y: count,
		drilldown: 'Other'
	});
	return series;
}

function getCategoriesDrilldownData(datas) {
	datas = datas[0].data;
	datas.sort(function(a, b){return b[1] - a[1]});

	const series = [];
	let count = 0;
	for (let i = 0; i < datas.length; i += 1) {
		if (datas[i][1] <= 3) {
			count += datas[i][1];
		}
		else if (datas[i][1] < 15) {
			series.push([datas[i][0],datas[i][1]]);
		}
	}
	series.push(['Other', count]);
	return series;
}

class PieChart extends React.Component {
	constructor(props) {
    super(props);
    drilldown(Highcharts);
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
			data: getCategoriesSeriesData(this.props.data)
		}],
		drilldown: {
			series: [{
				name: 'Count',
				id: 'Other',
				data: getCategoriesDrilldownData(this.props.data)
			}]
		}
    });
    setTimeout(() => {
      this.chart.reflow();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.chart.update({ series: getCategoriesSeriesData(nextProps.data) }, true);
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