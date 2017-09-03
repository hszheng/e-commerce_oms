'use strict';

import { Mongo } from 'meteor/mongo';

const Order = new Mongo.Collection('Order');

/**
 * 订单
 * @type {SimpleSchema}
 */
Order.schema = new SimpleSchema({
    no: {
        label: '订单号',
        type: String,
    },
    openid: {
        label: '买家openid',
        type: String,
    },
    consignee: {
        label: '收货人',
        type: String,
        defaultValue: '',
    },
    IDCard: {
        label: '身份证号码',
        type: String,
        defaultValue: '',
    },
    phone: {
        label: '手机号码',
        type: String,
        defaultValue: '',
    },
    address: {
        label: '详细地址',
        type: String,
        defaultValue: '',
    },
    consumerPhone: {
        label: '买家手机号码',
        type: String,
        defaultValue: '',
    },
    products: {
        label: '商品明细',
        type: [Object],
        blackbox: true,
    },
    sum: {
        label: '总数',
        type: Number,
    },
    total: {
        label: '合计',
        type: Number,
    },
    agentFee: {
        label: '代理提成',
        type: Number,
        defaultValue: 0,
    },
    agentId: {
        label: '代理ID',
        type: String,
        defaultValue: '',
    },
    serviceFee: {
        label: '淘二万服务费',
        type: Number,
        defaultValue: 0,
    },
    artualTotal: {
        label: '实收金额',
        type: Number,
        defaultValue: 0,
    },
    remark: {
        label: '备注',
        type: String,
        defaultValue: '',
    },
    transferCompany: {
        label: '转运公司',
        type: String,
        defaultValue: '',
    },
    transferNo: {
        label: '转运单号',
        type: String,
        defaultValue: '',
    },
    expressCompany: {
        label: '国内快递公司',
        type: String,
        defaultValue: '',
    },
    trackingNo: {
        label: '国内快递单号',
        type: String,
        defaultValue: '',
    },
    status: {
        label: '状态',
        type: String,
        defaultValue: '',
    },
    createdAt: {
        label: '创建时间',
        type: Date,
        defaultValue: new Date(),
    },
    createdBy: {
        label: '创建人',
        type: String,
        defaultValue: '',
    },
    isRemoved: {
        label: '是否已删除',
        type: Boolean,
        defaultValue: false,
    },
});
// Order.attachSchema(Order.schema);

export default Order;
