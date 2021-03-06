import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Alert, Spin, Card, Layout, Menu, Icon } from 'antd';

import QueryForm from './components/QueryForm';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';

const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { period: '' };
    this.handleChangePeriod = this.handleChangePeriod.bind(this);
  }

  handleChangePeriod(value) {
    this.setState({ period: value });
  }

  render() {
    console.log(this.props);
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Menu defaultSelectedKeys={['1']} mode="horizontal">
          <Menu.Item key="1">
            <Icon type="pie-chart" />
            <span>Dashboard</span>
          </Menu.Item>
        </Menu>
        <Content>
          <Row>
            <Col span={24}>
              <Card bordered={false}>
                <QueryForm
                  handleChangePeriod={this.handleChangePeriod}
                  {...this.props}
                />
              </Card>
            </Col>
          </Row>
          <Spin spinning={this.props.fetching}>
            {this.props.data &&
              <Row>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="bountyStatesChart"
                    title="Bounty States"
                    period={this.state.period || 'day'}
                    data={[{
                      name: 'Draft',
                      data: this.props.data.bountyDraft
                    }, {
                      name: 'Active',
                      data: this.props.data.bountyActive
                    }, {
                      name: 'Completed',
                      data: this.props.data.bountyCompleted
                    }, {
                      name: 'Expired',
                      data: this.props.data.bountyExpired
                    }, {
                      name: 'Dead',
                      data: this.props.data.bountyDead
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="rateChart"
                    title="Fulfill Rate"
                    period={this.state.period || 'week'}
                    data={[{
                      name: 'Fulfillment Acceptance Rate',
                      data: this.props.data.fulfillmentAcceptanceRate
                    }, {
                      name: 'Bounty Fulfilled Rate',
                      data: this.props.data.bountyFulfilledRate
                    }, {
                      name: 'Avg Fulfiller Acceptance Rate',
                      data: this.props.data.avgFulfillerAcceptanceRate
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="fulfillments"
                    title="Fulfillments"
                    period={this.state.period || 'day'}
                    subtitle="These values are not cumulative (independent day to day)"
                    data={[{
                      name: 'Fulfillments Submitted',
                      data: this.props.data.fulfillmentsSubmitted
                    }, {
                      name: 'Fulfillments Accepted',
                      data: this.props.data.fulfillmentsAccepted
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="fulfillmentsCum"
                    title="Fulfillments Cumulative"
                    period={this.state.period || 'day'}
                    subtitle="These values are cumulative over time"
                    data={[{
                      name: 'Fulfillments Submitted',
                      data: this.props.data.fulfillmentsSubmittedCum
                    }, {
                      name: 'Fulfillments Accepted',
                      data: this.props.data.fulfillmentsAcceptedCum
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="bountiesIssued"
                    title="Bounties Issued"
                    period={this.state.period || 'day'}
                    subtitle="These values are not cumulative (independent day to day)"
                    data={[{
                      name: 'Bounties Issued',
                      data: this.props.data.bountiesIssued
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="bountiesIssuedCum"
                    title="Bounties Issued Cumulative"
                    period={this.state.period || 'day'}
                    subtitle="These values are cumulative over time"
                    data={[{
                      name: 'Bounties Issued',
                      data: this.props.data.bountiesIssuedCum
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="uniqueUsers"
                    title="Unique Issuers/Fulfillers"
                    period={this.state.period || 'day'}
                    subtitle="These values are not cumulative (independent day to day)"
                    data={[{
                      name: 'Fulfillers',
                      data: this.props.data.uniqueFulfillers
                    }, {
                      name: 'Issuers',
                      data: this.props.data.uniqueIssuers
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="uniqueUsersCum"
                    title="Unique Issuers/Fulfillers Cumulative"
                    period={this.state.period || 'day'}
                    subtitle="These values are cumulative over time"
                    data={[{
                      name: 'Fulfillers',
                      data: this.props.data.uniqueFulfillersCum
                    }, {
                      name: 'Issuers',
                      data: this.props.data.uniqueIssuersCum
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <LineChart
                    type="line"
                    id="totalFulfillmentAmount"
                    title="Bounty Values"
                    period={this.state.period || 'day'}
                    subtitle="These values are cumulative over time"
                    data={[{
                      name: 'Bounty Value in USD',
                      data: this.props.data.totalFulfillmentAmount
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <PieChart
                    type="pie"
                    id="categories"
                    title="Bounty Categories"
                    subtitle="Breakdown of categories of bounties"
                    data={[{
                      id: 'categories',
                      name: 'Count',
                      colorByPoint: true,
                      data: this.props.data.categories
                    }]}
                  />
                </Col>
                <Col md={12}>
                  <PieChart
                    type="pie"
                    id="tokens"
                    title="Token Chart"
                    subtitle="Breakdown of tokens accepted on our platform"
                    data={[{
                      id: 'tokens',
                      name: 'Count',
                      colorByPoint: true,
                      data: this.props.data.tokens
                    }]}
                  />
                </Col>
              </Row>
            }
            {this.props.error &&
              <Alert
                message="Something went wrong"
                description="Fetching data error"
                type="error"
              />}
          </Spin>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.fetching,
  data: state.data,
  error: state.error
});

const mapDispatchToProps = dispatch => ({
  onQuery: (platform, range) => dispatch({ type: 'API_CALL_REQUEST', platform, range })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
