/**
 *
 * 认证信息
 *
 * @author Vincent Zheng
 *
 */

import Collections from '/lib';

export default () => {
    // 修改认证信息
    new ValidatedMethod({
        name: 'VerifyInfo.methods.update',
        validate: null,
        run(data) {
            const self = this;

            if (!self.userId) {
                throw new Meteor.Error('ACCOUNTS_ERROR', '用户未登录');
            }

            const status = Meteor.users.findOne({ _id: self.userId }).status;
            status.push(0,1);
            // console.log(status);
            data.status = status;
            Meteor.users.update({ _id: self.userId }, { $set: data });
            return true;
        },
    });
    
    new ValidatedMethod({
        name: 'VerifyInfo.methods.getStep',
        validate: null,
        run(data) {
            const self = this;

            if (!self.userId) {
                throw new Meteor.Error('ACCOUNTS_ERROR', '用户未登录');
            }
            const verifyInfo = Meteor.users.findOne({ _id: self.userId });
            return verifyInfo.step;
        },
    });

    new ValidatedMethod({
        name: 'VerifyInfo.methods.step2',
        validate: null,
        run(data) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('ACCOUNTS_ERROR', '用户未登录');
            }
           return Meteor.users.update({ _id: data.userId }, { $set: data.modifier });
           // return Collections.VerifyInfo.update({createdBy: data.userId},{$set:data.modifier});
        },
    });
};
