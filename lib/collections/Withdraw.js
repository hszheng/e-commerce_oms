
import { Mongo } from 'meteor/mongo';

const Withdraw = new Mongo.Collection('Withdraw');

/**
 * 可提现金额变动记录
 * @type {SimpleSchema}
 */
Withdraw.schema = new SimpleSchema({
    type: {
        label: '类型',
        type: String,
    },
    id: {
        label: '订单号',
        type: String,
        optional: true,
    },
    remark: {
        label: '备注',
        type: String,
        optional: true,
    },
    status: {
        label: '状态',
        type: String,
        defaultValue: '已完成',
        optional: true,
    },
    amount: {
        label: '金额',
        decimal: true,
        type: Number,
    },
    commissionFee: {
        label: '手续费',
        type: Number,
        decimal: true,
    },
    changeBalance: {
        label: '改变金额',
        type: Number,
        decimal: true,
    },
    balance: {
        label: '当前余额',
        type: Number,
        decimal: true,
    },
    preBalance: {
        label: '之前余额',
        type: Number,
        decimal: true,
    },
    userId: {
        label: '用户userId',
        type: String,
    },
    createdBy: {
        label: '创建人',
        type: String,
    },
    createdAt: {
        label: '创建时间',
        type: Date,
    },
    category: {
        label: '账户类型',
        optional: true,
        type: String,
    },
    username: {
        label: '账户名',
        optional: true,
        type: String,
    },
    account: {
        label: '账号',
        optional: true,
        type: String,
    },
});
Withdraw.attachSchema(Withdraw.schema);

export default Withdraw;
