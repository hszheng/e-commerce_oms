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
        const IDCardFront = self.state.cardArr && self.state.cardArr.IDCardFront;
        const IDCardBack = self.state.cardArr && self.state.cardArr.IDCardBack;
        // console.log(IDCardFront, IDCardBack);
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
            { title: '销售代理', dataIndex: 'saleAgent' },
            { title: '收货人', dataIndex: 'consignee', render:(consignee, record) => (
                <span className="downloadIDCard" onClick={self._downloadIDCard.bind(self, record)}>{consignee}<label className="tip">点击查看并下载身份证</label></span>
            )},
            { title: '收货电话', dataIndex: 'phone', render: (text, item) => (
                <span>{text.substr(3)}</span>
            ) },
            { title: '收货地址', dataIndex: 'address' },
            { title: '状态', dataIndex: 'status', },
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
                    <span className="ant-divider"></span>
                    <Dropdown overlay={(
                        <Menu>
                            <Menu.Item>
                                <FormModal2
                                    btnName='输入转运单号'
                                    data={record}
                                    items={[
                                        { type: 'text', key: 'transferCompany', label: '转运公司', placeholder: '请输入转运公司', required: true },
                                        { type: 'text', key: 'transferNo', label: '转运单号', placeholder: '请输入转运单号', required: true },
                                    ]}
                                    onSubmit={self._confirmShip.bind(self)}
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <FormModal2
                                    btnName='输入国内物流号'
                                    data={record}
                                    items={[
                                        { type: 'text', key: 'expressCompany', label: '物流公司', placeholder: '请输入物流公司', required: true },
                                        { type: 'number', key: 'trackingNo', label: '物流单号', placeholder: '请输入物流单号', required: true },
                                    ]}
                                    onSubmit={self._civilNo.bind(self)}
                                />
                            </Menu.Item>
                            <Menu.Item>
                                <FormModal2
                                    btnName='申请退款'
                                    data={record}
                                    items={[
                                        { type: 'number', key: 'refund', label: '退款金额', placeholder: '请输入退款金额', required: true },
                                        { type: 'text', key: 'refundRemark', label: '退款备注', placeholder: '请输入退款原因', required: true },
                                    ]}
                                    onSubmit={self._applyRefund.bind(self)}
                                />
                            </Menu.Item>                            
                        </Menu>
                        )}>
                        <a className="ant-dropdown-link">
                            更多<Icon type="down" />
                        </a>
                    </Dropdown>
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
                { title: '价格', width: 100, dataIndex: 'price' },
                { title: '数量', width: 100, dataIndex: 'amount' },
                // { title: '操作',width: 200, render: (text, item) => (
                //     <span>
                //         <Popconfirm title="若删除该商品，系统将原路退回该商品的款项，请确认是否删除该商品？" onConfirm={self.deleteProduct.bind(self, record._id, item._id)}>
                //             <a href="#">删除商品</a>
                //         </Popconfirm>
                //     </span>
                // )},
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
                    <div className="row">
                        <Dropdown.Button overlay={(
                                <Menu onClick={self._updateStatus.bind(self)}>
                                    <Menu.Item key="待确定">待确定</Menu.Item>
                                    <Menu.Item key="待采购">待采购</Menu.Item>
                                    <Menu.Item key="待发货">待发货</Menu.Item>
                                    <Menu.Item key="已发货">已发货</Menu.Item>
                                    <Menu.Item key="待清关">待清关</Menu.Item>
                                    <Menu.Item key="已清关">已清关</Menu.Item>
                                    <Menu.Item key="已签收">已签收</Menu.Item>
                                    <Menu.Item key="已取消">已取消</Menu.Item>
                                </Menu>
                            )} type="ghost">
                            更改状态
                        </Dropdown.Button>
                        <Button type="ghost" onClick={self.exportExcel.bind(self)}>导出模板</Button>
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
                        visible={self.state.isDisplayLog}
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
                    <Modal
                        className="idModal logModal"
                        title="收货人身份证"
                        visible = {self.state.isDisplayIDCard}
                        onCancel = {() => { self.setState({ isDisplayIDCard: false }) }}
                        footer = {false}
                    >
                        {
                            self.state.cardArr && (<div style={{ overflow: 'hidden', textAlign: 'center' }}>
                                <a href={IDCardFront ? IDCardFront + Configuration.OSS_IMG_IDCARD : ''} download="">
                                    <img src={IDCardFront ? IDCardFront + Configuration.OSS_IMG_ORIGINALNULL : ''} style={{ width: '200px' }}/>
                                </a>
                                <a href={IDCardBack ? IDCardBack + Configuration.OSS_IMG_IDCARD : ''} download="abc">
                                    <img src={IDCardBack ? IDCardBack + Configuration.OSS_IMG_ORIGINALNULL : ''} style={{ width: '200px' }}/>
                                </a>
                                <label type="ghost" style={{ float: 'right', color: 'grey' }}>点击图片下载身份证</label>
                            </div>)
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
    // 下载身份证
    _downloadIDCard(order, e) {
        const self = this;
        const cardArr = {
            IDCardFront: order.IDCardFront, 
            IDCardBack: order.IDCardBack,
        };
        self.setState({ isDisplayIDCard: true, cardArr });
        console.log(cardArr);
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
    // 导出模板
    exportExcel() {
        const self = this;
        const { LocalState } = self.props.context();
        let status = LocalState.get('orderLimiter').selector.status;
        if (!status) {
            status = '全部';
        }
        window.open(`/api/exportXLS?status=${status}&userId=${Meteor.userId()}`);
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

        if (order.agentPrice) {
            // 修改代理价格
            Meteor.call('Order.methods.updateAgentPrice', obj, (err) => {
                if (!err) {
                    message.success('修改成功！');
                } else {
                    message.error('修改失败!');
                }
            });
        } else {
            Meteor.call('Order.methods.updatePrice', obj, (err) => {
                if (!err) {
                    message.success('修改成功！');
                } else {
                    message.error('修改失败!');
                }
            });
        }
    }
    // 申请退款
    _applyRefund({ refund, refundRemark }, order) {
        const self = this;
        const obj = {};
        obj.nowId = order._id;
        obj.refund = refund;
        obj.refundRemark = refundRemark;

        Meteor.call('Order.methods.applyRefund', obj, (err) => {
            if(!err) {
                message.success('提交成功，工作人员将在两个工作日内原路退回款项给消费者');
            } else {
                message.error('修改失败!');     
            }
        });
    }
    // 录入国内物流号
    _civilNo({ trackingNo, expressCompany }, order) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const obj = {};
        obj.trackingNo = trackingNo;
        obj.expressCompany = expressCompany;
        obj.nowId = order._id;
        Meteor.call('Order.methods.updateCivilNo', obj, (err) => {
            if (!err) {
                message.success('修改成功!');
            } else {
                message.error('修改失败!');
            }
        });
    }
    // 录入转运单号
    _confirmShip({ transferNo, transferCompany }, order) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const obj = {};
        obj.transferNo = transferNo;
        obj.transferCompany = transferCompany;
        obj.nowId = order._id;
        Meteor.call('Order.methods.updateShipNumber', obj, (err) => {
            if (!err) {
                message.success('修改成功！');
            } else {
                message.error('修改失败！');
            }
        });
    }
    // 更改运单状态
    _updateStatus(e) {
        const self = this;
        const { context, orderList } = self.props;
        const { LocalState, Configuration } = context();
        const obj = {};
        if (self.state.selectedRowKeys.length !== 1) {
            message.error('请选择一个订单操作');
            return;
        }
        const currentOrder = _.findWhere(orderList, { _id: self.state.selectedRowKeys[0] });
        if (currentOrder.status === '已签收') {
            message.error('已签收订单无法修改状态');
            return;
        }
        if (currentOrder.status === '已取消') {
            message.error('已取消订单无法修改状态');
            return;
        }
        obj.nowId = currentOrder._id;
        obj.status = e.key;
        const content = `您好，尊敬的${currentOrder.consignee}，您的订单 ${currentOrder.no}${obj.status}。您可以通过以下链接 ${Configuration.WECHAT_HOST}/order/${currentOrder._id} 查询详情。`;
        const areaCode = `${parseInt(currentOrder.phone.substr(0, 3), 10)}`;
        const msg = { areaCode, mobile: currentOrder.phone.substr(3), msg: content };
        self.setState({ selectedRowKeys: [] });
        if (obj.status === '已取消') {
            if (!window.confirm('若取消该订单，系统将原路退回该商品款项，请确认是否取消该订单？')) {
                return;
            }
            Meteor.call('Order.methods.cancelOrder', obj, (err) => {
                Meteor.call('sendSMS', msg);
            });
        } else if (obj.status === '已签收') {
            if (!window.confirm(`确认修改为${obj.status}？`)) {
                return;
            }
            Meteor.call('Order.methods.signOrder', obj);
        } else {
            if (!window.confirm(`确认修改为${obj.status}？`)) {
                return;
            }
            Meteor.call('Order.methods.updateStatus', obj, (res, err) => {
                if (!err) {
                    console.log(res);
                    // if (obj.status === '已发货' || obj.status === '待采购' || obj.status === '已取消') {
                    //     Meteor.call('sendSMS', msg, (err1, result1) => {
                    //         if (err1) {
                    //             alert('短信发送失败，错误代码为：', err1);
                    //             return;
                    //         } 
                    //     });
                    // }
                } else {
                    console.log(err);
                }
            });
        }
    }
    deleteProduct(orderId, productId) {
        const self = this;
        Meteor.call('Order.methods.deleteProduct', { orderId, productId });
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

    if (!LocalState.get('orderLimiter')) {
        LocalState.set('orderLimiter', {
            selector: {
                seller: Meteor.userId(),
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
    // 订阅订单数据
    Meteor.subscribe('Order.getCount', orderLimiter.selector);
    const isDataReady = Meteor.subscribe('Order.getData', orderLimiter).ready();
    const count = Counts.get('orderCount');
    const orderList = Collections.Order.find({},{sort: orderLimiter.options.sort}).fetch();
    orderList.forEach((order) => {
        const user = Meteor.users.findOne({ unionid: order.saleAgentId }) || {};
        order.saleAgent = user.nickname;
        if (order.saleAgentId && order.agentPrice) {
            order.needPay = order.agentPrice;
            if (order.total) {
                order.total = order.agentPrice;
            }
            order.products.forEach((product) => {
                product.price = product.agentPrice;
            });
        }
    });
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
