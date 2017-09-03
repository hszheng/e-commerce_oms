import Configuration from '../configs/config';

export default () => {
    // 发送短信
    new ValidatedMethod({
        name: 'sendSMS',
        validate: null,
        run({ areaCode, mobile, msg }) {
            const self = this;

            self.unblock();

            if (!areaCode) {
                // 默认中国区码
                areaCode = '86';
            }
            const sync = Meteor.wrapAsync(sendSMSAsync);
            const result = sync(areaCode, mobile, msg);

            return result;
        },
    });
};

/**
 * 发送短信
 *
 * @param  {String}   areaCode 区码
 * @param  {String}   phone    手机号码
 * @param  {String}   msg      短信内容
 * @param  {Function} callback 回调函数
 *
 * @return {Void}
 *
 * @author Vincent Zheng
 */
const sendSMSAsync = (areaCode, mobile, msg, callback) => {
    let url = 'http://222.73.117.140:8044/mt';
    let account = Configuration.SMS_INT_ACCOUNT;
    let pswd = Configuration.SMS_INT_PSWD;
    let params = { // 默认国际
        dc: 15,
        sm: msg,
        da: `1${mobile}`,
        rd: 1,
        un: account,
        pw: pswd,
        rf: 2,
        tf: 3,
    };
    // 国内使用国内账号，国际使用国际账号
    switch (areaCode) {
    case '1':
        url = 'http://222.73.117.140:8044/mt';
        // params.da = `1${mobile}`;
        break;
    case '86':
        url = 'http://120.26.69.248/msg/HttpBatchSendSM';
        account = Configuration.SMS_ACCOUNT;
        pswd = Configuration.SMS_PSWD;
        params = {
                account,
                pswd,
                mobile,
                msg,
                needstatus: true,
            };
        break;
    default:
        // url = 'http://120.26.69.248/msg/HttpBatchSendSM';
        // account = Configuration.SMS_ACCOUNT;
        // pswd = Configuration.SMS_PSWD;
        // params = {
        //         account,
        //         pswd,
        //         mobile,
        //         msg,
        //         needstatus: true,
        // };
        break;
    }
    HTTP.get(url, { params }, (error, result) => {
        if (result && result.content && (result.content.split('\n')[0].split(',')[1] === '0' || result.content.indexOf('true') !== -1)) {
            return callback(null, true);
        }
        return callback(null, false);
    });
};
