import { Restivus } from 'meteor/nimble:restivus';

import Collections from '/lib';

export default () => {
    const api = new Restivus({
        useDefaultAuth: true,
        prettyJson: true,
    });

    // /api/test
    api.addRoute('test', {
        get() {
            const self = this;
            const req = self.request;
            // const res = self.response;
            const data = req.query;
            return data;
        },
        post() {
            const self = this;
            const req = self.request;
            // const res = self.response;
            const data = req.body;

            return data;
        },
    });

    api.addRoute('exportXLS', {
        get() {
            const self = this;
            const { request, response } = self;
            const data = request.query;
            if (!data.status || !data.userId) {
                return false;
            }
            if (data.status === '全部') {
                data.status = {
                    $ne: '已取消',
                };
            }
            const productData = Collections.Order.find({
                seller: data.userId,
                status: data.status,
                isRemoved: { $ne: true },
            }).fetch();
            productData.forEach((item) => {
                item.warehouseName = '淘二万仓库';
                item.receiveProvince = item.addressProvince;
                item.receiveCity = item.addressCity;
                item.receiveName = item.consignee;
                item.receivePhone = item.phone.substr(3);
                item.receiveAddress = item.address;
                item.receiveCode = item.addressPostCode;
                item.nameArr = [];
                item.products.forEach((product) => {
                    item.nameArr.push( (product.surname || '') + (product.brand || '') + product.amount);
                });
                item.nameArr = item.nameArr.join(' ');
                item.allFee = (item.prevFee / 6.5).toFixed(2);
            });
            const fields = [{
                key: 'no',
                title: '订单号',
            }, {
                key: 'userNum',
                title: '客户编号',
            }, {
                key: 'warehouseName',
                title: '仓库名称',
            }, {
                key: 'packName',
                title: '包裹识别名',
            }, {
                key: 'packRemark',
                title: '包裹备注',
            }, {
                key: 'channelName',
                title: '发货方式',
            }, {
                key: 'serviceName',
                title: '服务要求',
            }, {
                key: 'sendName1',
                title: '发件人英文姓',
            }, {
                key: 'sendName2',
                title: '发件人英文名',
            }, {
                key: 'sendPhone',
                title: '发件人电话',
            }, {
                key: 'sendAdd',
                title: '发件人地址',
            }, {
                key: 'sendCode',
                title: '发件人邮编',
            }, {
                key: 'receiveName',
                title: '收货人姓名',
            }, {
                key: 'receiveCompany',
                title: '收货公司',
            }, {
                key: 'receiveProvince',
                title: '收货省份',
            }, {
                key: 'receiveCity',
                title: '收货城市',
            }, {
                key: 'receiveName',
                title: '收货人电话1',
            }, {
                key: 'receivePhone',
                title: '收货人电话2',
            }, {
                key: 'receiveAddress',
                title: '收货地址',
            }, {
                key: 'receiveCode',
                title: '收货邮编',
            }, {
                key: 'nameArr',
                title: '物品名称和数量和本项申报价值',
            }, {
                key: 'allFee',
                title: '申报价值(美元)',
            }, {
                key: 'insuranceFee',
                title: '总保额(美元)',
            }, {
                key: 'weight',
                title: '运单重量(磅)',
            }, {
                key: 'remark',
                title: '客户备注',
            }, {
                key: 'junanRemard',
                title: '备注',
            }, {
                key: 'isDabao',
                title: '是否有偿打包',
            }];

            const title = 'order list';
            const file = Excel.export(title, fields, productData);
            response.writeHead(200, {
                'Content-type': 'application/vnd.openxmlformats',
                'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
            });

            response.end(file, 'binary');
            this.done();
        },
    });

    api.addRoute('downloadUser', {
        get() {
            const self = this;
            const { request, response } = self;

            let data = Collections.Product.find({ publisher:0, isRemoved:{$ne:true}}).fetch();
            // let data = Collections.Product.find().fetch();
            _.each(data, function(item, index) {
                // 
                // item.factoryName = item.detail.factoryName;
                // item.factoryAddress = item.detail.factoryName;
                // item.manufacturersContact = item.detail.manufacturersContact;
                // item.shelfLife = item.detail.shelfLife;
                // item.netWeight = item.detail.netWeight;
                // item.packing = item.detail.packing;
                // item.category = item.detail.category;
                item.brand= item.detail.brand;
                // item.series= item.detail.series;
                // item.origin= item.detail.origin;
                // item.pricing= item.detail.pricing;
                // item.specification= item.detail.specification;
                // item.sales= item.detail.sales;
                // item.use= item.detail.use;
                // item.model= item.detail.model;
                // item.capacity= item.detail.capacity;
                // item.color= item.detail.color;
                // item.size= item.detail.size;
                // item.gender= item.detail.gender;
                // item.volume= item.detail.volume;
                // item.other= item.detail.other;
                // item.TTM= item.detail.TTM;
                // item.material= item.detail.material;
                // item.effect= item.detail.effect;
                // item.approvalNo= item.detail.approvalNo;
                // item.forSkin= item.detail.forSkin;
                // item.foodAdditives= item.detail.foodAdditives;
                // item.forAge= item.detail.forAge;
                // item.forPhase= item.detail.forPhase;
                // item.storageMethod= item.detail.storageMethod;
                // item.taste= item.detail.taste;
                // item.cycle= item.detail.cycle;
                // item.no= item.detail.no;
                // item.useMode= item.detail.useMode;
                // item.features= item.detail.features;
                // item.forPeople= item.detail.forPeople;
                // item.powerSupply= item.detail.powerSupply;
                // item.shoeSize= item.detail.shoeSize;
                // item.upperHeight= item.detail.upperHeight;
                // item.thickness= item.detail.thickness;
                // item.length= item.detail.length;
            });
            // console.log(data);
            let fields = [
            // {
            //     key: 'category',
            //     title: '目录'
            // }, 
            {
                key: 'name',
                title: '商品名'
            }
            , {
                key: 'englishName',
                title: '英文名'
            }, {
                key:'surname',
                title:'报关名'
            }, {
                key: 'brand',
                title: '品牌'
            },
            // , {
            //     key:'description',
            //     title:'描述'
            // }, {
            //     key: 'price',
            //     title: '售价',
            //     type: 'number'
            // }, {
            //     key: 'disaccountPrice',
            //     title: '折扣价',
            //     type: 'number'
            // }, {
            //     key: 'disaccountPriceValidate',
            //     title: '折扣价有效期'
            // },{
            //     key: 'overseasPrice',
            //     title: '国外价格',
            //     type: 'number'
            // }, {
            //     key: 'overseasPriceUrl',
            //     title: '国外价格查询地址',
            // }, {
            //     key: 'civilPrice',
            //     title: '国内价格',
            //     type: 'number'
            // }, {
            //     key: 'civilPriceUrl',
            //     title: '国内价格查询地址'
            // }, {
            //     key: 'fare',
            //     title: '运费',
            //     type: 'number'
            // }, {
            //     key: 'tariff',
            //     title: '关税',
            //     type: 'number'
            // },
             {
                key:'_id',
                title: '产品ID'
            }
            // {
            //     key:'factoryName',
            //     title: '厂名'
            // }, {
            //     key: 'factoryAddress',
            //     title:'厂址'
            // }, {
            //     key: 'manufacturersContact',
            //     title: ' 厂商联系方式'
            // }, {
            //     key: 'shelfLife',
            //     title: '保质期'
            // }, {
            //     key: 'netWeight',
            //     title: '净重'
            // }, {
            //     key: 'packing',
            //     title: '包装'
            // }, {
            //     key: 'category',
            //     title: '类别'
            // }, {
            //     key: 'brand',
            //     title: '品牌'
            // }, {
            //     key: 'series',
            //     title: '系列'
            // }, {
            //     key: 'origin',
            //     title: '产地'
            // }, {
            //     key: 'pricing',
            //     title: '计价方式'
            // }, {
            //     key: 'specification',
            //     title: '规格'
            // }, {
            //     key: 'sales',
            //     title: '销售地'
            // }, {
            //     key: 'use',
            //     title: '用途'
            // }, {
            //     key: 'model',
            //     title: '型号'
            // }, {
            //     key: 'capacity',
            //     title: '容量'
            // }, {
            //     key: 'color',
            //     title: '颜色'
            // }, {
            //     key: 'size',
            //     title: '尺寸'
            // }, {
            //     key: 'gender',
            //     title: '性别'
            // }, {
            //     key: 'volume',
            //     title: '体积'
            // }, {
            //     key: 'other',
            //     title: '其它'
            // }, {
            //     key: 'TTM',
            //     title: '上市时间'
            // }, {
            //     key: 'material',
            //     title: '材质'
            // }, {
            //     key: 'effect',
            //     title: '功效'
            // }, {
            //     key: 'approvalNo',
            //     title: '批准文号',
            // }, {
            //     key: 'forSkin',
            //     title: '适合肤质'
            // }, {
            //     key: 'foodAdditives',
            //     title: '食品添加剂'
            // }, {
            //     key: 'forAge',
            //     title: '适用人群'
            // }, {
            //     key: 'forPhase',
            //     title: '适用阶段'
            // }, {
            //     key: 'storageMethod',
            //     title: '储藏方法'
            // }, {
            //     key: 'taste',
            //     title: '口味'
            // }, {
            //     key: 'cycle',
            //     title: '周期'
            // }, {
            //     key: 'no',
            //     title: '货号'
            // }, {
            //     key: 'useMode',
            //     title: '使用方式'
            // }, {
            //     key: 'features',
            //     title: '特性'
            // }, {
            //     key: 'forPeople',
            //     title: '适用人群'
            // }, {
            //     key: 'powerSupply',
            //     title: '供电方式'
            // }, {
            //     key: 'shoeSize',
            //     title: '鞋码',
            // }, {
            //     key: 'upperHeight',
            //     title: '鞋帮厚度'
            // }, {
            //     key: 'thickness',
            //     title: '厚薄'
            // }, {
            //     key: 'length',
            //     title: '长度'
            // }
            ];

            let title = 'Product_List';
            let file = Excel.export(title, fields, data);
            response.writeHead(200, {
                'Content-type': 'application/vnd.openxmlformats',
                'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
            });

            response.end(file, 'binary');
            this.done();
        },
    });

};
