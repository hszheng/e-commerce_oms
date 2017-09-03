import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

import React from 'react';
import Loading from './Loading';

class Page extends React.Component {
    constructor(props) {
        super(props);
        const self = this;
        self.state = {
            product: null,
            subs: [],
            isActive: 'active',
        };
    }

    componentWillMount() {
        // 加载component时执行
    }
    componentDidMount() {
        // 装载完成时调用
    }
    componentWillUpdate() {
        // nextProps
        // 更新组件触发
    }
    componentDidUpdate() {
        // 完成组件更新
        const self = this;
        const { verifyInfo } = self.props;
        const router = self.context.router;
        if (verifyInfo && verifyInfo.step === 4) {
            router.push('/onlineProduct');
        }
    }
    componentWillUnmount() {
        // 卸载component时执行

    }
    render() {
        const self = this;
        return (
            <div id="homePage">
                <div className="banner">
                    <div className="carousel">
                        <div className="title">淘二万让天下没有难做的代购</div>
                        <div className="caption">五分钟创建属于自己的代购商城</div>
                        <div className="btn-container">
                            <div className="login-btn apply" onClick={self._loginWithWechat.bind(self, 0)}>申请成为买手</div>
                            <div className="login-btn apply" style={{ marginLeft: '10px' }} onClick={self._loginWithWechat.bind(self, 1)}>申请成为代理</div>
                            <div className="login-btn login" onClick={self._loginWithWechat.bind(self)}>登录</div>
                        </div>

                    </div>
                </div>
                <div className="banner-container">
                    <div className="wrapper">
                        <div className="item">
                            <img src="/home/expand.png" />
                            <h1>拓展社交关系圈</h1>
                            <p>如何发展潜在客户？淘二万和微信深入整合，通过各种方式帮您发展微信朋友，让您可以借助微信建立自己的客户群，便利地向他们展示可在美国购买的商品。</p>
                            <span></span>
                        </div>
                        <div className="item">
                            <img src="/home/provide.png" />
                            <h1>提供代购商品库</h1>
                            <p>如何解决开店卖什么产品的问题？淘二万致力于建立costco，JCPenney, Macys, 及outlets的各种品牌商品完整数据，您可以转到自己的商品库，5分钟就可以建立自己的代购商城。</p>
                            <span></span>
                        </div>
                        <div className="item">
                            <img src="/home/perfect.png" />
                            <h1>完善的代理机制</h1>
                            <p>如何与国内亲友合作发展自己的生意？淘二万拥有完善的代理机制，支持您在国内发展代理，通过建立有效的分成机制来提升销量。</p>
                            <span></span>
                        </div>
                        <div className="item">
                            <img src="/home/share.png" />
                            <h1>提供优质的社区分享内容</h1>
                            <p>如何和客户建立更深层次的关系？淘二万是一个正能量平台，充分利用身处海外的有利条件，介绍先进科技知识，传递有趣见闻，增强您和朋友即客户之间的黏合度，让您的朋友圈不只是个代购平台，也是分享生活的空间。</p>
                            <span></span>
                        </div>
                        <div className="item">
                            <img src="/home/resources.png" />
                            <h1>买手社交以及资源互补</h1>
                            <p>如何在美国找到合作伙伴？淘二万通过朋友圈进行销售，不同买手之间的服务对象不同，买手之间不是竞争关系，而是合作和分享的关系。您可以找到在美国的有各种资源的买手，并建立合作关系。</p>
                            <span></span>
                        </div>
                        <div className="item">
                            <img src="/home/integrate.png" />
                            <h1>整合国际-国内物流</h1>
                            <p>如何解决物流问题？我们致力于打造美国-中国之间高效畅通的国际物流渠道，深度整合物流系统，为您提供端到端的物流体验，减少转运预报的繁琐操作，让您的商品尽快送达。</p>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 登录授权跳转事件
     * @return {Void} 无
     */
    _loginWithWechat(index) {
        const self = this;
        const { hasUser } = self.props;
        const { LocalState } = self.props.context();
        if (!hasUser) {
            localStorage.setItem('loginType', index);
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

const composer = ({ context, clearErrors }, onData) => {
    const { LocalState } = context();
    const hasUser = Meteor.userId();
    const error = LocalState.get('DEMO_ERROR');
    onData(null, { hasUser, verifyInfo: Meteor.user(), error });
};

const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
