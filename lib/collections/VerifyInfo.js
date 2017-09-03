import { Mongo } from 'meteor/mongo';

const VerifyInfo = new Mongo.Collection('VerifyInfo');

/**
 * 认证信息
 *
 * @type {SimpleSchema}
 */
VerifyInfo.schema = new SimpleSchema({
    firstName: {
        label: '姓',
        type: String,
        defaultValue: '',
    },
    lastName: {
        label: '名',
        type: String,
        defaultValue: '',
    },
    country: {
        label: '国家',
        type: String,
        defaultValue: '',
    },
    state: {
        label: '州',
        type: String,
        defaultValue: '',
    },
    address1: {
        label: '详细地址1',
        type: String,
        defaultValue: '',
    },
    address2: {
        label: '详细地址2',
        type: String,
        defaultValue: '',
    },
    zipCode: {
        label: '邮编',
        type: String,
        defaultValue: '',
    },
    photo: {
        label: '个人近照',
        type: String,
        defaultValue: '',
    },
    IDType: {
        label: '身份证件类型',
        type: String,
        defaultValue: '',
    },
    IDFront: {
        label: '证件正面',
        type: String,
        defaultValue: '',
    },
    IDBack: {
        label: '证件背面',
        type: String,
        defaultValue: '',
    },
    IDValidateStart: {
        label: '证件有效期起始日期',
        type: String,
        defaultValue: '',
    },
    IDValidateEnd: {
        label: '证件有效期失效日期',
        type: String,
        defaultValue: '',
    },
    proofOfResidenceType: {
        label: '居住证明',
        type: String,
        defaultValue: '',
    },
    proofOfResidence: {
        label: '居住证明图片',
        type: String,
        defaultValue: '',
    },
    qq: {
        label: 'QQ',
        type: String,
        defaultValue: '',
    },
    phone: {
        label: '手机',
        type: String,
        defaultValue: '',
    },
    email: {
        label: '邮箱',
        type: String,
        defaultValue: '',
    },
    step: {
        label: '步骤',
        type: Number,
        allowedValues: [0, 1, 2, 3, 4],
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
VerifyInfo.attachSchema(VerifyInfo.schema);

export default VerifyInfo;
