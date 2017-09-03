import { Mongo } from 'meteor/mongo';
const RefundLog = new Mongo.Collection('RefundLog');
/**
 * 数据结构
 * @type {SimpleSchema}
 */
RefundLog.schema = new SimpleSchema({
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
    },
    fee: {
        label: '退款金额',
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
RefundLog.attachSchema(RefundLog.schema);

export default RefundLog;
