import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
// import { Link } from 'react-router';
import Loading from '../core/Loading';
class Page extends React.Component {
    componentWillMount() {
        // 加载component时执行
        const self = this;
        const { verifyInfo, hasUser } = self.props;
        const router = self.context.router;
        if (!hasUser) {
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
        if (verifyInfo && verifyInfo.step === 4) {
            router.push('/onlineProduct');
        }
    }
    componentWillUpdate(nextProps) {
        // nextProps
        const self = this;
        const router = self.context.router;
        if (nextProps.verifyInfo && nextProps.verifyInfo.step === 4) {
            router.push('/onlineProduct');
        }
    }
    componentDidUpdate() {
        // 完成组件更新
    }
    componentDidMount() {
        // 组件完成加载
    }
    render() {
        const self = this;
        const { verifyInfo } = self.props;
        return (
            <div id="verifyStatus">
                <div className="progressContainer">
                    <img src="/progress3.png" />
                </div>
                <div id="verifyStatusContent">
                    {verifyInfo.step === 2 && (<div className="contentDetail"><p>您的资料正在审核中，请耐心等待。</p><p>如有任何疑问，请联系平台客服</p><p>联系邮箱：taoerwan@xuuue.cn</p></div>)}
                    {verifyInfo.step === 3 && (<div className="contentDetail"><p>你的资料审核未通过，有一些信息不正确</p><p>{verifyInfo.remark}<a href="/accountBase">返回修改</a></p><p>如有任何疑问，请联系平台客服</p><p>联系邮箱：taoerwan@xuuue.cn</p></div>)}
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
    if (hasUser) {
        Meteor.call('Users.methods.getVerifyStatus', { userId: hasUser }, (err, result) => {
            if (err) {
                alert(err);
                onData(null, { hasUser: '', verifyInfo: null, error });
            } else {
                onData(null, { hasUser, verifyInfo: result, error });
            }
        });
    } else {
        Meteor.loginWithWechat({ loginStyle: 'redirect' });
        return;
    }
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
