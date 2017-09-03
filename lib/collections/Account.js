
import { Mongo } from 'meteor/mongo';

const Account = new Mongo.Collection('Account');

/**
 * 我的帐户
 * @type {SimpleSchema}
 */
Account.schema = new SimpleSchema({
    category: {
        label: '账户类型',
        type: String,
        optional: true
    },
    username: {
        label: '账户名',
        type: String,
    },
    account: {
        label: '账号',
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
Account.attachSchema(Account.schema);

export default Account;
