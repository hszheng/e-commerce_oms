import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';

class Page extends React.Component {
    componentWillMount() {
        // 加载component时执行

    }

    componentWillUnmount() {
        // 卸载component时执行

    }

    render() {
        return (
            <footer id="footer">
                <div>@2016 all right Reserved 版本1.0粤ICP备13020116号-3号</div>
            </footer>
        );
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

const composer = ({ context, clearErrors }, onData) => {
    const hasUser = Meteor.userId();

    onData(null, { hasUser });

    return clearErrors;
};

const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
