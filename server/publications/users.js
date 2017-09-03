import { Meteor } from 'meteor/meteor';
import Collections from '/lib';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default () => {
    // publish当前用户信息
    Meteor.publish(null, function () {
        const self = this;
        const userId = self.userId;

        try {
            new SimpleSchema({
                userId: { type: String },
            }).validate({ userId });
        } catch (e) {
            self.ready();
        }
        return Meteor.users.find(userId, {
            fields: {
                // openid: 1,
                // wechat: 1,
                // realName: 1,
                // phone: 1,
                // email: 1,
                // nickname: 1,
                // totalTurnover: 1,
                // turnoverLastSevenDays: 1,
                // withdrawAmount: 1,
                // storeName: 1,
                // storeLevel: 1,
                // storeBanner: 1,
                // storeDesc: 1,
                // inviteId: 1,
                // order: 1,
                // awardProp: 1,
                // joinDate: 1,
            },
        });
    });

    // 根据inviteId及限定条件获取我的代理及数量
    Meteor.publish('User.getMyAgentCount', function (selector) {
        const self = this;
        Counts.publish(this, 'agentCount', Meteor.users.find(selector));
    });

    // 根据inviteId及限定条件获取我的代理及数量
    Meteor.publish('User.getMyAgentList', function (data) {
        const self = this;
        return Meteor.users.find(data.selector, data.options);
    });
    Meteor.publishComposite('User.getAgentOrderList', function (data) {
        const self = this;
        return {
            find() {
                console.log(data);
                return Meteor.users.find(data.selector, data.options);
            },
            children: [
                {
                    find(agent) {
                        if (data.selector.saleAgent) {
                            return Collections.Order.find({saleAgentId: agent.unionid, seller: self.userId});
                        } else {
                            return Collections.Order.find({agentId: agent.unionid, seller: self.userId});
                        }
                    },
                },
            ],
        };
    });

};
