#Meteor Demo

#文件结构以及意义

Meteor+Mantra+React+React Router

ant-design 主色系修改
/node_modules/antd/lib/style/themes/default.less
修改为如下
@primary-color          : #60BE29;
@info-color             : #60BE29;

meteorDemo
    |---client                          保存客户端加载的资源。
    |     |---configs                   保存配置文件。
    |     |     |---context.js          context配置文件。
    |     |
    |     |---modules                   所有模块。
    |     |     |---core                核心模块。
    |     |         |---actions         业务逻辑。
    |     |         |---components      组件。
    |     |         |---configs         模块的配置信息。
    |     |         |---containers      容器。
    |     |         |---lib             第三方库。
    |     |         |---index.js        模块的入口。
    |     |         |---routes.jsx      前端Route。
    |     |
    |     |---main.js                   客户端入口。
    |
    |---lib                             保存Collections。
    |     |---collections               保存所有Collections文件。
    |     |---index.js                  lib入口。
    |
    |---node_modules                    保存npm安装的包。
    |---public                          保存所有的公有资源，不会默认加载到前端，通过路径访问。
    |---server                          保存服务端使用的所有资源。
    |     |---configs                   保存服务端的配置文件。
    |     |---lib                       保存服务端使用的第三方资源。
    |     |---methods                   保存服务端所有的methods文件。
    |     |      |---index.js           methods入口。
    |     |
    |     |---permission                设置collections的权限。
    |     |      |---index.js           permission入口。
    |     |      |---users.js           用户信息的权限设置。
    |     |
    |     |---publications              collections数据publish规则。
    |     |      |---index.js           publications入口。
    |     |
    |     |---restapi                   保存服务端所有的接口文件。
    |     |      |---restapi.js         服务端所有的接口。
    |     |
    |     |---main.js                   服务端入口。
    |
    |---packages.json                   设置项目依赖的npm安装的packages。

/**
 * 以下是淘二万的数据结构
 */

// 用户信息
// Meteor.users
{
    unionid: 'unionid', // 微信unionid
    pc_openid: 'openid', // 开放平台openid
    mb_openid: 'openid', // 公众平台openid
    phone: '13666666666', // 手机号码
    email: 'test@xuuue.cn', // 邮箱
    qq: '123', // QQ
    nickname: '小淘淘', // 昵称
    totalTurnover: 20000, // 总交易额
    withdrawAmount: 20000, // 可提现金额
    storeName: '小代购', // 店铺名称
    storeLevel: 0, // 店铺等级，0：一级钻石
    storeBanner: 'http://baidu.com/a.jpg', // 店铺封面
    storeDesc: '这是一个不错的代购店', // 店铺简介
    firstName: 'Sven', // 姓
    lastName: 'Wang', // 名
    zipCode: '111111', // 邮编
    country: 'USA', // 国家
    state: '', // 州
    address1: 'xxx', // 详细地址1
    address2: 'xxx', // 详细地址2
    photo: 'http://www.baidu.com', // 个人近照
    IDType: 0, // 身份证件类型；0：所在国驾照；1：护照签证页；2：绿卡／护照；
    IDFront: 'http://www.baidu.com', // 证件正面
    IDBack: 'http://www.baidu.com', // 证件背面
    proofOfResidenceType: 0, // 居住证明；0：水电煤账单；1：房屋租约；2：银行对账单；
    proofOfResidence: 'http://www.baidu.com', // 居住证明图片
    step: 0, // 步骤；0：未填写基础信息；1：未手机邮箱认证；2：等待审核；3：审核失败；4：审核通过；
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    remark: '', //审核失败的后台填写的一些失败原因
    viewCount: 100, // 商城浏览量
    shareCount: {'o667YwN2YQRMJ_5GBGPoGrdXhP1E': 5}, // 分享商城次数
    agentBuyer: ['o667YwN2YQRMJ_5GBGPoGrdXhP1E', 'o667YwN2YQRMJ_5GBGPoGrdXhP1E'], // 推广代理, 存放下线的unionid
    inviteId: 'o667YwN2YQRMJ_5GBGPoGrdXhP1E', // 邀请人
    <!-- 新增字段 -->
    IDCard: '111111111111111111', // 身份证
    id: 232134, // id识别码
    name: 'Sven Wang', // 姓名
    saleAgent: ['a7igi96ffELFS4ju8'], // 销售代理 存放买手的userId
    status: [0, 1, 2, 3], // 0：买手，1：消费者，2：销售代理，3：推广代理
    province: '广东省', // 省份
    city: '广州市', // 城市
    qzone: '番禺区', // 区域 
    qrCode: 'http://www.baidu.com/b.jpg', //客服微信二维码   
}



