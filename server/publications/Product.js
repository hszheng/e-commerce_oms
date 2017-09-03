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
	// 获取产品数
    Meteor.publish('Product.OnlineProductCount', function (data) {
        Counts.publish(this, 'OnlineProductCount', Collections.Product.find(data.selector));
    });
    // 获取产品列表
    Meteor.publish('Product.productList', function (data) {
        if (!data.selector) {
            data.selector = {};
        }
        if (!data.options) {
            data.options = {};
        }
        // console.log(Collections.Product.find(data.selector, data.options).fetch());
        return Collections.Product.find(data.selector, data.options);
    });

    // 获取除买手已导入的商品列表和列表数量
    Meteor.publish('Product.extraProductList', function (data) {
        const self = this;
        const userId = self.userId;
        const buyerProductIdArr = [];
        const buyerProductArr = Collections.Product.find({ publisher: 1, createdBy: userId, journalId: '', isRemoved: { $ne: true } }).fetch();
        _.each(buyerProductArr, (item) => {
            if (item.copy) {
                buyerProductIdArr.push(item.copy);
            }
        });

        if (buyerProductIdArr && buyerProductIdArr.length) {
            data.selector._id = { $nin: buyerProductIdArr };
        }
        // console.log(data);
        // console.log(Collections.Product.find(data.selector, data.options).fetch());
        return Collections.Product.find(data.selector, data.options);
    });

    // 获取除买手已导入的产品数
    Meteor.publish('Product.contentProductCount', function (data) {
        const self = this;
        const userId = self.userId;
        const buyerProductIdArr = [];
        const buyerProductArr = Collections.Product.find({ publisher: 1, createdBy: userId, journalId: '', isRemoved: { $ne: true } }, { copy: { $exists: true } }).fetch();
        _.each(buyerProductArr, (item) => {
            // if (item.copy) {
            buyerProductIdArr.push(item.copy);
            // }
        });

        if (buyerProductIdArr && buyerProductIdArr.length) {
            data.selector._id = { $nin: buyerProductIdArr };
        }
        Counts.publish(this, 'contentProductCount', Collections.Product.find(data.selector));
    });
};
