import { Mongo } from 'meteor/mongo';

const Logistics = new Mongo.Collection('Logistics');

/**
 * 物流信息
 * @type {SimpleSchema}
 */
Logistics.schema = new SimpleSchema({
    orderNo: {
        label: '订单号',
        type: String,
    },
    orderId: {
        label: '订单id',
        type: String,
    },
    status: {
        label: '状态',
        type: String,
    },
    createdAt: {
        label: '创建时间',
        type: Date,
    },
    createdBy: {
        label: '创建人',
        type: String,
    },
    isRemoved: {
        label: '是否已删除',
        type: Boolean,
        defaultValue: false,
    },
});
Logistics.attachSchema(Logistics.schema);

export default Logistics;
