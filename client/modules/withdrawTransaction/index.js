import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Link } from 'react-router';
import Loading from '../core/Loading';

import { Row, Col, Table, Menu } from 'antd';
class Page extends React.Component {
    render() {
        const self = this;
        const { withdrawListData } = self.props;
        const columns = [
            { title: '创建时间', dataIndex: 'createdAt', render(createdAt) { return moment(createdAt).format('YYYY-MM-DD'); } },
            { title: '关联订单', dataIndex: 'id' },
            { title: '变动金额', dataIndex: 'changeBalance', render(fee) { return fee ? `${fee > 0 ? '+' : ''}${fee.toFixed(2)}` : 0; } },
            { title: '手续费', dataIndex: 'commissionFee', render(fee) { return fee ? (-fee).toFixed(2) : 0; } },
            { title: '当前余额', dataIndex: 'balance', render(fee) { return fee ? fee.toFixed(2) : 0; } },
            { title: '状态', dataIndex: 'status'}
        ];
        return (
            <div className="myAccount withdraw">
                <Row gutter={16}>
                    <Col className="gutter-row" span={5}>
                        <Menu mode="vertical" selectedKeys={['withdraw']}>
                            <Menu.Item key="arrow"><Link to="/myAccount">我的账户</Link></Menu.Item>
                            <Menu.Item key="withdraw"><Link to="/withdrawTransaction">交易记录</Link></Menu.Item>
                        </Menu>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <Table className="table" rowKey={record => record._id} columns={columns} dataSource={withdrawListData} />
                    </Col>
                </Row>
            </div>
        );
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState, Collections } = context();
    Meteor.subscribe('Withdraw.getData');
    const withdrawListData = Collections.Withdraw.find({}, {sort: { createdAt: -1 }}).fetch();
    onData(null, { withdrawListData});
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
