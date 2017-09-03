import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Menu, Dropdown, Button, Form, Input, Select, Col } from 'antd';

import { InfoForm } from './InfoForm';

class Page extends React.Component {
    componentWillMount() {
        // 加载component时执行
        if (!Meteor.userId()) {
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
    }
    componentDidMount() {
        // 组件加载完成时执行
    }
    componentDidUpdate() {
        // 完成组件更新
        const self = this;
        const { verifyInfo } = self.props;
        const router = self.context.router;
        if (verifyInfo && verifyInfo.step === 4) {
            // router.push('/onlineProduct');
        }
    }
    render() {
        const self = this;
        return (
            <div id="mobileVerifyPage">
                <div className="loading" style={{ display: 'none' }}>
                    <img src="/loading.gif" className="loadingImg importLoading"></img>
                </div>
                <div id="mobileVerifyContent">
                    <div className="progressContainer">
                        <img src="/progress2.png" />
                    </div>
                    <div className="titleText">联系方式&nbsp;&nbsp;
                        <a href="/accountBase"> >返回上一步重新选择 </a>
                    </div>
                    <InfoForm/>
                </div>
            </div>
        );
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState } = context();
    const hasUser = Meteor.userId();
    const error = LocalState.get('DEMO_ERROR');
    onData(null, { hasUser, verifyInfo: Meteor.user(), error });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
