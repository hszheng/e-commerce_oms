// 来自react
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';

// 来自插件
import { Pagination, Table, Button, Modal, Input } from 'antd';

// 来自Meteor
import Loading from '../core/Loading';

import NewProduct from '../editProduct';
import PreviewIssuePage from '../previewIssue';


class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        const { LocalState } = self.props.context();
        self.state = {
            category: '全部商品',
            subCategory: '',
            selectedRowKeys: [],
            newJournalPreviewProductArr: [],
            product: null, 
            visible: false,            
        };
    }
    /**
     * 在组件从 DOM 中移除的时候立刻被调用。在该方法中执行任何必要的清理，比如无效的定时器，或者清除在 componentDidMount 中创建的 DOM 元素。
     * @return {[void]} 无
     */
    componentWillUnmount() {
        const self = this;
        const { LocalState } = self.props.context();
        LocalState.set('issueLimiter', null);
    }

    render() {
        const self = this;
        const { Configuration, Utility,LocalState } = self.props.context();
        const { categorys, countArr, goodsList, count, userInfo } = self.props;
        const allTypes = categorys;
        const InputGroup = Input.Group; 
        // console.log('d', LocalState.get('issueLimiter'));
        const columns = [
            { title: '商品', width: 350, render: (text, record) => (
                <div className="commodity">
                    <div className="imgContainer">
                        <img className="cargoImg" src={record.mainImage + Configuration.OSS_IMG_100W_100H} onClick={self._zoomImg.bind(self)}/>
                    </div>
                    <div className="proName">{record.name}</div>
                </div>
            )},
            { title: '售价', dataIndex: 'price', render: (fee) => (
                <span style={{ color: '#ff4200'}}>{fee && `￥${fee.toFixed(2)}`}</span>
            ), sorter: true },
            { title: '折扣价', dataIndex: 'disaccountPrice', render: (fee) => {
                if (fee) {
                    return (
                        <span style={{ color: '#ff4200'}}>{fee &&`￥${fee.toFixed(2)}`}</span>
                    )
                } else {
                    return (<span>\</span>)
                }
            }, sorter: true},
            { title: '有效期', dataIndex: 'validate', sorter: true},
            { title: '操作', render: (text, record) => (
                <span>
                    <a onClick={self._editNow.bind(self, record)}>编辑</a>
                </span>
            )},
        ];
        const pagination = {
            total: count,
            showTotal(total) { 
                return `共 ${total} 条`; 
            },
            showSizeChanger: true,
            onShowSizeChange(current, pageSize) {
                self.pageSizeChange(current, pageSize);
            },
            onChange(current) {
                self.pageChange(current);
            },
        };
        const rowSelection = {
            selectedRowKeys: self.state.selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                let selectedRowKeys = self.state.selectedRowKeys;
                if (selected) {
                    if (selectedRowKeys.length > 7) {
                        alert('每一个期刊最多只能勾选8个商品！');
                        return;
                    }
                    selectedRowKeys.push(record._id);
                } else {
                    selectedRowKeys = _.without(selectedRowKeys, record._id);
                }
                selectedRowKeys = _.uniq(selectedRowKeys);
                self.setState({
                    selectedRowKeys,
                });
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (!self.state.selectedRowKeys.length) {
                    if (selectedRows.length > 8) {
                        alert('每一个期刊最多只能勾选8个商品！');
                        selectedRows = selectedRows.slice(0, 8);
                    }
                    self.setState({
                        selectedRowKeys: _.pluck(selectedRows, '_id')
                    });
                } else {
                    self.setState({
                        selectedRowKeys: [],
                    });
                }
            },
        };
        let modalTitle = '新增商品';
        if (self.state.product && self.state.product._id) {
            modalTitle = '修改商品';
        }        
        goodsList.forEach((data, index) => {
            data.key = data._id;
        });
        if (self.state.newJournalPreviewProductArr.length) {
            return (
                <PreviewIssuePage
                    Configuration={Configuration}
                    products={self.state.newJournalPreviewProductArr}
                    description={self.state.description}
                    name = {self.state.name}
                    userInfo={self.props.userInfo}
                    closePreview={self.closePreview.bind(self)}
                    _publishJournal={self._publishJournal.bind(self)}
                    publishLoading={self.state.publishLoading}
                />
            );
        }
        return (
            <div id="newIssue">
                <div className="product-category">
                    {allTypes ? allTypes.map((type, index) => (
                        <div className="category-item" key={index} >
                            <div className={`item ${type.isActive}`} onClick={self._clickCategory.bind(self, type)}>{type.name}</div>
                            { type.subs ? type.subs.map((sub, index1) => (
                            <div key={index1} className={`second-item ${type.isActive}`} onClick={self._clickSecondCategory.bind(self, sub, type.name)}>{sub}</div>
                            )) : ''}
                        </div>
                    )) : ''}
                </div>
                <article className="newPeriodical" style={{ position: 'relative' }}>
                    <article className="journal">
                        <h1>新建期刊</h1>
                        <div className="ant-search-input-wrapper searchBox">
                            <InputGroup>
                              <Input placeholder="搜索" style={{ textAlign: 'center' }} onChange={self.searchChange.bind(self)} onKeyDown = {self.pressSearch.bind(self)} ref="searchKey" />
                              <div className="ant-input-group-wrap">
                                <Button icon="search" nClick={self.searchProduct.bind(self)}/>
                              </div>
                            </InputGroup>
                        </div>                        
                        <Table className="table" 
                            rowSelection={rowSelection} 
                            columns={columns} 
                            dataSource={goodsList} 
                            pagination={pagination} 
                            onChange={self.tableChange.bind(self)}
                            />
                    </article>
                    <article className="complete">
                        <article className="total">合计：已勾选<span className="amount">{self.state.selectedRowKeys.length}</span>件商品</article>
                    </article>
                    <article className="description">
                        <htmlFor style={{ marginLeft: '20px', display: 'block',  marginTop: '15px' }}>
                            期刊名：
                            <input type="text" ref="issueName" value={self.state.name} onChange={self.journalNameChange.bind(self)} className="issueName"/>
                        </htmlFor>
                        <article className="describe">
                            <span>期刊描述：</span>
                            <textarea onChange={self.journalDescChange.bind(self)} value={self.state.description}></textarea>
                        </article>
                        <Button className="preview" type="primary" size="large" loading={this.state.prewLoading} onClick={self._previewJournal.bind(self)}>预览</Button>
                        <Button className="publish" type="primary" size="large" loading={this.state.publishLoading} onClick={self._publishJournal.bind(self)}>发布</Button>
                    </article>
                    <Modal title={modalTitle} className="productModal" visible={self.state.visible} onText='保存' onCancel={() => { self.setState({ product: null, visible: false }); } } footer={false}>
                       {self.state.product && (<NewProduct ref="newProduct" product={self.state.product} categories={categorys} Utility={Utility} Configuration={Configuration} _saveProduct={self._saveProduct.bind(self)} _cancelEditProduct={self._cancelEditProduct.bind(self)}/> )}
                    </Modal>                    
                </article>
                <Modal title='' className="imgModal" visible={self.state.imgVisible} onText='保存' onCancel={() => { self.setState({ imgVisible: false, imgSrc: '' })} } footer={false}>
                    <img src={self.state.imgSrc} />
                </Modal>                
            </div>
        );
    }
    // 排序
    tableChange(pagination, filters, sorter) {
        const self = this;
        const { LocalState } = self.props.context();
        const issueLimiter = LocalState.get('issueLimiter');
        // console.log(sorter.columnKey);
        if (sorter.columnKey) {
            issueLimiter.options.sort = {
                [sorter.columnKey]: sorter.order === 'descend' ? -1 : 1,
            };
            LocalState.set('issueLimiter', issueLimiter);
        }
    } 

    // 搜索产品
    searchProduct() {
        const self = this;
        const { LocalState } = self.props.context();
        const searchKey = self.refs.searchKey.refs.input.value.trim();
        const issueLimiter = LocalState.get('issueLimiter');
        issueLimiter.selector.name = {
            $regex: searchKey,
            $options: 'i',
        };
        issueLimiter.options.skip = 0;
        LocalState.set('issueLimiter', issueLimiter);
    }
    // 搜索框变化
    searchChange() {
        const self = this;
        const { LocalState } = self.props.context();
        const searchKey = self.refs.searchKey.refs.input.value.trim();
        const issueLimiter = LocalState.get('issueLimiter');
        issueLimiter.selector.name = {
            $regex: searchKey,
            $options: 'i',
        };
        issueLimiter.options.skip = 0;
        LocalState.set('issueLimiter', issueLimiter);
    }
    // 搜索框回车
    pressSearch(e) {
        if (e.keyCode === 13) {
            const self = this;
            const { LocalState } = self.props.context();
            const searchKey = self.refs.searchKey.refs.input.value.trim();
            const issueLimiter = LocalState.get('issueLimiter');
            issueLimiter.selector.name = {
                $regex: searchKey,
                $options: 'i',
            };
            issueLimiter.options.skip = 0;
            LocalState.set('issueLimiter', issueLimiter);
        }
    }     
    // 点击这么大图片
    _zoomImg (e) {
        // debugger;
        const self = this;
        const { Configuration } = self.props.context();
        const imgSrc = e.currentTarget.src.split('@!100w_100h')[0] + Configuration.OSS_IMG_ORIGINAL;
        self.setState({ imgVisible: true, imgSrc });
    }
    // 点击弹窗
    _cancelEditProduct(){
        const self = this;
        self.setState({ product:null, visible: false });
    }
    // 点击弹窗保存按钮
    _saveProduct() {
        const self = this;
        self.setState({ product:null, visible: false });
    }    
    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const issueLimiter = LocalState.get('issueLimiter');
        issueLimiter.options.skip = (page - 1) * issueLimiter.options.limit;
        LocalState.set('issueLimiter', issueLimiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const issueLimiter = LocalState.get('issueLimiter');
        issueLimiter.options.limit = size;
        issueLimiter.options.skip = (page - 1) * issueLimiter.options.limit;
        LocalState.set('issueLimiter', issueLimiter);
    }

    // 点击预览
    _previewJournal() {
        const self = this;
        const previewArr = self.state.selectedRowKeys;
        const data = {
            _id: { $in: previewArr },
            isRemoved: { $ne: true },
        };
        if (!previewArr.length) {
            alert('请选择商品');
            return;
        }
        if (previewArr.length > 8) {
            alert('每一个期刊最多只能勾选8个商品！');
            return;
        }
        self.setState({ prewLoading: true });
        Meteor.call('Product.methods.getProductList', data, (err, result) => {
            self._toFabricImage(result, [], (newProductArr) => {
                self.setState({
                    prewLoading: false,
                    newJournalPreviewProductArr: newProductArr,
                });
            });
        });
    }
    closePreview() {
        const self = this;
        self.setState({
            newJournalPreviewProductArr: [],
        });
    }
    
    // 点击发布
    _publishJournal() {
        // // // console.log('发布点击');
        const self = this;
        const { LocalState } = self.props.context();
        const router = self.context.router;
        const desc = self.state.description;
        // debugger;
        const name = self.state.name;
        // // console.log(desc);
        if (!desc) {
            alert('必须填写期刊描述!');
            $('.form-control').focus();
            return;
        }
        const previewArr = self.state.selectedRowKeys;
        const data = {
            _id: { $in: previewArr },
            isRemoved: { $ne: true },
        };
        if (!previewArr.length) {
            alert('请选择商品');
            return;
        }
        if (previewArr.length > 8) {
            alert('每一个期刊最多只能勾选8个商品！');
            return;
        }
        self.setState({ publishLoading: true });
        Meteor.call('Product.methods.getProductList', data, (err, result) => {
            const categories = _.uniq(_.pluck(result, 'category'));
            self._toFabricImage(result, [], (newProductArr) => {
                const productImages = _.uniq(_.pluck(newProductArr, 'momentsImage'));
                Meteor.call('Journal.methods.insert', {
                    categories,
                    productImages,
                    name,
                    productArr: newProductArr,
                    description: desc,
                }, (err1, result1) => {
                    self.setState({ publishLoading: false });
                    if (err1) {
                        // // console.log('err', err1);
                        alert('发布期刊失败');
                    } else {
                        router.push(`/publishSuccessIssue/${result1}`);
                    }
                });
            });
            
        });
    }

    // 生成朋友圈图片
    _toFabricImage(productArr, newProductArr, callback) {
        const self = this;

        const { Configuration} = self.props.context();

        if (!productArr.length) {
            callback && callback(newProductArr);
            return;
        }

        const product = productArr.shift();

        if (product.momentsImage) {
            newProductArr.push(product);
            self._toFabricImage(productArr, newProductArr, callback);
            return;
        }

        let canvas = $('#wechatCanvas').get(0);
        if (!canvas) {
            $('body').append('<canvas id="wechatCanvas" width="800" height="800" style="display: none;"></canvas>');
            canvas = $('#wechatCanvas').get(0);
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 800, 800);
        if (product.mainImage) {
            const bg = new Image();
            bg.setAttribute('crossOrigin', 'anonymous');
            bg.onerror = (error) => {
                self.updateMomentsImage(product, (url) => {
                    product.momentsImage = url;
                    newProductArr.push(product);
                    self._toFabricImage(productArr, newProductArr, callback);
                });   
            }
            bg.onload = () => {
                let width = bg.width;
                let height = bg.height;
                if (width > height) {
                    height = 800;
                    width = 800 * width / height;
                } else {
                    width = 800;
                    height = 800 * height / width;
                }
                // 背景图
                ctx.drawImage(bg, -(800 - width) / 2, -(800 - height) / 2, width, height);
                self.updateMomentsImage(product, (url) => {
                    product.momentsImage = url;
                    newProductArr.push(product);
                    self._toFabricImage(productArr, newProductArr, callback);
                }); 
            };
            bg.src = product.mainImage + Configuration.OSS_IMG_ORIGINALNULL;
        } else {
            self.updateMomentsImage(product, (url) => {
                product.momentsImage = url;
                newProductArr.push(product);
                self._toFabricImage(productArr, newProductArr, callback);
            }); 
        }
    }
    // 生成分享朋友圈的图片
    updateMomentsImage(product, callback) {
        const self = this;
        const { context } = self.props;
        const { Utility } = context();
        const canvas = $('#wechatCanvas').get(0);
        const ctx = canvas.getContext('2d');
        let prevIndex = -1;
        let line = 0;

        // 遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, .66)';
        ctx.fillRect(0, 578, 800, 222);
        // 商品名
        ctx.font = '30px Microsoft Yahei';
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < product.name.length; i++) {
            if (ctx.measureText(product.name.substring(prevIndex, i)).width > 750) {
                ctx.fillText(product.name.substring(prevIndex, i - 1), 30, 627 + line * 35);
                prevIndex = i;
                line++;
            }
        }
        ctx.fillText(product.name.substring(prevIndex, product.name.length), 30, 627 + line * 35);
        if (product.disaccountPrice) {
            // 售价
            ctx.font = '25px Microsoft Yahei';
            ctx.fillText(`售价：  ¥ ${product.price.toFixed(2)}`, 30, 720);
            // 国内价格
            // ctx.fillText(`国内正品价：  ¥ ${product.civilPrice.toFixed(2)}`, 30, 770);
            ctx.fillText(`品牌：  ${product.brand}`, 30, 770);
            // 折扣价有效期
            ctx.fillText(`折扣有效期：${product.disaccountPriceValidate}`, 400, 770);
            // 折扣价
            ctx.font = '40px Microsoft Yahei';
            ctx.fillText('折扣价：', 400, 730);
            ctx.fillStyle = '#e31436';
            ctx.fillText(`¥ ${product.disaccountPrice.toFixed(2)}`, 570, 730);
        } else {
            // 国内价格
            ctx.font = '25px Microsoft Yahei';
            // ctx.fillText(`国内正品价：  ¥ ${product.civilPrice.toFixed(2)}`, 30, 740);
            ctx.fillText(`品牌：  ${product.brand}`, 30, 740);
            // 售价
            ctx.font = '40px Microsoft Yahei';
            ctx.fillText('售价：', 460, 740);
            ctx.fillStyle = '#e31436';
            ctx.fillText(`¥ ${product.price.toFixed(2)}`, 590, 740);
        }
        // 保存图片
        Utility.resizeImageAndUploadToOSS(canvas.toDataURL({
            format: 'png',
            left: 0,
            top: 0,
            width: 800,
            height: 800,
        }), {
            progress(e) {
                // // // console.log('progress', e);
            },
            uploaded(e, url) {
                Meteor.call('Product.methods.updateById', { _id: product._id, modifier: { momentsImage: url } });
                callback && callback(url);
            },
            failed(e) {
                alert('上传失败');
            },
            canceled(e) {
                // // console.log('canceled', e);
            },
        });
    }

    // 编辑
    _editNow(product) {
        const self = this;
        self.setState({product, visible: true});
    }
    // 描述
    journalDescChange(event) {
        const self = this;
        self.setState({
            description: event.target.value,
        });
    }
    // 名字
    journalNameChange(event) {
        const self = this;
        // debugger;
        self.setState({
            name: event.target.value
        });
    }
   // 商品分类点击
    _clickCategory(category,e) {
        const self = this;
        const { LocalState } = self.props.context();
        // const array = self.props.categorys;
        const category1 = category.name;
        const previewCatagory = self.state.category;
        self.setState({
            category: category1,
            subCategory: '',
        });
        if(previewCatagory === category1){
            if($(e.currentTarget).siblings('.second-item').eq(0)[0].style.display === 'block'){
                $(e.currentTarget).siblings('.second-item').hide();
            }
            else{
                $(e.currentTarget).siblings('.second-item').show();
            }
        }
        else{
            $('#newIssue .product-category .item').removeClass('active');
            $(e.currentTarget).siblings('.second-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            $(e.currentTarget).parent().siblings('.category-item').find('.second-item').hide();
            $(e.currentTarget).siblings('.second-item').show();
        }
        let issueLimiter;
        if (category.name === '全部商品') {
            issueLimiter = {
                selector: {
                    createdBy: Meteor.userId(),
                    isRemoved: { $ne: true },
                    journalId: '',
                    shelf: true,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: { createdAt: -1 },
                },
            };
        } else {
            issueLimiter = {
                selector: {
                    category: category.name,
                    createdBy: Meteor.userId(),
                    isRemoved: { $ne: true },
                    journalId: '',
                    shelf: true,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: { createdAt: -1 },
                },
            };
        }
        LocalState.set('issueLimiter', issueLimiter);
        LocalState.set('isMove', true);
    }
    // 点击子分类
    _clickSecondCategory(sub, name, e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        self.setState({
            category: name,
            subCategory: sub,
        });
        $(e.currentTarget).siblings('.second-item').removeClass('active');
        $(e.currentTarget).siblings('.item').removeClass('active');
        $(e.currentTarget).addClass('active');
        let issueLimiter;
        issueLimiter = {
            selector: {
                    category: name,
                    createdBy: Meteor.userId(),
                    isRemoved: { $ne: true },
                    journalId: '',
                    subCategory: sub,
                    shelf: true,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: { createdAt: -1 },
                },
        };
        LocalState.set('issueLimiter', issueLimiter);
        LocalState.set('isMove', true);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { Meteor, LocalState, Collections } = context();

    const userInfo = Meteor.user();

    if (!LocalState.get('issueLimiter')) {
        LocalState.set('issueLimiter', {
            selector: {
                createdBy: Meteor.userId(),
                isRemoved: { $ne: true },
                journalId: '',
                shelf: true,
            },
            options: {
                skip: 0,
                limit: 10,
                sort: { 
                    createdAt: -1,
                },
            },
        });
    }
    const issueLimiter = LocalState.get('issueLimiter');

    Meteor.subscribe('Product.OnlineProductCount', issueLimiter);
    Meteor.subscribe('Product.category');
    Meteor.subscribe('Product.productList', issueLimiter);

    const count = Counts.get('OnlineProductCount');

    const categorys = Collections.Category.find().fetch();
    categorys.unshift({ name: '全部商品', isActive: 'active', subs: [] });
    _.each(categorys, (item) => {
        if (item.name === '全部商品') {
            item.isActive = 'active';
        } else {
            item.isActive = '';
        }
    });

    const goodsList = Collections.Product.find({},{ sort: issueLimiter.options.sort }).fetch();
    goodsList.forEach((item) => {
        item.validate = '\\';
        if (item.disaccountPriceValidate) {
            const endTime = new Date(item.disaccountPriceValidate).getTime();
            item.validate = parseInt(Math.abs(endTime - Date.now()) / 1000 / 60 / 60 / 24, 10);
            if (item.validate > 0) {
                item.validate = `剩下${item.validate}天`;
            }
        }
    });

    onData(null, { userInfo, goodsList, categorys, count });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
