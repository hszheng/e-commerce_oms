import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';

const Page = ({ fee }) => (
    <span>{fee.toFixed(2)}</span>
);

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    Meteor.call('Order.methods.getPreSettleOrderFee', (err, fee) => {
        onData(null, { fee });
    });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
