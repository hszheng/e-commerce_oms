import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';

class Page extends React.Component {
    componentWillMount() {
        // 加载component时执行
        const self = this;
        const { hasUser } = self.props;

        if (!hasUser) {
            // router.push('/login');
        }
    }

    render() {
        return (
            <div id="demoPage">
                <Helmet title="Demo" />
                <h1>Demo Page</h1>
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

    onData(null, { hasUser, error });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
