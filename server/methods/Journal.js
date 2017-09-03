/**
 *
 * 期刊表增删改查
 *
 * @author Vincent Zheng
 *
 */

import Collections from '/lib';

export default () => {
    // 获取限定条件获取期刊详情
    new ValidatedMethod({
        name: 'Journal.methods.getInfoByLimiter',
        validate: null,
        run({ selector, options }) {
            const self = this;
            const journalArr = Collections.Journal.find(selector, options).fetch();
            const count = Collections.Journal.find({isRemoved: { $ne: true }, createdBy: self.userId}).fetch().length;
            return {
                journalArr,
                count
            }
        },
    });
    // 新增期刊
    new ValidatedMethod({
        name: 'Journal.methods.insert',
        validate: new SimpleSchema({
            productArr: {
                type: [Object],
                blackbox: true,
            },
            categories: {
                type: [String],
            },
            productImages: {
                type: [String],
            },
            description: {
                type: String,
            },
            name: {
              type: String,  
            }
        }).validator(),
        run({ productArr, categories, productImages, name, description }) {
            const self = this;
            const journalId = Collections.Journal.insert({
                description,
                categories,
                productImages,
                name,
                views: 0,
                createdBy: self.userId,
                createdAt: new Date(),
            });

            productArr.forEach((product) => {
                delete product._id;
                product.journalId = journalId;
                Collections.Product.insert(product);
            });
            return journalId;
        },
    });
    // 通过期刊ID获取期刊、用户、产品详情
    new ValidatedMethod({
        name: 'Journal.methods.getInfoById',
        validate: null,
        run(id) {
            const journalInfo = Collections.Journal.findOne(id);
            const userInfo = Meteor.users.findOne(journalInfo.createdBy);
            const products = Collections.Product.find({ journalId: id }).fetch();

            return {
                journalInfo,
                userInfo,
                products,
            };
        },
    });

    // 通过ID修改期刊
    new ValidatedMethod({
        name: 'Journal.methods.update',
        validate: new SimpleSchema({
            _id: {
                type: String,
            },
            modifier: {
                type: Object,
                blackbox: true,
            },
        }).validator(),
        run(data) {
            Collections.Journal.update(data._id, { $set: data.modifier });
            return true;
        },
    });

    // 获取商品列表
    new ValidatedMethod({
        name: 'Journal.methods.getProductsList',
        validate: new SimpleSchema({
            selector: {
                type: Object,
                blackbox: true,
            },
            options: {
                type: Object,
                blackbox: true,
            },
        }).validator(),
        run({ selector, options }) {
            return Collections.Product.find(selector, options).fetch();
        },
    });

    new ValidatedMethod({
        name: 'Journal.methods.getListById',
        validate: null,
        run(id) {
            return Collections.Journal.findOne(id);
        },
    });
};
