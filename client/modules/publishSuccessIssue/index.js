import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import QRCode from 'qrcode.react';
import Loading from '../core/Loading';
class Page extends React.Component {
    componentWillMount() {
        // 加载component时执行
        if (!Meteor.userId()) {
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
    }

    render() {
        const self = this;
        const { journalId, currentUser } = self.props;
        const { Configuration } = self.props.context();

        return (
            <div id="publishSuccessIssue">
                <div className="release">
                    <h1>恭喜你已成功发布该期期刊!</h1>
                    <QRCode value={`${Configuration.WECHAT_HOST}/journalImage/${journalId}?inviteId=${currentUser.unionid}`} size={200} />
                    <p>手机微信扫描该二维码，可一键下载生成的期刊，然后就可以分享到自己的朋友圈了！</p>
                </div>
            </div>
        );
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context, params }, onData) => {
    const { LocalState } = context();
    const currentUser = Meteor.user() || {};

    onData(null, { currentUser, journalId: params._id });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