// 商品信息
// Product
{
    category: '箱包手袋', // 类别，（母婴用品；美容护肤；营养保健；服饰鞋帽；箱包手袋）
    name: 'GNC葡萄籽', //商品名
    price: 35, // 价格
    disaccountPrice: 30, // 折扣价
    disaccountPriceValidate: '2016-02-01', // 折扣价有效期
    overseasPrice: 10, // 国外价格
    overseasPriceUrl: 'http://www.baidu.com', // 国外价格查询地址
    civilPrice: 100, // 国内价格
    civilPriceUrl: 'http://www.baidu.com', // 国内价格查询地址
    description: '这个商品不错哦', // 简介
    surname: '营养品', // 报关名
    brand: 'DR', // 品牌
    detail: { // 详细参数
        factoryName: '东莞', // 厂名
        factoryAddress: '广东省', // 厂址
        manufacturersContact: '88888888', // 美国厂家联系方式
        shelfLife: '10天', // 保质期
        netWeight: '10Kg', // 净含量
        packing: '罐装', // 包装方式
        category: '营养品', // 种类
        brand: 'DR', // 品牌
        series: 'My Heart', // 系列
        origin: '美国', // 产地
        pricing: '按件', // 计价方式
        specification: '10*10', // 规格
        sales: '中国', // 销售地
        use: '美白', // 用途
        model: 'X-100', // 型号
        capacity: '100ml', // 容量
        color: '白色', // 颜色
        size: '41码', // 尺寸
        gender: '男', // 性别
        volume: '10立方米', // 体积
        other: '无', // 其它
        TTM: '2016-01-01', // 上市时间
        material: '木', // 材质
        effect: '美白', // 功效
        approvalNo: 'asdfasdf', // 批准文号
        forSkin: '油性', // 适合肤质
        foodAdditives: '无', // 食品添加剂
        forAge: '10~20岁', // 适用年龄
        forPhase: '早期', // 适用阶段
        storageMethod: '冷藏', // 储藏方法
        taste: '甜', // 口味
        cycle: '一年', // 周期
        no: '123132', // 货号
        useMode: '涂抹在患处', // 使用方式
        features: '耐磨', // 特性
        forPeople: '中年', // 适用人群
        powerSupply: '直充', // 供电方式
        shoeSize: '40码', // 鞋码
        upperHeight: '10cm', // 鞋帮高度
        thickness: '厚', // 厚薄
        length: '10cm', // 长度
    },
    descImage: ['http://www.baidu.com/1.png', 'http://www.baidu.com/2.png'], // 详情描述图
    mainImage: 'http://www.baidu.com/1.png', // 主图
    momentsImage: 'http://www.baidu.com/1.png', // 朋友圈图片
    fare: 100, // 运费，0：包邮
    tariff: 200, // 关税，0：包税
    publisher: 0, // 发布者，0：平台；1：买手
    journalId: '123khjasfdhkajsdfh', // 期刊id，如果有期刊ID，表示只能是这个期刊用，如果期刊ID是空字符串，表示是店铺的商品
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人userId
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
    replaceBuyerId: 'YLkwrRLP37J9ax9Tk', // 代买人userId
    replaceBuyerName: 'gavin代购小店', // 代买人店铺名称
    replaceBuyerPrice: 100, // 代买价格
    <!-- 新增字段 -->
    agentPrice: 10, // 提供给代理的价格
}

// 期刊
// Journal
{
    name: '爆款商品', // 期刊名
    no: 2, // 期刊编号
    description: '这次美国血拼', // 描述
    views: 546, // 浏览次数
    categories: ['箱包手袋', '服饰鞋帽'], // 涉及商品类别
    productImages: ['http://www.baidu.com/1.png', 'http://www.baidu.com/2.png', 'http://www.baidu.com/1.png', 'http://www.baidu.com/2.png', 'http://www.baidu.com/1.png', 'http://www.baidu.com/2.png', 'http://www.baidu.com/1.png', 'http://www.baidu.com/2.png'], // 微信8张图片地址
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人userId
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
}

