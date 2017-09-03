import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '../core/Loading';

import { Row, Col, Table, Popconfirm, Button, Modal, Tabs } from 'antd';

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
        LocalState.set('agentLimiter', null);
    }
    render() {
        const self = this;
        const { agentList, agentOrderList } = self.props;
        const columns = [
            { title: '#', dataIndex: 'key' },
            { title: '代理', dataIndex: 'nickname' },
            { title: '分享次数', dataIndex: 'shareCount' },
            { title: '完成订单', dataIndex: 'orderAmount' },
            { title: '订单总金额', dataIndex: 'orderSum' },
            { title: '提成比例', dataIndex: 'awardProp', render:(text, record) => (<span>3%</span>) },
            { title: '提成金额', dataIndex: 'commission', render:(text, record) => (<span>{record.orderSum * 0.03}</span>) },
        ];
        const agentColumns = [
            { title: '#', dataIndex: 'key' },
            { title: '代理', dataIndex: 'nickname' },
            { title: '完成订单', dataIndex: 'orderAmount' },
            { title: '订单总金额', dataIndex: 'orderSum' },
        ];
        const expendColumns = [
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
                { title: '收货电话', dataIndex: 'phone', render: (text, record) => (
                    <span>{text.substr(3)}</span>
                ) },
                { title: '收货地址', dataIndex: 'address' },
                { title: '状态', dataIndex: 'status', },
                { title: '应付金额', dataIndex: 'needPay', sorter: true },
                { title: '实付金额', dataIndex: 'total', sorter: true },
            ];
        const expandedRowRender = (record) => (
            <Table 
                className="product-item" 
                rowKey={record => record._id}
                columns= {expendColumns}
                dataSource={record.order} 
                pagination={false} />
        );        
        const pagination = {
            total: agentList.length,
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
        agentList.forEach((data, index) => {
            data.key = index + 1;
        });
        return (
            <div className="agent-container">
                <Tabs defaultActiveKey={self.props.myAgentType} onChange={self.agentTypeChange.bind(self)}>
                    <Tabs.TabPane tab="我的销售代理" key="1">
                        <Table 
                            className="table" 
                            expandedRowRender={expandedRowRender}
                            columns={agentColumns} 
                            dataSource={agentOrderList}
                            pagination={pagination} 
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="我的推广代理" key="2">
                        <Table 
                            className="table" 
                            expandedRowRender={expandedRowRender}
                            columns={columns} 
                            dataSource={agentOrderList}
                            pagination={pagination} 
                        />
                    </Tabs.TabPane>
                </Tabs>
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
            </div>
        );
    }

    // 切换标签页
    agentTypeChange(key) {
        const self = this;
        const { LocalState } = self.props.context();
        LocalState.set('myAgentType', parseFloat(key));
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
    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const agentLimiter = LocalState.get('agentLimiter');
        agentLimiter.options.skip = (page - 1) * agentLimiter.options.limit;
        LocalState.set('agentLimiter', agentLimiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const agentLimiter = LocalState.get('agentLimiter');
        agentLimiter.options.limit = size;
        agentLimiter.options.skip = (page - 1) * agentLimiter.options.limit;
        LocalState.set('agentLimiter', agentLimiter);
    }
    _deleteAgenUsers(agent) {
        const data = { _id: agent._id, obj: { inviteId: '' } };
        Meteor.call('User.methods.updateUserInfo', data);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { Meteor, LocalState, Collections } = context();
    const currentUser = Meteor.user() || {};
    if (!LocalState.get('agentLimiter')) {
        LocalState.set('agentLimiter', {
            selector: {},
            options: {
                skip: 0,
                limit: 10,
            },
        });
    }
    const agentLimiter = LocalState.get('agentLimiter');

    const myAgentType = LocalState.get('myAgentType') || 1;
    if (myAgentType === 1) {
        agentLimiter.selector = {
            saleAgent: currentUser._id,
        };
    } else {
        agentLimiter.selector = {
            agentBuyer: currentUser.unionid,
        };
    }
    
    Meteor.subscribe('User.getMyAgentCount', agentLimiter.selector);
    Meteor.subscribe('User.getAgentOrderList', agentLimiter);

    const count = Counts.get('agentCount');
    const agentList = Meteor.users.find(agentLimiter.selector).fetch();
    const agentOrderList = [];
    _.each(agentList, (agent, index) => {
        let orderList = Collections.Order.find({agentId: agent.unionid}).fetch();
        if (myAgentType === 1) {
            orderList = Collections.Order.find({saleAgentId: agent.unionid}).fetch()
        }
        let orderSum = 0;
        _.each(orderList, (order) => {
            orderSum = orderSum + order.total;
        });
        agent.shareCount = agent.shareCount[currentUser.unionid] ? agent.shareCount[currentUser.unionid] : 0;
        agentOrderList.push({
            orderSum,
            _id: agent._id,
            key: index + 1,
            nickname: agent.nickname,
            shareCount: agent.shareCount,
            orderAmount: orderList.length,
            order: orderList,
            createdAt: moment(agent.createdAt).format('YYYY-MM-DD'),
        });
    })
    // // // console.log(agentList);
    onData(null, { agentList, agentOrderList, count, myAgentType});
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
