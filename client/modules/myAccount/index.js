import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Link } from 'react-router';
import Loading from '../core/Loading';

import Modal from 'react-modal';

import PreSettleOrderFee from '../core/PreSettleOrderFee';
import SevenDayOrderFee from './SevenDayOrderFee';
import { FormModal } from '../core/FormModal';
import { message, Popconfirm, Row, Col, Menu, Table } from 'antd';

class Page extends React.Component {
    constructor(props) {
        super(props);

        const self = this;
        self.state = {
            nowUser: props.nowUser,
        };
    }

    render() {
        const self = this;
        const { nowList, nowUser } = self.props;
        const { Configuration } = self.props.context();
        const columns = [
            { title: '账户名称', dataIndex: 'category' },
            { title: '持有人', dataIndex: 'username' },
            { title: '账号', dataIndex: 'account' },
            { title: '操作', render: (text, record) => (
                <Popconfirm title="确定要删除该账户？" onConfirm={self.deleteCurrentAccount.bind(self, record)}>
                    <a href="#">删除</a>
                </Popconfirm>
            )},
        ];
        nowList.forEach((data, index) => {
            data.key = data._id;
        });
        // // // console.log(nowList);
        return (
            <div className="myAccount">
                <Row gutter={16}>
                    <Col className="gutter-row" span={5}>
                        <Menu mode="vertical" selectedKeys={['arrow']}>
                            <Menu.Item key="arrow"><Link to="/myAccount">我的账户</Link></Menu.Item>
                            <Menu.Item key="withdraw"><Link to="/withdrawTransaction">交易记录</Link></Menu.Item>
                        </Menu>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <div className="tranInfo">
                            <h1 className="title">交易金额</h1>
                            <article className="turnover">
                                <article className="total">待结算金额：<PreSettleOrderFee /></article>
                                <article className="recent">近七天交易额：<SevenDayOrderFee /></article>
                                <article className="withdraw">可提现额：<span className="money balance">{nowUser.withdrawAmount ? nowUser.withdrawAmount.toFixed(2) : 0}</span></article>
                            </article>
                            <FormModal
                                className='revoke'
                                type='primary'
                                btnName='申请提现'
                                items={[
                                    { type: 'select', key: 'account', label: '选择账号', selectKey: '_id', selectValue: 'account', items: nowList || [], required: true },
                                    { type:'text', key: 'amount', label: '提现金额', placeholder: '请输入提现金额', required: true },
                                ]}
                                onBeforeSubmit={self.preSubmitFee.bind(self)}
                                onSubmit={self.withdrawSure.bind(self)}
                            />
                        </div>
                        <div className="account">
                            <FormModal
                                className='addAccount'
                                type='primary'
                                btnName='添加账户'
                                items={[
                                    { type: 'select', key: 'category', label: '账户名称', selectKey: 'name', selectValue: 'name', items: Configuration.BANKS, placeholder:'请选择账户', required: true },
                                    { type:'text', key: 'username', label: '持有人', placeholder: '请输入持有人', required: true },
                                    { type:'text', key: 'account', label: '账号', placeholder: '请输入账号', required: true },
                                ]}
                                onSubmit={self.insertAccount.bind(self)}
                            />
                            <h1 className="caption">我的账户</h1>
                            <Table className="table" columns={columns} dataSource={nowList} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    preSubmitFee({ account, amount }) {
        const self = this;
        const { nowUser } = self.props;
        amount = parseFloat(amount)
        if (!amount || amount <= 0) {
            message.warning('请输入正确的提现金额');
            return false;
        }
        if (amount > nowUser.withdrawAmount) {
            message.warning('可提现金额不足');
            return false;
        }
        return true;
    }
    // 提现
    withdrawSure({ account, amount }) {
        const self = this;
        const { nowList } = self.props;
        amount = parseFloat(amount);
        if (!amount) {
            message.warning('请输入正确的提现金额');
            return false;
        }
        const applyInfo = _.findWhere(nowList, {_id: account});
        Meteor.call('Withdraw.methods.insert', {
            amount,
            category: applyInfo.category,
            username: applyInfo.username,
            account: applyInfo.account,
        }, (err, result)=>{
            if(err){
                window.alert('申请失败！');
                return;
            } window.alert('提交成功');
        });
    }
    // 添加账户事件
    insertAccount({ category, username, account }) {
        const self = this;
        Meteor.call('Account.methods.insert', { category, username, account });
    }

    // 删除现有用户
    deleteCurrentAccount(list, e) {
        const self = this;
        const nowId = list._id;
        Meteor.call('Account.methods.update', nowId);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState, Collections } = context();
    const nowUser = Meteor.user() || {};
    Meteor.subscribe('Account.getData');
    const nowList = Collections.Account.find().fetch();
    onData(null, { nowUser, nowList });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);





