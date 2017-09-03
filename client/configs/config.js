/**
 * 服务端host
 *
 * @type { String}
 */
// const HOST = 'http://www.taoerwan.com';

// const HOST = 'http://test.xuuue.cn:4000';

const HOST = 'http://localhost:4000';
/**
 * 消费者端host
 *
 * @type { String}
 */

const WECHAT_HOST = 'http://www.taoerwan.cn';
// const WECHAT_HOST = 'http://test.taoerwan.com:4000';
// const WECHAT_HOST = 'http://wechat.xuuue.cn';
// const WECHAT_HOST = 'http://test.xuuue.cn';
// const WECHAT_HOST = 'http://192.168.1.88:8000';

/**
 * OSS key id
 *
 * @type { String}
 */
const OSS_ACCESS_KEY_ID = 'D4zbM6XZxxjer9iI';

/**
 * OSS key secret
 *
 * @type { String}
 */
const OSS_ACCESS_KEY_SECRET = 'YvRpBWhYg0NZDW7B4VyCakx8lKhd0v';

/**
 * OSS bucket
 *
 * @type { String}
 */
const OSS_BUCKET = 'taoerwan';

/**
 * OSS访问URL
 *
 * @type { String}
 */
const OSS_URL = `https://${OSS_BUCKET}.oss-cn-shenzhen.aliyuncs.com`;

/**
 * OSS原文件HOST
 *
 * @type { String}
 */
const OSS_HOST = 'http://oss-cdn.taoerwan.com';

/**
 * OSS图片处理HOST
 *
 * @type { String}
 */
const OSS_IMG_HOST = 'http://img-cdn.taoerwan.com';

/**
 * OSS图片处理样式分隔符
 *
 * @type { String}
 */
const OSS_IMG_SPLIT = '@!';

/**
 * 图片处理缩略图规则名
 * 最长边100，质量50%
 *
 * @type { String}
 */
const OSS_IMG_100W_100H = `${OSS_IMG_SPLIT}100w_100h`;

/**
 * 身份证图片处理缩略图规则旬
 * 最长边800，质量100%
 * @type { String }
 */
const OSS_IMG_IDCARD = `${OSS_IMG_SPLIT}idcard.png`;

/**
 * 图片处理原图规则名
 *
 * @type { [type]}
 */
const OSS_IMG_ORIGINAL = `${OSS_IMG_SPLIT}800w_800h`;

/**
 * 图片处理原图无水印规则名
 *
 * @type { [type]}
 */
const OSS_IMG_ORIGINALNULL = `${OSS_IMG_SPLIT}800w_800h_null`;

/**
 * OSS上传需要使用的policy属性
 *
 * @type { String}
 */
const OSS_POLICY = 'ewoiZXhwaXJhdGlvbiI6ICIyMTIwLTAxLTAxVDEyOjAwOjAwLjAwMFoiLAoiY29uZGl0aW9ucyI6IFsKWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsIDAsIDEwNDg1NzYwMF0KXQp9Cg==';

/**
 * OSS上传需要的Signature属性
 *
 * @type { String}
 */
const OSS_SIGNATURE = 'Xk3D0iCms2dhVk7bapsMHb7qxZQ=';

const BANKS = [
    {
        name: '微信',
    },
    // {
    //     name: '支付宝',
    // },
    // {
    //     name: '中国工商银行',
    // }, {
    //     name: '中国农业银行',
    // }, {
    //     name: '国有商业银行',
    // }, {
    //     name: '中国银行',
    // }, {
    //     name: '中国建设银行',
    // }, {
    //     name: '交通银行',
    // }, {
    //     name: '中信银行',
    // }, {
    //     name: '中国光大银行',
    // }, {
    //     name: '中国民生银行',
    // }, {
    //     name: '招商银行',
    // }, {
    //     name: '兴业银行',
    // }, {
    //     name: '广发银行',
    // }, {
    //     name: '平安银行',
    // }, {
    //     name: '上海浦东发展银行',
    // }, {
    //     name: '恒丰银行',
    // }, {
    //     name: '中国邮政储蓄银行',
    // }, {
    //     name: '邮政储蓄银行',
    // },
    ];

const STATES = [
    { name: '亚拉巴马州' },
    { name: '阿拉斯加州' },
    { name: '亚利桑那州' },
    { name: '阿肯色州' },
    { name: '加利福尼亚州' },
    { name: '科罗拉多州' },
    { name: '康涅狄格州' },
    { name: '特拉华州' },
    { name: '佛罗里达州' },
    { name: '佐治亚州' },
    { name: '夏威夷州' },
    { name: '爱达荷州' },
    { name: '伊利诺伊州' },
    { name: '印第安纳州' },
    { name: '艾奥瓦州' },
    { name: '堪萨斯州' },
    { name: '肯塔基州' },
    { name: '路易斯安那州' },
    { name: '缅因州' },
    { name: '马里兰州' },
    { name: '马萨诸塞州' },
    { name: '密歇根州' },
    { name: '明尼苏达州' },
    { name: '密西西比州' },
    { name: '密苏里州' },
    { name: '蒙大拿州' },
    { name: '内布拉斯加州' },
    { name: '内华达州' },
    { name: '新罕布什尔州' },
    { name: '新泽西州' },
    { name: '新墨西哥州' },
    { name: '纽约州' },
    { name: '北卡罗来纳州' },
    { name: '北达科他州' },
    { name: '俄亥俄州' },
    { name: '俄克拉荷马州' },
    { name: '俄勒冈州' },
    { name: '宾夕法尼亚州' },
    { name: '罗得岛州' },
    { name: '南卡罗来纳州' },
    { name: '南达科他州' },
    { name: '田纳西州' },
    { name: '德克萨斯州' },
    { name: '犹他州' },
    { name: '佛蒙特州' },
    { name: '弗吉尼亚州' },
    { name: '华盛顿州' },
    { name: '西弗吉尼亚州' },
    { name: '威斯康星州' },
    { name: '怀俄明州' }];

export default {
    HOST,
    WECHAT_HOST,
    OSS_ACCESS_KEY_ID,
    OSS_ACCESS_KEY_SECRET,
    OSS_URL,
    OSS_HOST,
    OSS_IMG_HOST,
    OSS_IMG_100W_100H,
    OSS_IMG_IDCARD,
    OSS_IMG_ORIGINAL,
    OSS_IMG_ORIGINALNULL,
    OSS_POLICY,
    OSS_SIGNATURE,
    STATES,
    BANKS,
};
