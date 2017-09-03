import { Meteor } from 'meteor/meteor';

export default () => {
	// 更新用户信息
    new ValidatedMethod({
        name: 'User.methods.updateUserInfo',
        validate: null,
        run(data) {
            // console.log('data', data);
            Meteor.users.update(this.userId, {
                $set: data,
            });
            return true;
        },
    });
    // 更新代理信息
    new ValidatedMethod({
        name: 'User.methods.updateNewUserInfo',
        validate: null,
        run(data) {
            const self = this;
            // console.log('userId', self.userId);
            if (!self.userId) {
                throw new Meteor.Error('ACCOUNTS_ERROR', '用户未登录');
            }            
            if(data.isAgent) {
                const buyer = Meteor.users.findOne({ id: data.id });
                const agent = Meteor.users.findOne(self.userId);
                if (!buyer) {
                    throw new Meteor.Error('找不到该用户');
                }
                const saleAgent = agent.saleAgent || [];
                saleAgent.push(buyer._id);
                data.obj.saleAgent = saleAgent;
                data.obj.status = agent.status || [];
                if (data.obj.status.indexOf(2) === -1) {
                    data.obj.status.push(2);
                }
                Meteor.users.update(self.userId, {
                    $set: data.obj,
                });
                return true;
            }
            // // console.log(data.obj);
            data.obj.status
            const buyer = Meteor.users.findOne(self.userId);
            const status = buyer.status;
            status.push(0);
            data.obj.status = status;
            Meteor.users.update(self.userId , {
                $set: data.obj
            });
           return true;
        },
    });
    // 根据用户ID 查询用户信息
    new ValidatedMethod({
        name: 'User.methods.getInfoById',
        validate: null,
        run(id) {
            const self = this;
            const { userId } = self;
            new SimpleSchema({
                userId: { type: String },
            }).validate({ userId });
            return Meteor.users.findOne(id);
        },
    });

    // 根据inviteId及限定条件获取我的代理及数量
    new ValidatedMethod({
        name: 'User.methods.getMyAgentList',
        validate: null,
        run(data) {
            const agentList = Meteor.users.find(data.selector, data.options).fetch();
            const count = Meteor.users.find(data.selector).count();
            return {
                agentList,
                count
            }

        },
    });

    // 修改邀请人ID
    new ValidatedMethod({
        name: 'Users.methods.updateInviteId',
        validate: new SimpleSchema({
            inviteId: {
                type: String,
            },
        }).validator(),
        run({ inviteId }) {
            const self = this;
            const invite = Meteor.users.findOne(inviteId);
            const user = Meteor.users.findOne(self.userId);

            if (!self.userId) {
                return;
            }

            if (user.inviteId) {
                return;
            }

            if (!invite) {
                return;
            }

            Meteor.users.update(self.userId, { $set: { inviteId } });
        },
    });

    // 获取买手审核的状态
    new ValidatedMethod({
        name: 'Users.methods.getVerifyStatus',
        validate: null,
        run({ userId }) {
            const self = this;
            return Meteor.users.findOne({ _id: userId });
        },
    });
};
