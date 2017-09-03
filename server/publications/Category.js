
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

    // 获取目录列表
    Meteor.publish('Product.category', function (selector,options) {
        const self = this;

        if (!selector) {
            selector = {
                isRemoved: {
                    $ne: true,
                },
            };
        }
        if (!options) {
            options = {
                sort: {
                    createdAt: 1,
                },
                fields: {
                    name: 1,
                    subs: 1,
                    createdAt: 1,
                },
            };
        }
        return Collections.Category.find(selector, options);
    }); 
};

