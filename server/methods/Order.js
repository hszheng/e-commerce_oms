import Collections from '/lib';

export default () => {
    // 申请退款
    new ValidatedMethod({
        name: 'Order.methods.applyRefund',
        validate: null,
        run(obj) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const userId = self.userId;
            const currentUser = Meteor.users.findOne(userId);
            const currentOrder = Collections.Order.findOne({ _id: obj.nowId }) || {};
            const customer = Meteor.users.findOne(currentOrder.createdBy) || {};
            const total = currentOrder.total - obj.refund;
            
            Collections.Order.update(currentOrder._id, {
                $set: { 
                    total,
                },
            });            
            
            /**** 订单状态为已发货后 ****/
            // 修改用户信息
            const totalTurnover = currentUser.totalTurnover - obj.refund;
            const withdrawAmount = currentUser.withdrawAmount - obj.refund;

            Meteor.users.update(userId, {
                $set: {
                    totalTurnover,
                    withdrawAmount,
                }
            })
            // 退款交易记录
            Collections.RefundLog.insert({
                id: currentOrder.no, // 订单号
                out_trade_no: currentOrder.no, // 商户订单号
                remark: `您申请退款${obj.refund}元`, // 备注
                status: '待处理', // 状态
                fee: obj.refund, // 退款金额
                userId: customer._id, // 用户userId
                createdBy: userId, // 创建人userId
                createdAt: new Date(), // 创建日期
            });
            /**** 订单状态为已发货前 ****/
            return true;
        },
    });

    // 获取订单
    new ValidatedMethod({
        name: 'Order.methods.getNotiCount',
        validate: null,
        run(data) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }
            const toConfirm = Collections.Order.find({ seller: self.userId, isRemoved: {$ne: true}, status: '待确定' }).count();
            const toDeliver = Collections.Order.find({ seller: self.userId, isRemoved: {$ne: true}, status: '待发货' }).count();
            const toPurchase = Collections.Order.find({ seller: self.userId, isRemoved: {$ne: true}, status: '待采购' }).count();
            const signed = Collections.Order.find({ seller: self.userId, isRemoved: {$ne: true}, status: {$ne: '已取消'} }).count();
            return {
                toConfirm, toDeliver, toPurchase, signed
            }
        },
    });

    // 更改订单信息
    new ValidatedMethod({
        name: 'Order.methods.updateStatus',
        validate: null,
        run(obj) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }
            const userId = self.userId;
            const nowOrder = Collections.Order.findOne({ _id: obj.nowId });
            const no = nowOrder.no;

            if (nowOrder.status === '已签收' || nowOrder.status === '已取消') {
                throw new Meteor.Error('该订单不能更改状态');
            }

            Collections.Order.update(obj.nowId, {
                $set: { status: obj.status },
            });

            Collections.Logistics.insert({
                orderNo: no,
                orderId: obj.nowId,
                status: obj.status,
                createdAt: new Date(),
                createdBy: userId,
            });

            if (obj.status === '已发货') {
                // 更新可提现金额
                Meteor.call('Order.methods.updateWithdrawAmount', {
                    _id: obj.nowId,
                });
            }
            return true;
        },
    });

    // 订单金额变成可提现金额
    new ValidatedMethod({
        name: 'Order.methods.updateWithdrawAmount',
        validate: new SimpleSchema({
            _id: {
                type: String,
            },
        }).validator(),
        run({ _id }) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentOrder = Collections.Order.findOne({ _id });
            if (!currentOrder) {
                throw new Meteor.Error('找不到该订单');
            }
            const currentUser = Meteor.users.findOne(currentOrder.seller);

            if (currentOrder.isSettled) {
                throw new Meteor.Error('已经结算');
            }

            if (!currentOrder.total) {
                throw new Meteor.Error('订单金额异常');
            }

            // 销售代理的订单
            if (currentOrder.saleAgentId && currentOrder.agentPrice) {
                let serviceFee = 0;
                if (currentOrder.seller === 'bhhDXvaaWESATqcvX' || currentOrder.seller === 'bLMFrdFZGqQWc8AKL') {
                    serviceFee = parseFloat((currentOrder.agentPrice * 0.05).toFixed(2)) || 0;
                }
                const artualTotal = parseFloat((currentOrder.agentPrice - serviceFee).toFixed(2)) || 0;

                const withdrawAmount = parseFloat((currentUser.withdrawAmount + artualTotal).toFixed(2));

                Collections.Order.update(currentOrder._id, { $set: {
                    serviceFee,
                    artualTotal,
                    isSettled: true,
                } });

                Meteor.users.update(currentUser._id, { $set: {
                    withdrawAmount,
                } });

                Collections.Withdraw.insert({
                    type: '订单完成',
                    id: currentOrder.no,
                    remark: '',
                    status: '已完成',
                    amount: currentOrder.agentPrice,
                    commissionFee: serviceFee,
                    changeBalance: artualTotal,
                    balance: withdrawAmount,
                    preBalance: currentUser.withdrawAmount,
                    userId: currentUser._id,
                    createdBy: currentUser._id,
                    createdAt: new Date(),
                });

                const agentUser = Meteor.users.findOne({ unionid: currentOrder.saleAgentId });
                const agentWithdrawAmount = parseFloat((agentUser.withdrawAmount + currentOrder.total - currentOrder.agentPrice).toFixed(2));
                Collections.Withdraw.insert({
                    type: '订单完成',
                    id: currentOrder.no,
                    remark: '',
                    status: '已完成',
                    amount: currentOrder.total,
                    commissionFee: 0,
                    changeBalance: currentOrder.total,
                    balance: parseFloat((agentUser.withdrawAmount + currentOrder.total).toFixed(2)),
                    preBalance: agentUser.withdrawAmount,
                    userId: agentUser._id,
                    createdBy: agentUser._id,
                    createdAt: new Date(),
                });
                Collections.Withdraw.insert({
                    type: '订单完成',
                    id: currentOrder.no,
                    remark: '',
                    status: '已完成',
                    amount: currentOrder.agentPrice,
                    commissionFee: 0,
                    changeBalance: -currentOrder.agentPrice,
                    balance: agentWithdrawAmount,
                    preBalance: parseFloat((agentUser.withdrawAmount + currentOrder.total).toFixed(2)),
                    userId: agentUser._id,
                    createdBy: agentUser._id,
                    createdAt: new Date(),
                });
                Meteor.users.update(agentUser._id, { $set: {
                    withdrawAmount: agentWithdrawAmount,
                } });
                return true;
            }

            let serviceFee = 0;
            if (currentOrder.seller === 'bhhDXvaaWESATqcvX' || currentOrder.seller === 'bLMFrdFZGqQWc8AKL') {
                serviceFee = parseFloat((currentOrder.total * 0.05).toFixed(2)) || 0;
            }
            const artualTotal = parseFloat((currentOrder.total - serviceFee).toFixed(2)) || 0;

            const withdrawAmount = parseFloat((currentUser.withdrawAmount + artualTotal).toFixed(2));

            Collections.Order.update(currentOrder._id, { $set: {
                serviceFee,
                artualTotal,
                isSettled: true,
            } });

            Meteor.users.update(currentUser._id, { $set: {
                withdrawAmount,
            } });

            Collections.Withdraw.insert({
                type: '订单完成',
                id: currentOrder.no,
                remark: '',
                status: '已完成',
                amount: currentOrder.total,
                commissionFee: serviceFee,
                changeBalance: artualTotal,
                balance: withdrawAmount,
                preBalance: currentUser.withdrawAmount,
                userId: currentUser._id,
                createdBy: currentUser._id,
                createdAt: new Date(),
            });

            return true;
        },
    });

    // 取消订单
    new ValidatedMethod({
        name: 'Order.methods.cancelOrder',
        validate: null,
        run(obj) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentUser = Meteor.users.findOne(self.userId);
            const currentOrder = Collections.Order.findOne({ _id: obj.nowId });

            if (currentOrder.status === '已签收' || currentOrder.status === '已取消' || currentOrder.isSettled) {
                throw new Meteor.Error('该订单不能更改状态');
            }

            Collections.Order.update(currentOrder._id, {
                $set: { status: '已取消' },
            });
            Collections.Logistics.insert({
                orderNo: currentOrder.no,
                orderId: currentOrder._id,
                status: '已取消',
                createdAt: new Date(),
                createdBy: currentUser._id,
            });

            if (currentOrder.total) {
                // 插入申请退款记录
                Collections.RefundLog.insert({
                    id: currentOrder.no,
                    out_trade_no: currentOrder.out_trade_no,
                    remark: '全额退款',
                    status: '待审核',
                    fee: currentOrder.total,
                    userId: currentUser._id,
                    createdBy: currentUser._id,
                    createdAt: new Date(),
                });
            }
            return true;
        },
    });

    // 签收订单
    new ValidatedMethod({
        name: 'Order.methods.signOrder',
        validate: null,
        run(obj) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentUser = Meteor.users.findOne(self.userId);
            const currentOrder = Collections.Order.findOne({ _id: obj.nowId });

            if (currentOrder.status === '已签收' || currentOrder.status === '已取消') {
                throw new Meteor.Error('该订单不能更改状态');
            }

            Collections.Order.update(currentOrder._id, {
                $set: {
                    status: '已签收',
                },
            });
            Collections.Logistics.insert({
                orderNo: currentOrder.no,
                orderId: currentOrder._id,
                status: '已签收',
                createdAt: new Date(),
                createdBy: currentUser._id,
            });

            return true;
        },
    });

    // 删除订单中商品
    new ValidatedMethod({
        name: 'Order.methods.deleteProduct',
        validate: null,
        run({ orderId, productId }) {
            const self = this;

            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentOrder = Collections.Order.findOne(orderId);
            const currentUser = Meteor.users.findOne(currentOrder.seller);

            if (currentOrder.isSettled) {
                throw new Meteor.Error('已经结算，无法删除');
            }

            const newProduct = [];
            let deleteproduct;
            currentOrder.products.forEach((product) => {
                if (product._id !== productId) {
                    newProduct.push(product);
                } else {
                    deleteproduct = product;
                }
            });

            const prevFee = parseFloat((currentOrder.prevFee - deleteproduct.price * deleteproduct.amount).toFixed(2));
            let needPay = parseFloat((currentOrder.needPay - deleteproduct.price * deleteproduct.amount).toFixed(2));
            if (needPay < 0) {
                needPay = 0;
            }
            const total = needPay;

            const changeBalance = currentOrder.total - total;

            Collections.Order.update(currentOrder._id, {
                $set: {
                    prevFee,
                    needPay,
                    total,
                    products: newProduct,
                },
            });
            if (changeBalance) {
                Collections.RefundLog.insert({
                    id: currentOrder.no,
                    out_trade_no: currentOrder.out_trade_no,
                    remark: '部分退款',
                    status: '待审核',
                    fee: currentOrder.total,
                    userId: currentUser._id,
                    createdBy: currentUser._id,
                    createdAt: new Date(),
                });
            }

            return true;
        },
    });

    // 订单管理更改运单号
    new ValidatedMethod({
        name: 'Order.methods.updateShipNumber',
        validate: null,
        run(obj) {
            Collections.Order.update(obj.nowId, {
                $set: { transferNo: obj.transferNo, transferCompany: obj.transferCompany },
            });
            return true;
        },
    });

    // 更改订单的价格
    new ValidatedMethod({
        name: 'Order.methods.updatePrice',
        validate: null,
        run(obj) {
            Collections.Order.update(obj.nowId, {
                $set: { needPay: obj.nowPrice },
            });
            return true;
        },
    });

    // 更改订单的代理价格
    new ValidatedMethod({
        name: 'Order.methods.updateAgentPrice',
        validate: null,
        run(obj) {
            Collections.Order.update(obj.nowId, {
                $set: { agentPrice: obj.nowPrice },
            });
            return true;
        },
    });
    // 更改国内物流号
    new ValidatedMethod({
        name: 'Order.methods.updateCivilNo',
        validate: null,
        run(obj) {
            Collections.Order.update(obj.nowId, {
                $set: { trackingNo: obj.trackingNo, expressCompany: obj.expressCompany },
            });
            return true;
        },
    });

    // 获取最近七天交易额
    new ValidatedMethod({
        name: 'Order.methods.getSevenDayOrder',
        validate: null,
        run() {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentUser = Meteor.users.findOne(self.userId);

            let total = 0;
            Collections.Order.find({
                seller: currentUser._id,
                isRemoved: { $ne: true },
                status: {
                    $ne: '已取消',
                },
                createdAt: {
                    $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 7),
                },
            }).forEach((order) => {
                total += order.total;
            });

            return total;
        },
    });

    // 获取待结算金额
    new ValidatedMethod({
        name: 'Order.methods.getPreSettleOrderFee',
        validate: null,
        run() {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentUser = Meteor.users.findOne(self.userId);

            let total = 0;
            if (currentUser.status.indexOf(2) !== -1) {
                // 代理
                Collections.Order.find({
                    seller: currentUser.saleAgent[0],
                    saleAgentId: currentUser.unionid,
                    total: {
                        $gt: 0,
                    },
                    isSettled: {
                        $ne: true,
                    },
                    status: {
                        $ne: '已取消',
                    },
                    isRemoved: { $ne: true },
                }).forEach((order) => {
                    if (!order.agentPrice) order.agentPrice = 0;
                    total += order.total - order.agentPrice;
                });
            } else {
                Collections.Order.find({
                    seller: currentUser._id,
                    total: {
                        $gt: 0,
                    },
                    isSettled: {
                        $ne: true,
                    },
                    status: {
                        $ne: '已取消',
                    },
                    isRemoved: { $ne: true },
                }).forEach((order) => {
                    if (order.agentPrice) {
                        total += order.agentPrice;
                    } else {
                        total += order.total;
                    }
                });
            }
            return total;
        },
    });
};
