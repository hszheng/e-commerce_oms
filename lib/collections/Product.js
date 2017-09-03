import { Mongo } from 'meteor/mongo';

const Product = new Mongo.Collection('Product');

/**
 * 商品信息
 * @type {SimpleSchema}
 */
Product.schema = new SimpleSchema({
    category: {
        label: '类别',
        type: String,
    },
    subCategory: {
        label: '子类别',
        type: String,
    },
    name: {
        label: '名称',
        type: String,
    },
    price: {
        label: '价格',
        type: Number,
    },
    disaccountPrice: {
        label: '折扣价',
        type: Number,
    },
    overseasPrice: {
        label: '国外价格',
        type: Number,
    },
    overseasPriceUrl: {
        label: '国外价格地址',
        type: String,
    },
    civilPrice: {
        label: '国内价格',
        type: Number,
    },
    civilPriceUrl: {
        label: '国内价格地址',
        type: String,
    },
    validityStartDate: {
        label: '有效开始时间',
        type: String,
    },
    validityEndDate: {
        label: '有效结束时间',
        type: String,
    },
    description: {
        label: '描述',
        type: String,
    },
    detail: {
        label: '详细参数',
        type: Object,
        blackbox: true,
    },
    banners: {
        label: 'Banners',
        type: [String],
    },
    descImage: {
        label: '详情图',
        type: [String],
    },
    journalImage: {
        label: '期刊主图',
        type: String,
    },
    wechatImage: {
        label: '微信主图',
        type: String,
    },
    fare: {
        label: '运费',
        type: Number,
    },
    tariff: {
        label: '关税',
        type: Number,
    },
    remark: {
        label: '备注',
        type: String,
    },
    publisher: {
        label: '发布者',
        type: Number,
        allowedValues: [0, 1],
    },
    journalId: {
        label: '期刊ID',
        type: String,
    },
    shelf: {
        label: '是否上架',
        type: Boolean,
    },
    createdAt: {
        label: '创建时间',
        type: Date,
        defaultValue: new Date(),
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
// Product.attachSchema(Product.schema);

export default Product;
