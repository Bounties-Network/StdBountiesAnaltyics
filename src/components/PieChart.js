
import React from 'react';
import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown.js';
import no_data_to_display from 'highcharts/modules/no-data-to-display.js';

function getCategoriesSeriesData(datas) {
	datas = datas[0].data;
	datas.sort(function(a, b){return b[1] - a[1]});

	if (datas.length === 0) {
		return []
	}

	const series = [];
	const cutoffIndex = getCutoffIndex(datas);
	let count = 0;

	for (let i = 0; i < cutoffIndex; i += 1) {
		series.push({
			name: datas[i][0],
			y: datas[i][1]
		});
	}

	for (let i = cutoffIndex; i < datas.length; i += 1) {
		count += datas[i][1];
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

	if (datas.length === 0) {
		return []
	}

	const series = [];
	const cutoffIndex = getCutoffIndex(datas);
	const cutoff = parseInt(datas[cutoffIndex][1] * 0.4, 10)
	let count = 0;

	for (let i = cutoffIndex; i < datas.length; i += 1) {
		if (datas[i][1] <= cutoff) {
			count += datas[i][1];
		} else {
			series.push([datas[i][0],datas[i][1]]);
		}
	}

	series.push(['Other', count]);
	return series;
}

function getCutoffIndex(datas) {
	const total = datas.reduce((total, arr) => total + arr[1], 0);
	const cutoff = parseInt(total * 0.75, 10);
	let sum = 0;

	for (let i = 0; i < datas.length; i += 1) {
		if (sum > cutoff) {
			return i;
		}
		sum += datas[i][1];
	}
}

class PieChart extends React.Component {
	constructor(props) {
    super(props);
    drilldown(Highcharts);
    no_data_to_display(Highcharts);
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
  	console.log(this.props.data);
  	console.log(nextProps.data);
    if (nextProps.data !== this.props.data) {
      	this.chart.update({ 
      		series: [{
				name: 'Count',
				colorByPoint: true,
				data: getCategoriesSeriesData(nextProps.data)
			}],
			drilldown: {
				series: [{
					name: 'Count',
					id: 'Other',
					data: getCategoriesDrilldownData(nextProps.data)
				}]
			} 
		}, true);
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