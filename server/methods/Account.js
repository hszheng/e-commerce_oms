/**
 *
 * 账户表增删改查
 *
 * @author Vincent Zheng
 */

import Collections from '/lib';

export default () => {
	// 新增账户表
    new ValidatedMethod({
        name: 'Account.methods.insert',
        validate: null,
        run(data) {
            const self = this;
            data.createdAt = new Date();
            data.isRemoved = false;
            data.createdBy = self.userId;
            Collections.Account.insert(data);
            return Collections.Account.findOne({ sort: { createdAt: -1 } });
        },
    });
	// 查找我的账户
    new ValidatedMethod({
        name: 'Account.methods.find',
        validate: null,
        run() {
            const userId = this.userId;
            return Collections.Account.find({ createdBy: userId, isRemoved: { $ne: true } }).fetch();
        },
    });
	// 删除我的账户
    new ValidatedMethod({
        name: 'Account.methods.update',
        validate: null,
        run(id) {
            Collections.Account.update(id, { $set: { isRemoved: true } });
            return true;
        },
    });

    new ValidatedMethod({
        name: 'Account.methods.getApplyInfo',
        validate: new SimpleSchema({
            userId: {
                type: String,
            },
        }).validator(),
        run(data) {
            const applyInfo = {};
            const user = Meteor.users.findOne({ _id: data.userId });
            const accountInfo = Collections.Account.findOne({ createdBy: data.userId });
            applyInfo.withdrawAmount = user.withdrawAmount;
            applyInfo.realName = user.realName;
            applyInfo.category = accountInfo.category;
            applyInfo.account = accountInfo.account;
            applyInfo.username = accountInfo.username;
            return applyInfo;
        },
    });
};
