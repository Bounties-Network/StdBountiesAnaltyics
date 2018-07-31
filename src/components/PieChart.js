
import React from 'react';
import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown.js';
import noDataToDisplay from 'highcharts/modules/no-data-to-display.js';

function getSeriesData(analyticsData) {
	let rawData = analyticsData[0];
	if (rawData.id === 'categories') {
		return getCategoriesSeriesData(analyticsData);
	} else if (rawData.id === 'tokens') {
		return getTokensSeriesData(analyticsData);
	}
}

function getDrilldownData(analyticsData) {
	let rawData = analyticsData[0];
	if (rawData.id === 'categories') {
		return getCategoriesDrilldownData(analyticsData);
	} else if (rawData.id === 'tokens') {
		return getTokensDrilldownData(analyticsData);
	}
}

function getCategoriesSeriesData(analyticsData) {
	// get categories array from raw analyticsData
	let categoriesData = analyticsData[0].data;

	// category = [name, count]
	// sort array descending by count 
	categoriesData.sort(function(a, b){return b[1] - a[1]});

	// if no categories, display nothing
	if (categoriesData.length === 0) {
		return []
	}

	const series = [];
	const cutoffIndex = getCutoffIndex(categoriesData);

	for (let i = 0; i < cutoffIndex; i += 1) {
		let categoryName = categoriesData[i][0];
		let totalCount = categoriesData[i][1];
		series.push({
			name: categoryName,
			y: totalCount
		});
	}

	// generate Other category for less frequent bounty categories
	let otherCount = 0;

	for (let i = cutoffIndex; i < categoriesData.length; i += 1) {
		let count = categoriesData[i][1];
		otherCount += count;
	}

	series.push({
		name: 'Other',
		y: otherCount ,
		drilldown: 'Other'
	});
	return series;
}

function getCategoriesDrilldownData(analyticsData) {
	// get categories array from raw analyticsData
	let categoriesData = analyticsData[0].data;

	// category = [name, count]
	// sort array descending by count 
	categoriesData.sort(function(a, b){return b[1] - a[1]});

	// if no categories, display nothing
	if (categoriesData.length === 0) {
		return []
	}

	const series = [];
	const cutoffIndex = getCutoffIndex(categoriesData);
	const minCountCutoff = parseInt(categoriesData[cutoffIndex][1] * 0.4, 10)
	let otherCount = 0;

	for (let i = cutoffIndex; i < categoriesData.length; i += 1) {
		let totalCount = categoriesData[i][1];
		if (totalCount <= minCountCutoff) {
			otherCount += totalCount;
		} else {
			let categoryName = categoriesData[i][0];
			let totalCount = categoriesData[i][1];
			series.push([categoryName, totalCount]);
		}
	}

	series.push(['Other', otherCount]);
	return series;
}

function getTokensSeriesData(analyticsData) {
	let tokenData = analyticsData[0].data;

	tokenData.sort(function(a, b){return b[1] - a[1]});

	const series = [];
	let otherCount = 0;

	for (let i = 0; i < tokenData.length; i += 1) {
		let tokenSymbol = tokenData[i][0];
		let count = tokenData[i][1];
		if (count > 5) {
			series.push({
				name: tokenSymbol,
				y: count
			});
		} else {
			otherCount += count;
		}
		
	}

	series.push({
		name: 'Other',
		y: otherCount ,
		drilldown: 'Other'
	});

	return series;
}

function getTokensDrilldownData(analyticsData) {
	let tokenData = analyticsData[0].data;

	tokenData.sort(function(a, b){return b[1] - a[1]});

	const series = [];

	for (let i = 0; i < tokenData.length; i += 1) {
		let tokenSymbol = tokenData[i][0];
		let count = tokenData[i][1];
		if (count <= 5) {
			series.push([tokenSymbol, count]);
		}
	}

	return series
}

function getCutoffIndex(categoriesData) {
	// category = [name, count]
	// calculate total sum of all category counts
	const total = categoriesData.reduce((total, category) => total + category[1], 0);
	const cutoff = parseInt(total * 0.75, 10);
	let sum = 0;

	for (let i = 0; i < categoriesData.length; i += 1) {
		if (sum > cutoff) {
			return i;
		}
		let count = categoriesData[i][1]
		sum += count;
	}
}

class PieChart extends React.Component {
	constructor(props) {
    super(props);
    noDataToDisplay(Highcharts);
    if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
	    drilldown(Highcharts);
	}
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
		}],
		drilldown: {
			series: [{
				name: 'Count',
				id: 'Other',
				data: getDrilldownData(this.props.data)
			}]
		}
    });
    setTimeout(() => {
      this.chart.reflow();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      	this.chart.update({ 
      		series: [{
				name: 'Count',
				colorByPoint: true,
				data: getSeriesData(nextProps.data)
			}],
			drilldown: {
				series: [{
					name: 'Count',
					id: 'Other',
					data: getDrilldownData(nextProps.data)
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
