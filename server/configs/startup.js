import Collections from '/lib';
import { CronJob } from 'cron';
import Fiber from 'fibers';

export default () => {
    Meteor.startup(() => {
        // 初始化cdn

        // WebAppInternals.setBundledJsCssPrefix('http://www.taoerwan.com');
        
        // Kadira监控
        // Kadira.connect('bnKAj4KPAoJHmNNDu', '4a061523-e3cb-4cc5-93b5-90b67e47c3de');

        // 定时任务
        new CronJob({
            cronTime: '0 0 0 * * *',
            onTick: function() {
                Fiber(function () {
                    Collections.Product.find({
                        $or: [
                            {
                                disaccountPrice: {$gt: 0},
                            }, {
                                disaccountPriceValidate: {
                                    $exists: true, 
                                    $ne: '',
                                }
                            }
                        ]}).forEach((product) => {
                        if (!(+new Date(product.disaccountPriceValidate) >= Date.now())) {
                            Collections.Product.update(product._id, {
                                $set: {
                                    disaccountPrice: 0,
                                    disaccountPriceValidate: '',
                                },
                            });
                        }
                    });
                }).run();
            },
            start: true,
        });

        if (!Meteor.users.findOne({ username: 'admin' })) {
            // 如果没有管理员，则创建一个管理员

            Roles.addUsersToRoles(Accounts.createUser({
                username: 'admin',
                password: 'admin',
            }), 'admin');
        }

        // 初始化用户注册信息
        Accounts.onCreateUser((options, user) => {
            const GetUniqueId = () => {
                const id = _.random(100000, 999999);
                if (!Meteor.users.findOne({ id })) {
                    return id;
                }
                return GetUniqueId();
            };

            if (user.services.wechat) {
                // 微信登录
                user.status = [1];
                user.pc_openid = user.services.wechat.openid;
                user.unionid = user.services.wechat.unionid;
                user.phone = '';
                user.email = '';
                user.qq = ''; // QQ
                user.id = GetUniqueId();
                user.nickname = user.services.wechat.nickname;
                user.totalTurnover = 0;
                user.withdrawAmount = 0;
                user.storeName = '';
                user.storeLevel = 0;
                user.storeBanner = '';
                user.storeDesc = '';
                user.inviteId = '';
                user.firstName = ''; // 姓
                user.lastName = ''; // 名
                user.country = ''; // 国家
                user.state = ''; // 州
                user.city = '';
                user.address1 = ''; // 详细地址1
                user.address2 = ''; // 详细地址2
                user.zipCode = ''; // 邮编
                user.photo = ''; // 个人近照
                user.IDType = 0; // 身份证件类型；0：所在国驾照；1：护照签证页；2：绿卡／护照；
                user.IDFront = '';// 证件正面
                user.IDBack = ''; // 证件背面
                user.proofOfResidenceType = 0; // 居住证明；0：水电煤账单；1：房屋租约；2：银行对账单；
                user.proofOfResidence = ''; // 居住证明图片
                user.step = 0;// 步骤；0：未填写基础信息；1：未手机邮箱认证；2：等待审核；3：审核失败；4：审核通过；
                user.createdAt = new Date(); // 创建日期
                user.agentBuyer = []; // 代理买手
                user.saleAgent = [];
                user.viewCount = 0;
                user.shareCount = {};
            }
            return user;
        });
        
    });
};
