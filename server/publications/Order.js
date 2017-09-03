import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    // 获取订单总数
    Meteor.publish('Order.getCount', function (selector) {
        const self = this;
        Counts.publish(this, 'orderCount', Collections.Order.find(selector));
    });

    // 获取订单详情
    Meteor.publishComposite('Order.getData', function (data) {
        const self = this;
        return {
            find() {
                return Collections.Order.find(data.selector, data.options);
            },
            children: [
                {
                    find(order) {
                        const saleAgentId = order.saleAgentId || 'none';
                        return Meteor.users.find({unionid: saleAgentId });
                    },
                },
            ],
        };
    });
};
