import { createApp } from 'mantra-core';
import { _ } from 'underscore';

// Redux
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import initContext from './configs/context';

// Modules
// 首页
import coreModule from './modules/core';
// 内容库
import ContentPage from './modules/contentWarehouse';
// 每日期刊
import IssuePage from './modules/dailyIssue';
// 我的账户
import AccountPage from './modules/myAccount';
// 我的代理
import AgentPage from './modules/myAgent';
// 在线商品
import ProductPage from './modules/onlineProduct';
// 订单管理
import OrderPage from './modules/orderManage';
// 收款交易
import ReceiptPage from './modules/receiptTransaction';
// 提现交易
import WithdrawPage from './modules/withdrawTransaction';
// 我的设置
import SettingPage from './modules/setting';
// 新建期刊
import NewIssuePage from './modules/newIssue';
// 发布成功期刊
import publishSuccessPage from './modules/publishSuccessIssue';
//修改商品
import editProductPage from './modules/editProduct';
// 买手协议
import ProtocolPage from './modules/protocol';
// 代理的订单管理界面
import agentorderManagePage from './modules/agentorderManage';

// 微信端上传商品
import wechatProductUploaderPage from './modules/wechatProductUploader';

// 代买管理
import agentBuyPage from './modules/agentBuy'

import Modal from 'react-modal';

import 'antd/dist/antd.less';

// Combine Reducers
const reducer = combineReducers({
    ...coreModule.reducer,
    routing: routerReducer,
});

// Init Context
const context = initContext({ reducer });

// Create App
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(ContentPage);
app.loadModule(IssuePage);
app.loadModule(AccountPage);
app.loadModule(AgentPage);
app.loadModule(ProductPage);
app.loadModule(OrderPage);
app.loadModule(ReceiptPage);
app.loadModule(WithdrawPage);
app.loadModule(SettingPage);
app.loadModule(NewIssuePage);
app.loadModule(publishSuccessPage);
app.loadModule(editProductPage);
app.loadModule(ProtocolPage);
app.loadModule(wechatProductUploaderPage);
app.loadModule(agentBuyPage);
app.loadModule(agentorderManagePage);
app.init();

Meteor.startup(() => {
    $(document).ready(() => {
        // 设置弹出框默认样式
        Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        Modal.defaultStyles.overlay.zIndex = 100;
        Modal.setAppElement('body');
    });

    window._ = _;
    const inviteId = context.Utility.parse('inviteId');
    if (inviteId) {
        window.localStorage.setItem('inviteId', inviteId);
    }
    // 更新邀请人ID
    context.Tracker.autorun((c) => {
        if (Meteor.user()) {
            const inviteId = window.localStorage.getItem('inviteId');
            if (inviteId) {
                Meteor.call('Users.methods.updateInviteId', { inviteId });
            }
            window.localStorage.setItem('inviteId', '');
            c.stop();
        }
    });

    // if (Meteor.isDevelopment) {
        window.Collections = require('/lib').default;
        window.LocalState = context.LocalState;
    // }
});