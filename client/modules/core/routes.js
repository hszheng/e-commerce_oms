import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Components
import MainLayout from './mainLayout';

import WechatUploadLayout from './wechatUploadLayout';
// Containers
import HomePage from './HomePage';
// demo
import DemoPage from '../demo';
// 内容库
import ContentPage from '../contentWarehouse';
// 每日期刊
import IssuePage from '../dailyIssue';
// 我的账户
import AccountPage from '../myAccount';
// 我的代理
import AgentPage from '../myAgent';
// 在线商品
import ProductPage from '../onlineProduct';
// 订单管理
import OrderPage from '../orderManage';
// 收款交易
import ReceiptPage from '../receiptTransaction';
// 提现交易
import WithdrawPage from '../withdrawTransaction';
// 我的设置
import SettingPage from '../setting';
// 新建期刊
import NewIssuePage from '../newIssue';
// 发布成功期刊
import publishSuccessPage from '../publishSuccessIssue';
// 编辑在线商品
import editProductPage from '../editProduct';
// 申请为买手的账号基本信息
import accountBasePage from '../accountBase';
// 申请成为买手，手机和邮箱验证
import mobileVerifyPage from '../mobileVerify';
// 申请成为买手的审核状态
import verifyStatusPage from '../verifyStatus';
// 买手协议
import ProtocolPage from '../protocol';
// 代理的订单管理界面
import agentorderManagePage from '../agentorderManage';

// 微信端上传商品
import wechatProductUploaderPage from '../wechatProductUploader';

// 代买管理
import agentBuyPage from '../agentBuy';

export default (inject, { Store }) => {
    const MainLayoutCtx = inject(MainLayout);
    const WechatUploadLayoutCtx = inject(WechatUploadLayout);
    const history = syncHistoryWithStore(browserHistory, Store);

    document.body.innerHTML = '<div id="app"></div>';

    ReactDOM.render(
        <Provider store={Store}>
            <Router history={history}>
                <Route path="/" component={MainLayoutCtx}>
                    <IndexRoute component={HomePage} />
                </Route>
                <Route path="/demo" component={MainLayoutCtx}>
                    <IndexRoute component={DemoPage} />
                </Route>
                <Route path="/contentWarehouse" component={MainLayoutCtx}>
                    <IndexRoute component={ContentPage} />
                </Route>
                <Route path="/dailyIssue" component={MainLayoutCtx}>
                    <IndexRoute component={IssuePage} />
                </Route>
                <Route path="/myAccount" component={MainLayoutCtx}>
                    <IndexRoute component={AccountPage} />
                </Route>
                <Route path="/myAgent" component={MainLayoutCtx}>
                    <IndexRoute component={AgentPage} />
                </Route>
                <Route path="/onlineProduct" component={MainLayoutCtx}>
                    <IndexRoute component={ProductPage} />
                </Route>
                <Route path="/orderManage" component={MainLayoutCtx}>
                    <IndexRoute component={OrderPage} />
                </Route>
                <Route path="/receiptTransaction" component={MainLayoutCtx}>
                    <IndexRoute component={ReceiptPage} />
                </Route>
                <Route path="/withdrawTransaction" component={MainLayoutCtx}>
                    <IndexRoute component={WithdrawPage} />
                </Route>
                <Route path="/setting" component={MainLayoutCtx}>
                    <IndexRoute component={SettingPage} />
                </Route>
                <Route path="/newIssue" component={MainLayoutCtx}>
                    <IndexRoute component={NewIssuePage} />
                </Route>
                <Route path="/publishSuccessIssue/:_id" component={MainLayoutCtx}>
                    <IndexRoute component={publishSuccessPage} />
                </Route>
                <Route path="/accountBase" component={MainLayoutCtx}>
                    <IndexRoute component={accountBasePage} />
                </Route>               
                <Route path="/mobileVerify" component={MainLayoutCtx}>
                    <IndexRoute component={mobileVerifyPage} />
                </Route>
                <Route path="/verifyStatus" component={MainLayoutCtx}>
                    <IndexRoute component={verifyStatusPage} />
                </Route>
                <Route path="/editProduct" component={MainLayoutCtx}>
                    <IndexRoute component={editProductPage} />
                </Route>                
                <Route path="/protocol" component={MainLayoutCtx}>
                    <IndexRoute component={ProtocolPage} />
                </Route>
                <Route path="/wechatProductUploader" component={WechatUploadLayoutCtx}>
                    <IndexRoute component={wechatProductUploaderPage} />
                </Route>
                <Route path="/agentBuy" component={MainLayoutCtx}>
                    <IndexRoute component={agentBuyPage} />
                </Route>  
                <Route path="/agentorderManage" component={MainLayoutCtx}>
                    <IndexRoute component={agentorderManagePage} />
                </Route>                
            </Router>
        </Provider>,
        document.getElementById('app')
    );
};
                // <Route path="/editProduct/:_id" component={MainLayoutCtx}>
                //     <IndexRoute component={editProductPage} />
                // </Route>