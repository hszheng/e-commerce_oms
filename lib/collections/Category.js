import { Mongo } from 'meteor/mongo';

const Category = new Mongo.Collection('Category');

/**
 * 我的帐户
 *
 * @type {SimpleSchema}
 */
Category.schema = new SimpleSchema({
    name: {
        label: '名称',
        type: String,
    },
    subs: {
        label: '子类别',
        type: [String],
        defaultValue: [],
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
Category.attachSchema(Category.schema);

export default Category;
