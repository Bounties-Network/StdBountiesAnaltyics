import React, { Component } from 'react';
import { Form, Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import config from '../config';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class QueryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [
        moment(config.earliestDate, dateFormat),
        moment().utc()
      ],
      platform: config.platformList[0].value
    };
    this.handleChangeRange = this.handleChangeRange.bind(this);
    this.handleChangePlatform = this.handleChangePlatform.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.onQuery(this.state.platform, this.state.range);
      }
    });
  }
  handleChangeRange(value) {
    this.setState({ range: value });
  }
  handleChangePlatform(value) {
    this.setState({ platform: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.onQuery(this.state.platform, this.state.range);
      }
    });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const rangeError = isFieldTouched('range') && getFieldError('range');
    const platformError = isFieldTouched('platform') && getFieldError('platform');
    const platformOption = (
      <Select
        style={{ width: 150 }}
        onChange={this.handleChangePlatform}
      >
        {config.platformList.map(platform => (
          <Option key={platform.value} value={platform.value}>{platform.name}</Option>
        ))}
      </Select>
    );
    const periodOption = (
      <Select
        style={{ width: 90 }}
        onChange={this.props.handleChangePeriod}
      >
        <Option key="empty" value="">Default</Option>
        <Option key="day" value="day">Daily</Option>
        <Option key="week" value="week">Weekly</Option>
      </Select>
    );
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={rangeError ? 'error' : ''}
          help={rangeError || ''}
        >
          <div>
            {getFieldDecorator('range', {
              rules: [{ required: true, message: 'Please input date range!' }],
              initialValue: this.state.range
            })(<RangePicker
              onChange={this.handleChangeRange}
              format={dateFormat}
              disabledDate={currentDate => moment().utc().isBefore(currentDate)}
            />)}
            <h5>all times are based on UTC.</h5>
          </div>
        </FormItem>

        <FormItem
          validateStatus={platformError ? 'error' : ''}
          help={platformError || ''}
        >
          {getFieldDecorator('platform', {
            rules: [{ required: true, message: 'Please select bounty platform!' }],
            initialValue: this.state.platform
          })(platformOption)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('period', {
            rules: [{ required: false }],
            initialValue: ''
          })(periodOption)}
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Query
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const Wrapper = Form.create()(QueryForm);
export default Wrapper;
