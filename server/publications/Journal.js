/**
 *
 * 订阅买手发布的所有期刊
 *
 * @author Vincent Zheng
 *
 */
import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    // publish所有期刊
    Meteor.publish('Journal.all', function () {
        const self = this;
        const userId = self.userId;

        try {
            new SimpleSchema({
                userId: { type: String },
            }).validate({ userId });
        } catch (e) {
            self.ready();
        }
        return Collections.Journal.find({}, { fields: Collections.Journal.publicFields });
    });

    // publish 新增期刊的商品
    Meteor.publish('Journal.products', function (selector, options) {
        const self = this;

        if (!selector) {
            selector = {};
        }
        if (!options) {
            options = {};
        }
        return Collections.Product.find({ journalId: '', publisher: 1, createdBy: self.userId }, options);
    });
    // 获取已布期刊数
    Meteor.publish('Journal.issueCount', function() {
        const self = this;
        Counts.publish(this, 'issueCount', Collections.Journal.find({isRemoved: { $ne: true }, createdBy: self.userId}));
    })
    // 获取已发布期刊列表
    Meteor.publish('Journal.issueList', function (data) {
        if (!data.selector) {
            data.selector = {};
        }
        if (!data.options) {
            data.options = {};
        }
        return Collections.Journal.find(data.selector, data.options);
    });
};

