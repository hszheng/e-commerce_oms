import { Mongo } from 'meteor/mongo';
const UserLog = new Mongo.Collection('UserLog');
/**
 * 数据结构
 * @type {SimpleSchema}
 */
UserLog.schema = new SimpleSchema({
    type: {
        label: '类型',
        type: String,
    },
    id: {
        label: '订单号',
        type: String,
    },
    out_trade_no: {
        label: '商户订单号',
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
});
UserLog.attachSchema(UserLog.schema);

export default UserLog;