// 订单
// Order
{
    no: '150504175922002', // 订单号，年月日时分秒三位数字
    unionid: '12asdflalsdkfjlksdfj', // 买家unionid
    consignee: '张三', // 收货人
    IDCard: '500235199001012323', // 身份证号码
    IDCardBack: '', // 身份证背面
    IDCardFront: '', // 身份证正面
    phone: '13666666666', // 手机号码
    address: '广东省广州市石楼镇东环路', // 详细地址
    addressId: 'NAam8u7mRLpFb7hQG', // 地址_id
    addressProvince: '广东省', // 省份
    addressCity: '广州市', // 城市
    addressQzone: '番禺区', // 区域
    addressStreet: '石楼镇东环路', // 街道
    addressPostCode: '510000', // 邮编
    products: [{ // 商品明细
        _id: '123sfajl', // 商品_id
        name: 'GNC葡萄籽', // 商品名称
        image: 'http://www.baidu.com/1.jpg', // 期刊主图
        price: 100, // 价格
        civilPrice: 200, // 国内价格
        amount: 1, // 数量
        brand: 'GNC', // 品牌
        surname: '营养品', // 报关名
        <!-- 新增字段 -->
        agentPrice: 111, // 代理价格
        replaceBuyerId: 'YLkwrRLP37J9ax9Tk', // 代买人userId
        replaceBuyerPrice: 100, // 代买价格
        replaceOrderId: 'YLkwrRLP37J9ax9Tk', // 代买订单_ID
        replaceOrderStatus: '待确定', // 代买订单状态
        transferCompany: '安心转运', // 转运公司
        transferNo: '121123123', // 转运单号
        expressCompany: '申通快递', // 国内快递公司
        trackingNo: '123123132312', // 国内快递单号        
    }, {
        _id: '123sfajl', // 商品_id
        name: 'GNC葡萄籽', // 商品名称
        image: 'http://www.baidu.com/1.jpg', // 期刊主图
        price: 100, // 价格
        civilPrice: 200, // 国内价格
        amount: 1, // 数量
        brand: 'GNC', // 品牌
        surname: '营养品', // 报关名
        <!-- 新增字段 -->
        agentPrice: 111, // 代理价格
        replaceBuyerId: 'YLkwrRLP37J9ax9Tk', // 代买人userId
        replaceBuyerPrice: 100, // 代买价格
        replaceOrderId: 'YLkwrRLP37J9ax9Tk', // 代买订单_ID
        replaceOrderStatus: '待确定', // 代买订单状态
        transferCompany: '安心转运', // 转运公司
        transferNo: '121123123', // 转运单号
        expressCompany: '申通快递', // 国内快递公司
        trackingNo: '123123132312', // 国内快递单号        
    }],
    sum: 2, // 总数
    agentPrice: 200, // 代理价格
    prevFee: 200, // 订单原价
    couponFee: 18, // 折扣金额
    total: 182, // 实付金额
    agentFee: 12, // 代理提成
    agentId: '123sasdf', // 代理ID
    serviceFee: 10, // 淘二万服务费    
    <!-- 用于报关 -->
    needPay: 182, // 应付金额
    remark: '我要红色的', // 备注
    transferCompany: '安心转运', // 转运公司
    transferNo: '121123123', // 转运单号
    expressCompany: '申通快递', // 国内快递公司
    trackingNo: '123123132312', // 国内快递单号
    status: '已签收', // 状态
    seller: 'asdfasdf', // 卖家的userId
    artualTotal: 160, // 实收金额
    isSettled: false, // 是否结算
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人unionid
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
    <!-- 新增字段 -->
    saleAgentId: '123sasdf', // 销售代理ID,unionid
}

