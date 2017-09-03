import Collections from '/lib';

export default () => {
    // 批量导入商品到我的商品库
    new ValidatedMethod({
        name: 'Product.methods.updateCreatedBy',
        validate: null,
        run(arr) {
            const self = this;
            const _idArr = _.pluck(arr, '_id');
            const nowProduct = Collections.Product.find({ _id: { $in: _idArr } }).fetch();
            const arr1 = [];
            const userId = self.userId;
            const user = Meteor.users.findOne(userId);
            _.each(nowProduct, (item) => {
                _.each(arr, (obj) => {
                    if(item._id === obj._id && obj.agentPrice) {
                        // item.replaceBuyerId = userId;
                        // item.replaceBuyerName = user.storeName;
                        // item.replaceBuyerPrice = parseFloat(obj.agentPrice);
                        item.agentPrice = parseFloat(obj.agentPrice);
                    }
                });
                item.createdBy = self.userId;
                item.publisher = 1;
                item.shelf = false;
                item.copy = item._id;
                item.journalId = '';
                item.createdAt = new Date();
                item.isRemoved = false;
                delete item._id;
                arr1.push(item);
            });

            // // console.log('新产品数组：', arr1);
            // return ;
            _.each(arr1, (item) => {
                Collections.Product.insert(item);
            });
            return Collections.Product.find({ publisher: 1, createdBy: userId, journalId: '', isRemoved: { $ne: true } }, { copy: { $exists: true }, fields: {copy: 1}}).fetch();
        },
    });
    new ValidatedMethod({
        name: 'Product.methods.getProductList',
        validate: null,
        run(data) {
            const self = this;
            const { userId } = self;
            new SimpleSchema({
                userId: {
                    type: String,
                },
            }).validate({ userId });
            return Collections.Product.find(data).fetch();
        },
    });
    // 获取除买手已导入的商品列表和列表数量
    new ValidatedMethod({
        name: 'Product.methods.noBuyerProductListAndCount',
        validate: null,
        run(data) {
            const self = this;
            const { userId } = self;
            new SimpleSchema({
                userId: {
                    type: String,
                },
            }).validate({ userId });
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
            const count = Collections.Product.find(data.selector).count();

            const productData = Collections.Product.find(data.selector, data.options).fetch();
            const category = Collections.Category.find( {isRemoved: { $ne:true}},{sort:{createdAt:1},fields:{name:1,subs:1,createdAt:1}}).fetch();
            return { productData, count, buyerProductArr, buyerProductIdArr, category};
        },
    });

    // 获取商品列表和列表数量
    new ValidatedMethod({
        name: 'Product.methods.getProductListAndCount',
        validate: null,
        run(data) {
            const self = this;
            const { userId } = self;
            new SimpleSchema({
                userId: {
                    type: String,
                },
            }).validate({ userId });
            const productData = Collections.Product.find(data.selector, data.options).fetch();
            const count = Collections.Product.find(data.selector).count();
            const category = Collections.Category.find({
                isRemoved: {
                    $ne: true,
                },
            }, {
                sort: {
                    createdAt: 1,
                },
                fields: {
                    name: 1,
                    subs: 1,
                    createdAt: 1,
                },
            }).fetch();

            return { productData, count, category };
        },
    });

    new ValidatedMethod({
        name: 'Product.methods.insert',
        validate: null,
        run(data) {
            const self = this;
            data.publisher = 1;
            data.createdBy = self.userId;
            data.journalId = '';
            data.createdAt = new Date();
            data.isRemoved = false;
            data.shelf = false;
            return Collections.Product.insert(data);
        },
    });

    // 根据期刊ID查找产品
    new ValidatedMethod({
        name: 'Product.methods.getProductsByJournalId',
        validate: null,
        run(id) {
            const self = this;
            const { userId } = self;
            new SimpleSchema({
                userId: {
                    type: String,
                },
            }).validate({ userId });

            return Collections.Product.find({ journalId: id }).fetch();
        },
    });

    // 根据商品ID查询商品
    new ValidatedMethod({
        name: 'Product.methods.getProductById',
        validate: null,
        run(id) {
            const self = this;
            const { userId } = self;

            new SimpleSchema({
                userId: { type: String },
            }).validate({ userId });
            const productInfo = Collections.Product.findOne({ _id: id }); 
            const category = Collections.Category.find( {isRemoved: { $ne:true}},{sort:{createdAt:1},fields:{name:1,subs:1}}).fetch();
            return {productInfo, category};
        },
    });

    // 根据商品ID查询商品
    new ValidatedMethod({
        name: 'Product.methods.getProductByIdArr',
        validate: null,
        run(idArr) {
            const self = this;
            const { userId } = self;

            new SimpleSchema({
                userId: { type: String },
            }).validate({ userId });

            return Collections.Product.find({ _id: { $in: idArr } }).fetch();
        },
    });

    // 更新商品信息
    new ValidatedMethod({
        name: 'Product.methods.update',
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
            const self = this;
            const product = Collections.Product.findOne(data._id);
            return Collections.Product.update(data._id, { $set: data.modifier });
        },
    });

    // 批量上架
    new ValidatedMethod({
        name: 'Product.methods.multiAddShelf',
        validate: new SimpleSchema({
            idArr: {
                type: [String],
            },
        }).validator(),
        run({ idArr }) {
            idArr.forEach((_id) => {
                Collections.Product.update(_id, { $set: {
                    shelf: true,
                    shelfTime: new Date(),
                } });
            });
            return true;
        },
    });
    // 批量下架
    new ValidatedMethod({
        name: 'Product.methods.multiRemoveShelf',
        validate: new SimpleSchema({
            idArr: {
                type: [String],
            },
        }).validator(),
        run({ idArr }) {
            idArr.forEach((_id) => {
                Collections.Product.update(_id, { $set: {
                    shelf: false,
                } });
            });
            return true;
        },
    });
    // 批量删除
    new ValidatedMethod({
        name: 'Product.methods.multiDelete',
        validate: new SimpleSchema({
            idArr: {
                type: [String],
            },
        }).validator(),
        run({ idArr }) {
            idArr.forEach((_id) => {
                Collections.Product.update(_id, { $set: {
                    isRemoved: true,
                } });
            });
            return true;
        },
    });

    new ValidatedMethod({
        name: 'Product.methods.updateById',
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
            return Collections.Product.update(data._id, { $set: data.modifier });
        },
    });

};
