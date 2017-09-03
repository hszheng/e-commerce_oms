import Collections from '/lib';

export default () => {
    // 插入提现交易记录
    new ValidatedMethod({
        name: 'Withdraw.methods.insert',
        validate: null,
        run({ amount, category, username, account }) {
            const self = this;
            if (!self.userId) {
                throw new Meteor.Error('用户未登录');
            }

            const currentUser = Meteor.users.findOne(self.userId);
            const balance = parseFloat((currentUser.withdrawAmount - amount).toFixed(2));

            Collections.Withdraw.insert({
                type: '提现',
                status: '待审核',
                amount,
                commissionFee: 0,
                changeBalance: -amount,
                balance,
                preBalance: currentUser.withdrawAmount,
                userId: currentUser._id,
                createdBy: currentUser._id,
                createdAt: new Date(),
                category,
                username,
                account,
            });

            Meteor.users.update(currentUser._id, {
                $set:{
                    withdrawAmount : balance,
                }
            });
            return true;
        },
    });
};