// 代买订单
// ReplaceBuyOrder
{
    no: '150504175922002', // 订单号，年月日时分秒三位数字
    unionid: '12asdflalsdkfjlksdfj', // 买家unionid
    consignee: '张三', // 收货人
    IDCard: '500235199001012323', // 身份证号码
    IDCardBack: '', // 身份证背面
    IDCardFront: '', // 身份证正面
    phone: '13666666666', // 手机号码
    address: '广东省广州市石楼镇东环路', // 详细地址
    addressId: 'NAam8u7mRLpFb7hQG', // 地址_id
    addressProvince: '广东省', // 省份
    addressCity: '广州市', // 城市
    addressQzone: '番禺区', // 区域
    addressStreet: '石楼镇东环路', // 街道
    addressPostCode: '510000', // 邮编
    products: [{ // 商品明细
        _id: '123sfajl', // 商品_id
        name: 'GNC葡萄籽', // 商品名称
        image: 'http://www.baidu.com/1.jpg', // 期刊主图
        price: 100, // 价格
        civilPrice: 200, // 国内价格
        amount: 1, // 数量
        brand: 'GNC', // 品牌
        surname: '营养品', // 报关名
        <!-- 新增字段 -->
        replaceBuyerPrice: 100, // 代买价格
    }, {
        _id: '123sfajl', // 商品_id
        name: 'GNC葡萄籽', // 商品名称
        image: 'http://www.baidu.com/1.jpg', // 期刊主图
        price: 100, // 价格
        civilPrice: 200, // 国内价格
        amount: 1, // 数量
        brand: 'GNC', // 品牌
        surname: '营养品', // 报关名
        replaceBuyerPrice: 100, // 代买价格
    }],
    sum: 2, // 总数
    <!-- 用于报关 -->
    needPay: 182, // 应付金额
    remark: '我要红色的', // 备注
    transferCompany: '安心转运', // 转运公司
    transferNo: '121123123', // 转运单号
    expressCompany: '申通快递', // 国内快递公司
    trackingNo: '123123132312', // 国内快递单号
    status: '待确定', // 状态
    seller: 'asdfasdf', // 卖家ID
    artualTotal: 160, // 实收金额
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人unionid
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
    <!-- 代买订单新增字段 -->
    replaceBuyerPrice: 887, //代买价格
    replaceBuyerId: 'YLkwrRLP37J9ax9Tk', // 代买人userId    
}

// 物流信息
// Logistics
{
    orderNo: '150504175922002', // 订单号
    status: '已签收', // 状态
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人userId
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
}

// 我的帐户
// Account
{
    category: '支付宝', // 帐户类型
    username: '张三', // 账号名
    account: '13666666666', // 账号
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    createdBy: 'asdfj1i2asfa', // 创建人userId
    isRemoved: false, // 是否已删除，true：已删除；false：未删除
}

// 可提现金额变动记录
// Withdraw
{
    type: '订单完成', // 类型，'订单完成'，'提现'，'取消订单'
    id: '20160702202334001', // 订单号
    remark: '备注', // 备注
    status: '待审核', // 状态，待审核，已完成
    amount: 2000, // 金额
    commissionFee: 20, // 手续费
    changeBalance: -1980, // 实收金额
    balance: 10000, // 当前余额
    preBalance: 11980, // 之前余额
    userId: 'asdfj1i2asfa', // 用户userId
    createdBy: 'asdfj1i2asfa', // 创建人userId
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
    category: '支付宝', // 帐户类型
    username: '张三', // 账号名
    account: '13666666666', // 账号
}

<!-- 已废弃 -->
// 交易额变动记录
// UserLog
{
    type: '提交订单', // 类型，'提交订单'，'取消订单'，'删除商品'
    id: '20160702202334001', // 订单号
    out_trade_no: '20160702202334001', // 商户订单号
    remark: '备注', // 备注
    status: '待审核', // 状态，待审核，已完成
    changeBalance: 100, // 改变金额
    balance: 1000, // 当前余额
    preBalance: 900, // 之前余额
    userId: 'asdfj1i2asfa', // 用户userId
    createdBy: 'asdfj1i2asfa', // 创建人userId
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
}

// 退款记录
// RefundLog
{
    id: '20160702202334001', // 订单号
    out_trade_no: '20160702202334001', // 商户订单号
    remark: '备注', // 备注
    status: '待处理', // 状态
    fee: 100, // 退款金额
    userId: 'asdfj1i2asfa', // 用户userId
    createdBy: 'asdfj1i2asfa', // 创建人userId
    createdAt: Wed May 04 2016 16:28:08 GMT+0800 (CST), // 创建日期
}

// 系统Log
// Log
{
    
}