
import { Mongo } from 'meteor/mongo';

const Journal = new Mongo.Collection('Journal');

/**
 * 期刊
 * @type {SimpleSchema}
 */
Journal.schema = new SimpleSchema({
    name: {
        label: '期刊名称',
        type: String,
    },
    description: {
        label: '描述',
        type: String,
    },
    views: {
        label: '浏览量',
        type: Number,
        defaultValue: 0,
    },
    categories: {
        label: '设计商品',
        type: [String],
    },
    productImages: {
        label: '微信8张图片地址',
        type: [String],
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
Journal.attachSchema(Journal.schema);

export default Journal;
