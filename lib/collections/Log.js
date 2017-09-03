import { Mongo } from 'meteor/mongo';
const Log = new Mongo.Collection('Log');
/**
 * 数据结构
 * @type {SimpleSchema}
 */
Log.schema = new SimpleSchema({
    type: {
        label: '支付',
        type: String,
    },
    totalMoney: {
        label: '总价钱',
        type: Number,
    },
    timestamp: {
        label: '时间戳',
        type: Number,
    },
});
Log.attachSchema(Log.schema);

export default Log;
