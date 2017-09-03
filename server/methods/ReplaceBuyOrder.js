import Collections from '/lib';

export default () => {
    // 更改订单信息
    new ValidatedMethod({
        name: 'ReplaceBuyOrder.methods.updateStatus',
        validate: null,
        run(obj) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const userId = self.userId;
            const nowReplaceBuyOrder = Collections.ReplaceBuyOrder.findOne({ _id: obj.nowId });
            const no = nowReplaceBuyOrder.no;

            if (nowReplaceBuyOrder.status === '已签收' || nowReplaceBuyOrder.status === '已取消') {
                throw new Meteor.Error('该订单不能更改状态');
            }

            Collections.ReplaceBuyOrder.update(obj.nowId, {
                $set: { status: obj.status },
            });

            Collections.Logistics.insert({
                ReplaceBuyOrderNo: no,
                ReplaceBuyOrderId: obj.nowId,
                status: obj.status,
                createdAt: new Date(),
                createdBy: userId,
            });
            return true;
        },
    });

    // 删除订单中商品
    new ValidatedMethod({
        name: 'ReplaceBuyOrder.methods.deleteProduct',
        validate: null,
        run({ ReplaceBuyOrderId, productId }) {
            const self = this;

            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentReplaceBuyOrder = Collections.ReplaceBuyOrder.findOne(ReplaceBuyOrderId);
            const currentUser = Meteor.users.findOne(currentReplaceBuyOrder.seller);

            if (currentOrder.isSettled) {
                throw new Meteor.Error('已经结算，无法删除');
            }

            const newProduct = [];
            let deleteproduct;
            currentReplaceBuyOrder.products.forEach((product) => {
                if (product._id !== productId) {
                    newProduct.push(product);
                } else {
                    deleteproduct = product;
                }
            });

            const prevFee = parseFloat((currentReplaceBuyOrder.prevFee - deleteproduct.price * deleteproduct.amount).toFixed(2));
            let needPay = parseFloat((currentReplaceBuyOrder.needPay - deleteproduct.price * deleteproduct.amount).toFixed(2));
            if (needPay < 0) {
                needPay = 0;
            }
            const total = needPay;

            const changeBalance = currentReplaceBuyOrder.total - total;

            Collections.ReplaceBuyOrder.update(currentReplaceBuyOrder._id, {
                $set: {
                    prevFee,
                    needPay,
                    total,
                    products: newProduct,
                },
            });
            if (changeBalance) {
                Collections.RefundLog.insert({
                    id: currentReplaceBuyOrder.no,
                    out_trade_no: currentReplaceBuyOrder.out_trade_no,
                    remark: '部分退款',
                    status: '待审核',
                    fee: currentReplaceBuyOrder.total,
                    userId: currentUser._id,
                    createdBy: currentUser._id,
                    createdAt: new Date(),
                });
            }

            return true;
        },
    });

    // 更改运单号
    new ValidatedMethod({
        name: 'ReplaceBuyOrder.methods.updateShipNumber',
        validate: null,
        run(obj) {
            // // console.log(obj);
            if(obj.no) {
                const originalReplaceBuyOrder = Collections.Order.findOne({no: obj.no});
                const agentReplaceBuyOrder = Collections.ReplaceBuyOrder.findOne({_id: obj.nowId});
                _.each(agentReplaceBuyOrder.products, (product1, index1) => {
                    _.each(originalReplaceBuyOrder.products, (product2, index2) => {
                        if (product1._id === product2._id) {
                            product1.transferNo = obj.transferNo;
                            product1.transferCompany = obj.transferCompany;
                        }
                    });
                });
                Collections.ReplaceBuyOrder.update(originalReplaceBuyOrder._id, {
                    $set: { transferNo: obj.transferNo, transferCompany: obj.transferCompany },
                });                
            }
            Collections.Order.update(obj.nowId, {
                $set: { transferNo: obj.transferNo, transferCompany: obj.transferCompany },
            });
            return true;
        },
    });
    // 更改订单的价格
    new ValidatedMethod({
        name: 'ReplaceBuyOrder.methods.updatePrice',
        validate: null,
        run(obj) {
            Collections.ReplaceBuyOrder.update(obj.nowId, {
                $set: { replaceBuyerPrice: obj.nowPrice },
            });
            return true;
        },
    });
    // 更改国内物流号
    new ValidatedMethod({
        name: 'ReplaceBuyOrder.methods.updateCivilNo',
        validate: null,
        run(obj) {
            if(obj.no) {
                const originalReplaceBuyOrder = Collections.Order.findOne({no: obj.no});
                const agentReplaceBuyOrder = Collections.ReplaceBuyOrder.findOne({_id: obj.nowId});
                _.each(agentReplaceBuyOrder.products, (product1, index1) => {
                    _.each(originalReplaceBuyOrder.products, (product2, index2) => {
                        if (product1._id === product2._id) {
                            product1.trackingNo = obj.trackingNo;
                            product1.expressCompany = obj.expressCompany;
                        }
                    });
                });
                Collections.ReplaceBuyOrder.update(originalReplaceBuyOrder._id, {
                    $set: { trackingNo: obj.trackingNo, expressCompany: obj.expressCompany },
                });                
            }            
            Collections.ReplaceBuyOrder.update(obj.nowId, {
                $set: { trackingNo: obj.trackingNo, expressCompany: obj.expressCompany },
            });
            return true;
        },
    });
};
