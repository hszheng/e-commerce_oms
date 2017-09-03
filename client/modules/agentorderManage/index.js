import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import Collections from '/lib';
import React from 'react';

import { message, Menu, Dropdown, Pagination, Modal, Table, Icon, Button, Popconfirm } from 'antd';

import Loading from '../core/Loading';
import Notification from '../core/Notification';
import { FormModal, FormModal2 } from '../core/FormModal';

message.config({
    top: '40%'
});

class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {};
    }
    componentWillUnmount() {
        const self = this;
        const { LocalState } = self.props.context();
        LocalState.set('orderLimiter', null);
    }
    render() {
        const self = this;
        const { Configuration } = self.props.context();
        const { orderList, count, isDataReady } = self.props;
        const columns = [
            { title: '订单号', dataIndex: 'no' },
            { 
                title: '创建时间',
                dataIndex: 'createdAt',
                render: (text, record) => (
                    <a onClick={self._viewHistory.bind(self, record._id)}>{moment(record.createdAt).format('MM-DD')}</a>
                ), 
                sorter: true,
            },
            { title: '收货人', dataIndex: 'consignee' },
            { title: '收货电话', dataIndex: 'phone', render: (text, item) => (
                <span>{text.substr(3)}</span>
            ) },
            { title: '收货地址', dataIndex: 'address' },
            { title: '状态', dataIndex: 'status', },
            { title: '代理价格', dataIndex: 'agentPrice', sorter: true },
            { title: '应付金额', dataIndex: 'needPay', sorter: true },
            { title: '实付金额', dataIndex: 'total', sorter: true },
            { title: '备注', dataIndex: 'remark', render: (text, item) => (
                <div style={{ width: '200px', whiteSpace: 'pre-wrap' }}>{text}</div>
            ) },
            { title: '转运公司', dataIndex: 'transferCompany'},
            { title: '转运单号', dataIndex: 'transferNo'},
            { title: '物流公司', dataIndex: 'expressCompany'},
            { title: '物流单号', dataIndex: 'trackingNo'},
            { title: '操作', fixed: 'right', render: (text, record) => (
                <span>
                    <FormModal2
                        btnName='修改价格'
                        data={record}
                        items={[
                            { type: 'text', key: 'nowPrice', label: '应付金额', placeholder: '请输入价格', required: true },
                        ]}
                        onSubmit={self._priceConfirm.bind(self)}
                    />
                </span>
            )},
        ];
        const pagination = {
            total: count,
            showTotal(total) { 
                return `共 ${total} 条`; 
            },
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                self.pageSizeChange(current, pageSize);
            },
            onChange(current) {
                self.pageChange(current);
            },
        };
        const rowSelection = {
            selectedRowKeys: self.state.selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                self.setState({
                    selectedRowKeys: _.intersection(selectedRowKeys, _.pluck(orderList, '_id')),
                });
            }
        };
        const expandedRowRender = (record) => (
            <Table className="product-item" rowKey={record => record.name} columns={[
                { title: '商品图片', width: 100, render: (text, item) => (
                    <img src={item.image + Configuration.OSS_IMG_100W_100H} />
                )},
                { title: '商品名称', width: 200, render: (text, item) => (
                    <span className="product-name">{item.name}</span>
                ) },
                { title: '报关中文名', width: 200, dataIndex: 'surname' },
                { title: '品牌', width: 100, dataIndex: 'brand' },
                { title: '代理价格', width: 100, dataIndex: 'agentPrice' },
                { title: '价格', width: 100, dataIndex: 'price' },
                { title: '数量', width: 100, dataIndex: 'amount' },
            ]} dataSource={record.products} pagination={false} />
        );

        return (
            <div id="orderManage">
                <Notification _toStatus={self._toStatus.bind(self)}/>
                <div className="orderEdit">
                    <div className="searchInfo">
                        <div className="orderNum">订单号：<input type="text" ref='no' className="number" /></div>
                        <div className="transportNum">转运单号：<input type="text" ref='transOrderNumber' className="number" /></div>
                        <div className="addressee">收件人：<input type="text" className="consignee" ref='receiver'/></div>
                        {
                            // <div className="subTime">提交时间：<input type="date" className="start" ref='startTime'/>至<input type="date" className="end" ref='endTime'/></div>
                            // <div className="phone">手机号码：<input type="text" className="cellphone" ref='phoneNumber'/></div>
                            // <div className="myProxy">我的代理：<input type="data" className="assignee" ref='myAgent'/></div>
                        }
                        <div className="grabble" onClick={self._searchBycondition.bind(self)}>搜索</div>
                    </div>
                    <div className="orderStatus">
                        <div className="entire active" onClick={self._viewStatus.bind(self)}>全部</div>
                        <div className="waitDef" onClick={self._viewStatus.bind(self)}>待确定</div>
                        <div className="waitStock" onClick={self._viewStatus.bind(self)}>待采购</div>
                        <div className="waitShip" onClick={self._viewStatus.bind(self)}>待发货</div>
                        <div className="alreaShip" onClick={self._viewStatus.bind(self)}>已发货</div>
                        <div className="waitCle" onClick={self._viewStatus.bind(self)}>待清关</div>
                        <div className="alreaClea" onClick={self._viewStatus.bind(self)}>已清关</div>
                        <div className="alreaRece" onClick={self._viewStatus.bind(self)}>已签收</div>
                        <div className="alreaCan" onClick={self._viewStatus.bind(self)}>已取消</div>
                    </div>
                    <Table className="table"
                        expandedRowRender={expandedRowRender}
                        rowKey={record => record._id}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={orderList}
                        pagination={pagination}
                        scroll={{ x: true }}
                        onChange={self.tableChange.bind(self)}
                    />
                    <Modal
                        className="logModal"
                        title="历史轨迹"
                        visible={this.state.isDisplayLog}
                        onCancel={() => { self.setState({ isDisplayLog: false }); }}
                        footer={false}
                    >
                        {
                            self.state.logData && self.state.logData.map((item, index) => (
                                <div className="minute" key={index}>
                                    <div className="time">{moment(item.createdAt).format('YYYY年MM月DD日HH时mm分')}</div>
                                    <div className="operate">您的运单状态更改为{item.status}</div>
                                </div>
                            ))
                        }
                    </Modal>
                    {
                        !isDataReady && (
                            <Loading />
                        )
                    }
                </div>
            </div>
        );
    }
    // 点击待确认
    _toStatus(status){
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const orderLimiter = LocalState.get('orderLimiter');
        $('#orderManage .orderEdit .orderStatus div').siblings().removeClass('active');
        if (status === '全部') {
            orderLimiter.selector = {
                seller: Meteor.userId(),
                isRemoved: {
                    $ne: true,
                },
                status: {
                    $ne: '已取消',
                },
            };
            $('.orderStatus .entire').addClass('active');
        } else {
            if (status === '待采购') {
                $('.orderStatus .waitStock').addClass('active');
            }
            if (status === '待确定') {
                $('.orderStatus .waitDef').addClass('active');
            }
            if (status === '待发货') {
                $('.orderStatus .waitShip').addClass('active');   
            }
            orderLimiter.selector.status = status;
        }
        LocalState.set('orderLimiter', orderLimiter);
    }
    // 排序
    tableChange(pagination, filters, sorter) {
        const self = this;
        const { LocalState } = self.props.context();
        const orderLimiter = LocalState.get('orderLimiter');
        if (sorter.columnKey) {
            orderLimiter.options.sort = {
                [sorter.columnKey]: sorter.order === 'descend' ? -1 : 1,
            };
            LocalState.set('orderLimiter', orderLimiter);
        }
    }
    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const orderLimiter = LocalState.get('orderLimiter');
        orderLimiter.options.skip = (page - 1) * orderLimiter.options.limit;
        LocalState.set('orderLimiter', orderLimiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const orderLimiter = LocalState.get('orderLimiter');
        orderLimiter.options.limit = size;
        orderLimiter.options.skip = (page - 1) * orderLimiter.options.limit;
        LocalState.set('orderLimiter', orderLimiter);
    }
    // 录入价格
    _priceConfirm({ nowPrice }, order) {
        const self = this;
        const { context, orderList } = self.props;
        const { LocalState } = context();
        const obj = {};
        obj.nowId = order._id;
        if (order.total !== 0) {
            message.warning('用户已经支付完后不能修改价格！');
            return;
        }
        obj.nowPrice = parseFloat(nowPrice);
        if (!obj.nowPrice) {
            message.warning('请输入正确的价格');
            return;
        }
        Meteor.call('Order.methods.updatePrice', obj, (err) => {
            if (!err) {
                message.success('修改成功！');
            } else {
                message.error('修改失败!');
            }
        });
    }
    // 通过条件搜索订单
    _searchBycondition() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const orderLimiter = LocalState.get('orderLimiter');
        if (self.refs.no.value) {
            orderLimiter.selector.no = self.refs.no.value;
        }
        if (self.refs.transOrderNumber.value) {
            orderLimiter.selector.transferNo = self.refs.transOrderNumber.value;
        }
        if (self.refs.receiver.value) {
            orderLimiter.selector.consignee = self.refs.receiver.value;
        }

        LocalState.set('orderLimiter', orderLimiter);
    }
    // 通过状态过滤并显示
    _viewStatus(e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const orderLimiter = LocalState.get('orderLimiter');
        if (e.currentTarget.textContent === '全部') {
            orderLimiter.selector = {
                seller: Meteor.userId(),
                isRemoved: {
                    $ne: true,
                },
            };
        } else {
            orderLimiter.selector.status = e.currentTarget.textContent;
        }
        $('#orderManage .orderEdit .orderStatus div').siblings().removeClass('active');
        $(e.currentTarget).addClass('active');
        // console.log(orderLimiter);
        LocalState.set('orderLimiter', orderLimiter);
    }

    // 查看历史记录
    _viewHistory(orderId, e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const parentDiv = $(e.currentTarget).parent().parent()
                            .find('.calendar');
        $(e.currentTarget).parent().siblings('.record')
        .css('display', 'block');
        Meteor.call('Logistics.methods.getNowOrder', orderId, (err, result) => {
            if (!err) {
                self.setState({
                    logData: result,
                    isDisplayLog: true,
                });
            }
        });
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { Meteor, LocalState, Collections } = context();
    if (!Meteor.user()) return;

    if (!LocalState.get('orderLimiter')) {
        LocalState.set('orderLimiter', {
            selector: {
                seller: Meteor.user().saleAgent[0],
                saleAgentId: Meteor.user().unionid,
                isRemoved: { $ne: true }
            },
            options: {
                skip: 0,
                limit: 10,
                sort: { createdAt: -1 },
            },
        });
    }
    const orderLimiter = LocalState.get('orderLimiter');
    // console.log(orderLimiter);
    Meteor.subscribe('Order.getCount', orderLimiter.selector);
    const isDataReady = Meteor.subscribe('Order.getData', orderLimiter).ready();
    const count = Counts.get('orderCount');
    const orderList = Collections.Order.find({},{sort: orderLimiter.options.sort}).fetch();
    // // console.log(orderList);
    onData(null, { orderList, count, isDataReady });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
