import React from 'react';
import { Modal, message, Form, Input, Button, Select } from 'antd';

class FormModal extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {};
        self.handleSubmit = self.handleSubmit.bind(self);
        self.showModal = self.showModal.bind(self);
        self.hideModal = self.hideModal.bind(self);
    }

    handleSubmit() {
        const self = this;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            const value = self.props.form.getFieldsValue();
            if (self.props.onBeforeSubmit && !self.props.onBeforeSubmit(value)) {
                return;
            }
            self.hideModal();
            self.props.onSubmit && self.props.onSubmit(value);
        });
    }

    showModal() {
        const self = this;       
        self.setState({ visible: true });
        self.props.form.resetFields();
    }

    hideModal() {
        const self = this;
        self.setState({ visible: false });
    }
    render() {
        const self = this;
        const { getFieldProps } = self.props.form;
        return (
            <div className={self.props.className}>
                <Button type={self.props.type || 'primary'} onClick={self.showModal}>{self.props.btnName}</Button>
                <Modal title={self.props.title || self.props.btnName} visible={self.state.visible} onOk={self.handleSubmit} onCancel={self.hideModal}>
                    <Form horizontal form={self.props.form}>
                        {
                            self.props.items.map((item, index) => (
                                <Form.Item key={index} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label={item.label}>
                                    {
                                        item.type === 'text' && (
                                            <Input type="text" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '不可以为空' },
                                                ],
                                            })} placeholder={item.placeholder} />
                                        )
                                    }
                                    {
                                        item.type === 'select' && (
                                            <Select size="large" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '请选择一项' },
                                                ],
                                            })}>
                                                {
                                                    item.items.map((obj, key) => (
                                                        <Select.Option key={key} value={obj[item.selectKey]}>{obj[item.selectValue]}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            ))
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}

FormModal = Form.create()(FormModal);

class FormModal2 extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {};
        self.handleSubmit = self.handleSubmit.bind(self);
        self.showModal = self.showModal.bind(self);
        self.hideModal = self.hideModal.bind(self);
    }

    handleSubmit() {
        const self = this;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            const value = self.props.form.getFieldsValue();
            self.hideModal();
            // console.log(self.props.data);
            self.props.onSubmit && self.props.onSubmit(value, self.props.data);
        });
    }

    showModal() {
        const self = this;
        const order = self.props.data;
        self.setState({ visible: true });
        self.props.form.resetFields();        
        if(!order.total) {
            return self.setState({ isNotPaid: true });
        } else if (order.status === '已签收' || '已取消') {
            return self.setState({ isFinished: true });
        }
    }

    hideModal() {
        const self = this;
        self.setState({ visible: false });
    }
    render() {
        const self = this;
        const { getFieldProps } = self.props.form;
        if(self.state.isNotPaid) {
            return(
                <span className={self.props.className}>
                    <a onClick={self.showModal}>{self.props.btnName}</a>
                    <Modal title={self.props.title || self.props.btnName} visible={self.state.visible} onOk={()=>{self.setState({visible:false})}} onCancel={self.hideModal}>
                        <div style={{ textAlign: 12, fontSize: 12 }}>该订单客户尚未付款，无法执行该操作！</div>
                    </Modal>
                </span>
                )
        }
        if(self.state.isFinished) {
            return(
                <span className={self.props.className}>
                    <a onClick={self.showModal}>{self.props.btnName}</a>
                    <Modal title={self.props.title || self.props.btnName} visible={self.state.visible} onOk={()=>{self.setState({visible:false})}} onCancel={self.hideModal}>
                        <div style={{ textAlign: 12, fontSize: 12 }}>已签收或已取消的订单无法执行该操作！</div>
                    </Modal>
                </span>
                )
        }
        return (
            <span className={self.props.className}>
                <a onClick={self.showModal}>{self.props.btnName}</a>
                <Modal title={self.props.title || self.props.btnName} visible={self.state.visible} onOk={self.handleSubmit} onCancel={self.hideModal}>
                    <Form horizontal form={self.props.form}>
                        {
                            self.props.items.map((item, index) => (
                                <Form.Item key={index} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label={item.label}>
                                    {
                                        item.type === 'text' && (
                                            <Input type="text" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '不可以为空' },
                                                ],
                                            })} placeholder={item.placeholder} />
                                        )
                                    }
                                    {
                                        item.type === 'number' && (
                                            <Input type="number" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '不可以为空' },
                                                ],
                                            })} placeholder={item.placeholder} />
                                        )
                                    }
                                    {
                                        item.type === 'select' && (
                                            <Select size="large" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '请选择一项' },
                                                ],
                                            })}>
                                                {
                                                    item.items.map((obj, key) => (
                                                        <Select.Option key={key} value={obj[item.selectKey]}>{obj[item.selectValue]}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            ))
                        }
                    </Form>
                </Modal>
            </span>
        );
    }
}

FormModal2 = Form.create()(FormModal2);

class FormModal3 extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {};
        self.handleSubmit = self.handleSubmit.bind(self);
        self.showModal = self.showModal.bind(self);
        self.hideModal = self.hideModal.bind(self);
    }

    handleSubmit() {
        const self = this;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            const value = self.props.form.getFieldsValue();
            self.hideModal();
            // console.log(self.props.data);
            self.props.onSubmit && self.props.onSubmit(value, self.props.data);
        });
    }

    showModal() {
        const self = this;       
        self.setState({ visible: true });
        self.props.form.resetFields();
    }

    hideModal() {
        const self = this;
        self.setState({ visible: false });
    }
    render() {
        const self = this;
        const { getFieldProps } = self.props.form;
        return (
            <span className={self.props.className}>
                <a onClick={self.showModal}>{self.props.btnName}</a>
                <Modal title={self.props.title || self.props.btnName} visible={self.state.visible} onOk={self.handleSubmit} onCancel={self.hideModal}>
                    <Form horizontal form={self.props.form}>
                        {
                            self.props.items.map((item, index) => (
                                <Form.Item key={index} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label={item.label}>
                                    {
                                        item.type === 'text' && (
                                            <Input type="text" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '不可以为空' },
                                                ],
                                            })} placeholder={item.placeholder} />
                                        )
                                    }
                                    {
                                        item.type === 'select' && (
                                            <Select size="large" {...getFieldProps(item.key, {
                                                rules: [
                                                    { required: item.required, message: item.errMsg || '请选择一项' },
                                                ],
                                            })}>
                                                {
                                                    item.items.map((obj, key) => (
                                                        <Select.Option key={key} value={obj[item.selectKey]}>{obj[item.selectValue]}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                            ))
                        }
                    </Form>
                </Modal>
            </span>
        );
    }
}

FormModal3 = Form.create()(FormModal3);
export {
    FormModal,
    FormModal2,
};