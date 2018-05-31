import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Alert, Spin, Card, Layout, Menu, Icon } from 'antd';

import QueryForm from './components/QueryForm';
import LineChart from './components/LineChart';

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
  onQuery: (schema, range) => dispatch({ type: 'API_CALL_REQUEST', schema, range })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
