import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    // 获取订单总数
    Meteor.publish('ReplaceBuyOrder.getCount', function (selector) {
        const self = this;
        Counts.publish(this, 'orderCount', Collections.ReplaceBuyOrder.find(selector));
    });

    // 获取订单详情
    Meteor.publish('ReplaceBuyOrder.getData', function (data) {
        const self = this;
        return Collections.ReplaceBuyOrder.find(data.selector, data.options);
    });
};
