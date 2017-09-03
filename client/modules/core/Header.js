import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Link } from 'react-router';

import { Menu } from 'antd';

class Page extends React.Component {
    constructor(props) {
        super(props);
        const self = this;
        self.state = {
        };
    }     
    componentWillMount() {
        // 加载component时执行
        const self = this;
    }
    componentWillReceiveProps(nextProps) {
        // 模块将接受新的数据
        const self = this;
        const router = self.context.router;
        if (!localStorage.getItem('Meteor.userId') && nextProps.path) {
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
        if (nextProps.currentUser && nextProps.path !== 'protocol') {
            const step = nextProps.currentUser.step;
            // console.log(`/${nextProps.path}`);
            switch (step) {
                case 0:
                case 2:
                case 3:                
                    nextProps.path !== 'accountBase' && router.push('/accountBase');
                    break;
                // case 4:
                    // nextProps.path !== 'accountBase' && router.push(`/${nextProps.path}`);
                    // break;
                default: break;
                }
        }
    }

    componentWillUnmount() {
        // 卸载component时执行

    }

    render() {
        const self = this;
        const { currentUser, path } = self.props;
        let pathname = location.pathname.split('/')[1];
        if (pathname === 'contentWarehouse') {
            pathname = 'onlineProduct';
        } else if (pathname === 'newIssue') {
            pathname = 'dailyIssue';
        } else if (pathname === 'receiptTransaction') {
            pathname = 'myAccount';
        } else if (pathname === 'withdrawTransaction') {
            pathname = 'myAccount';
        }
        return (
            <div id="header">
                <nav className="navigation">
                    <div className="tao-logo">
                        <img src="/header/logo.png" />
                    </div>
                    { currentUser && currentUser.step === 4 ? currentUser && currentUser.status.indexOf(0) !== -1 ? (
                        <Menu mode="horizontal" className="menu-list" selectedKeys={[pathname]}>
                            <Menu.Item key="onlineProduct"><Link to="/onlineProduct">我的商城</Link></Menu.Item>
                            <Menu.Item key="dailyIssue"><Link to="/dailyIssue">精选淘刊</Link></Menu.Item>
                            <Menu.Item key="orderManage"><Link to="/orderManage">订单管理</Link></Menu.Item>
                            <Menu.Item key="myAgent"><Link to="/myAgent">我的代理</Link></Menu.Item>
                            <Menu.Item key="myAccount"><Link to="/myAccount">财务明细</Link></Menu.Item>
                        </Menu>
                    ) : (
                            <Menu mode="horizontal" className="menu-list" selectedKeys={[pathname]}>
                                <Menu.Item key="onlineProduct"><Link to="/onlineProduct">我的商城</Link></Menu.Item>
                                <Menu.Item key="dailyIssue"><Link to="/dailyIssue">精选淘刊</Link></Menu.Item>
                                <Menu.Item key="agentorderManage"><Link to="/agentorderManage">订单管理</Link></Menu.Item>
                                <Menu.Item key="myAccount"><Link to="/myAccount">财务明细</Link></Menu.Item>
                            </Menu>
                    ) : (
                            <div className="menu-list"></div>
                        )
                    }
                    <div className="userOpe">
                        <div className="web-setting">
                        {currentUser ? (<div><Link to="/setting" className="currentUser" onClick={self._selectNav.bind(self)}>{currentUser.nickname}</Link><span onClick={self._logout.bind(self)}>退出登录</span></div>) : ''}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

/**
 * 导航栏事件
 * @param  {Object} e 事件本身
 * @return {Void}   无
 */
    _selectNav(e) {
        const pathname = location.pathname.split('/')[1];
        if (pathname === 'accountBase' || pathname === 'mobileVerify') {
            e.preventDefault();
        }
        $('#header .navigation .menu-list .item').removeClass('active');
        $('#header .navigation .userOpe a').removeClass('active');
        $(e.currentTarget).addClass('active');
    }
/**
 * 退出登陆操作
 * @return {Void} 无
 */
    _logout() {
        const self = this;
        const router = self.context.router;
        if (window.confirm('确认退出')) {
            Meteor.logout();
            router.push('/');
        }
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

const composer = ({ context }, onData) => {
    const path = location.pathname.split('/')[1];
    const currentUser = Meteor.user();
    onData(null, { currentUser, path });
};

const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
