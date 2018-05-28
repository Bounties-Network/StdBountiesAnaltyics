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
      schema: config.schemaList[0].value
    };
    this.handleChangeRange = this.handleChangeRange.bind(this);
    this.handleChangeSchema = this.handleChangeSchema.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.onQuery(this.state.schema, this.state.range);
      }
    });
  }
  handleChangeRange(value) {
    this.setState({ range: value });
  }
  handleChangeSchema(value) {
    this.setState({ schema: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.onQuery(this.state.schema, this.state.range);
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
    const schemaError = isFieldTouched('schema') && getFieldError('schema');
    const schemaOption = (
      <Select
        style={{ width: 240 }}
        onChange={this.handleChangeSchema}
      >
        {config.schemaList.map(schema => (
          <Option key={schema.value} value={schema.value}>{schema.name}</Option>
          ))}
      </Select>
    );
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={rangeError ? 'error' : ''}
          help={rangeError || ''}
        >
          {getFieldDecorator('range', {
            rules: [{ required: true, message: 'Please input date range!' }],
            initialValue: this.state.range
          })(<RangePicker
            onChange={this.handleChangeRange}
            format={dateFormat}
            disabledDate={currentDate => moment().utc().isBefore(currentDate)}
          />)}
        </FormItem>

        <FormItem
          validateStatus={schemaError ? 'error' : ''}
          help={schemaError || ''}
        >
          {getFieldDecorator('schema', {
            rules: [{ required: true, message: 'Please select schema!' }],
            initialValue: this.state.schema
          })(schemaOption)}
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
