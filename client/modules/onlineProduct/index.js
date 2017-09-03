import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Link } from 'react-router';
import Loading from '../core/Loading';
import QRCode from 'qrcode.react';
import Notification from '../core/Notification';

import NewProduct from '../editProduct';
import productArr from '../../configs/productList';

import { message, Menu, Dropdown, Pagination, Modal, Table, Icon, Popconfirm } from 'antd';




class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {
            category: '全部商品',
            shelf: true,
            subCategory: '',
            checkedArr: [],
            product: null, 
            visible: false,
        };
    }

    componentWillUnmount() {
        const self = this;
        const { Utility, Configuration, LocalState } = self.props.context();
        LocalState.set('productLimiter', null);
    }

    // componentDidMount() {

    // }
    render() {
        const self = this;
        const { goodsList, count, context, hasUser, categorys, isDataReady, userInfo } = self.props;
        const { Configuration, LocalState, ProductList, Utility} = context();
        const judge = LocalState.get('productLimiter');
        const allTypes = categorys;
        let modalTitle = '新增商品';
        if (self.state.product && self.state.product._id) {
            modalTitle = '修改商品';
        }
        const columns = [
            { title: '商品', render:(text, record, index) =>(
                    <div className="commodity" onClick={self._editProduct.bind(self, record)}>
                        <div className="imgContainer">
                            <img className="products" src={record.mainImage + Configuration.OSS_IMG_100W_100H } />
                            { 
                                record.replaceBuyerPrice ? <img src='/buyTay.png' className="buyTag"/> : ''
                            }
                        </div>
                        <div className="proName">{record.name}</div>
                    </div>
                ) 
            },
            { title: '售价', dataIndex: 'price', render:(text, record, index) =>(
                    <span style={{ color: '#ff4200'}}>{text ? `￥${text.toFixed(2)}` : ''}</span>
                ), 
              sorter: true
            },
            { title: '国外进货价', dataIndex: 'overseasPrice', render:(text, record, index) =>(
                    <span style={{ color: '#ff4200'}}>{text ? `$${text.toFixed(2)}` : ''}</span>
                ), 
              sorter: true
            },
            { title: '折扣价', dataIndex: 'disaccountPrice', render:(text, record, index) =>(
                    <span style={{ color: '#ff4200'}}>{record.disaccountPrice ? `￥${record.disaccountPrice.toFixed(2)}` : '\\'}</span>
                ), 
              sorter: true
            },
            { title: '折扣有效期', dataIndex: 'validate', sorter: true },
            {
                title: '代理价格', dataIndex: 'agentPrice',render:(text, record) => (
                    <span style={{ color: '#ff4200'}}>{record.agentPrice ? `￥${record.agentPrice}` : '\\'}</span>
                )
            },                    
            {
                // title: '可代买的店铺', dataIndex:'replaceBuyerName',
            },
            { title: '操作', render:(text, record, index) =>(
                <span>
                    {
                        record.shelf ? (
                            <a onClick={self._removeShelfProduct.bind(self, record)}>下架</a>
                        ) : (
                            <a onClick={self._addShelfProduct.bind(self, record)}>上架</a>
                        )
                    }
                    <span className="ant-divider"></span>
                    <Popconfirm title="确定要删除该商品？" onConfirm={self._deleteProduct.bind(self, record)}>
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
            )}
        ];

        if (userInfo && userInfo.status.indexOf(0) === -1) {
            if (_.findIndex(columns, { title: '国外进货价' }) !== -1) {
                columns.splice(_.findIndex(columns, { title: '国外进货价' }), 1);
            }
        }

        const pagination = {
            total: count,
            showSizeChanger: true,            
            defaultPageSize: 20,
            showTotal(total) { 
                return `共 ${total} 条`; 
            },            
            onShowSizeChange(current, pageSize) {
                self.pageSizeChange(current, pageSize);
            },
            onChange(current) {
                self.pageChange(current);
            },

        };
        const rowSelection = {
            selectedRowKeys: self.state.selectedRowKeys,
            onChange(selectedRowKeys, selectedRows) {
                self.setState({
                    selectedRowKeys,
                });
            }
        };

    // 挑选可售商品
        return (
            <div id="dailyIssue">
                {
                    !isDataReady && (<Loading/>)
                }
                <div className="product-container">
                    <div className="categoryList">
                        <div className="product-category">
                            {allTypes ? allTypes.map((type, index) => (
                                <div className="category-item" key={index}>
                                    <div className={`item ${type.isActive}`} onClick={self._clickCategory.bind(self, type)}>{type.name}</div>
                                   { type.subs ? type.subs.map((sub, index1) => (
                                        <div key={index1} className={`second-item ${type.isActive}`} onClick={self._clickSecondCategory.bind(self, sub, type.name)}>{sub}</div>
                                        )) : ''}
                               </div>
                            )) : ''}
                        </div>
                        <div className="qrcodeContainer">
                            <QRCode value={`${Configuration.WECHAT_HOST}/onlineMall/${hasUser}?inviteId=${userInfo && userInfo.unionid}`} size={130} />
                            <div>扫一扫进入我的商城</div>
                        </div>
                    </div>
                    <div className="product-detail">
                        <nav>
                            <div className="row-item">
                                <button onClick={self._addShelf.bind(self)} className= {judge.selector.shelf ? 'greyButton active' : 'greyButton'} >已上架</button>
                                <button onClick={self._removeShelf.bind(self)} className={judge.selector.shelf ? 'greyButton' : 'greyButton active'}>未上架</button>
                                {
                                    // <div className="new-content" onClick={self._goAddContentWarehouse.bind(self, 'agentBuy')}>+导入其他买手代买商品</div>
                                } 
                                {
                                    userInfo && userInfo.status.indexOf(0) !== -1 && (
                                        <div className="new-content" onClick={self._goAddContentWarehouse.bind(self, 'platformPublish')}>+导入商品</div>
                                    )
                                }
                                {
                                    userInfo && userInfo.status.indexOf(0) !== -1 && (
                                        <div className="new-content" onClick={self._newProduct.bind(self)}>+新增商品</div>
                                    )
                                }
                                {
                                    userInfo && userInfo.status.indexOf(0) === -1 && (
                                        <div className="new-content" onClick={self._goAddContentWarehouse.bind(self, 'agent')}>+导入买手商品</div>
                                    )
                                }
                            </div>
                            <div className="row-item">
                                <input type="text" ref="searchValue" className="searchbox" onKeyDown = {self._inputSearch.bind(self)}/>
                                <div className="search-btn" onClick={self._searchProduct.bind(self)}>搜索</div>
                                {
                                    judge.selector.shelf ? (
                                        <button className="multi-btn" onClick={self.multiRemoveShelf.bind(self)}>批量下架</button>
                                    ) : (
                                        <button className="multi-btn" onClick={self.multiAddShelf.bind(self)}>批量上架</button>
                                    )
                                }
                                <button className="multi-btn" onClick={self.multiDelete.bind(self)}>批量删除</button>
                            </div>
                        </nav>
                        <Table className="table"
                            rowKey={record => record._id}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={goodsList}
                            pagination={pagination}

                            locale={{emptyText: (goodsList.length === 0 && isDataReady) ? (judge.selector.shelf ? 
                                '您还未上架该分类的商品，赶紧挑选商品上架吧~'
                             : 
                                '该分类下暂无未上架商品~'
                            ) : ''}}
                            onChange={self.tableChange.bind(self)}
                        />                          

                        <div className="detail-body">
                        <Modal title={modalTitle} className="productModal" visible={self.state.visible} onText='保存' onCancel={() => { self.setState({ product: null, visible: false }); } } footer={false}>
                           {self.state.product && (<NewProduct ref="newProduct" product={self.state.product} hasUser = {hasUser} categories={categorys} Utility={Utility} Configuration={Configuration} _saveProduct={self._saveProduct.bind(self)} _cancelEditProduct={self._cancelEditProduct.bind(self)}/> )}
                        </Modal>                      
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 排序
    tableChange(pagination, filters, sorter) {
        const self = this;
        const { LocalState } = self.props.context();
        const productLimiter = LocalState.get('productLimiter');
        if (sorter.columnKey) {
            productLimiter.options.sort = {
                [sorter.columnKey]: sorter.order === 'descend' ? -1 : 1,
            };
            LocalState.set('productLimiter', productLimiter);
        }
    }
    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const productLimiter = LocalState.get('productLimiter');
        productLimiter.options.skip = (page - 1) * productLimiter.options.limit;
        LocalState.set('productLimiter', productLimiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const productLimiter = LocalState.get('productLimiter');
        productLimiter.options.limit = size;
        productLimiter.options.skip = (page - 1) * productLimiter.options.limit;
        LocalState.set('productLimiter', productLimiter);
    }

    // 点击全选
    _checkAll(e) {
        const self = this;
        const { goodsList } = self.props;
        let { checkedArr } = self.state;
        if (e.currentTarget.checked) {
            checkedArr = _.uniq(checkedArr.concat(_.pluck(goodsList, '_id')));
        } else {
            _.pluck(goodsList, '_id').forEach((_id) => {
                checkedArr = _.without(checkedArr, _id);
            });
        }
        self.setState({ checkedArr });
    }

    // 每一列复选框点击
    _onChangeProductCheckBox(product, e) {
        const self = this;
        const _id = product._id;
        let checkedArr = self.state.checkedArr || [];

        if (!e.currentTarget.checked) {
            checkedArr = _.without(checkedArr, _id);
        } else {
            checkedArr.push(_id);
        }
        checkedArr = _.uniq(checkedArr);
        self.setState({ checkedArr });
    }

    // 点击目录事件
    _clickCategory(type, e) {
        const self = this;
        const category = type.name;
        const { context } = self.props;
        const { LocalState } = context();
        const searchKey = self.refs.searchValue.value;
        const shelf = self.state.shelf;
        const previewCatagory = self.state.category;
        self.setState({
            subCategory: '',
            category,
        });
        if (previewCatagory === category) {
            if ($(e.currentTarget).siblings('.second-item').eq(0)[0].style.display === 'block') {
                $(e.currentTarget).siblings('.second-item').hide();
            } else {
                $(e.currentTarget).siblings('.second-item').show();
            }
        } else {
            $('.product-container .product-category .item').removeClass('active');
            $(e.currentTarget).siblings('.second-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            $(e.currentTarget).parent().siblings('.category-item')
            .find('.second-item')
            .hide();
            $(e.currentTarget).siblings('.second-item').show();
        }
        let productLimiter;
        if (category === '全部商品') {
            productLimiter = {
                selector: {
                    createdBy: Meteor.userId(),
                    isRemoved: { $ne: true },
                    name: { $regex: searchKey, $options: 'i' },
                    journalId: '',
                    shelf,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: {
                        shelfTime: -1,
                        createdAt: -1,
                    },
                },
            };
        } else {
            productLimiter = {
                selector: {
                    createdBy: Meteor.userId(),
                    category,
                    name: { $regex: searchKey, $options: 'i' },
                    isRemoved: { $ne: true },
                    journalId: '',
                    shelf,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: {
                        shelfTime: -1,
                        createdAt: -1,
                    },
                },
            };
        }
        LocalState.set('productLimiter', productLimiter);
    }

    // 点击二级页面的事件
    _clickSecondCategory(sub, name, e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const searchKey = self.refs.searchValue.value;
        const shelf = self.state.shelf;
        self.setState({
            category: name,
            subCategory: sub,
        });
        $(e.currentTarget).siblings('.second-item').removeClass('active');
        $(e.currentTarget).siblings('.item').removeClass('active');
        $(e.currentTarget).addClass('active');
        const productLimiter = {
            selector: {
                createdBy: Meteor.userId(),
                category: name,
                subCategory: sub,
                name: { $regex: searchKey, $options: 'i' },
                isRemoved: { $ne: true },
                journalId: '',
                shelf,
            },
            options: {
                skip: 0,
                limit: 10,
                sort: {
                    shelfTime: -1,
                    createdAt: -1,
                },
            },
        };
        LocalState.set('productLimiter', productLimiter);
    }
    // 上架搜索
    _addShelf() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const searchKey = self.refs.searchValue.value;
        const category = self.state.category;
        const subCategory = self.state.subCategory;
        let productLimiter;
        if (category === '全部商品') {
            productLimiter = {
                selector: {
                    createdBy: Meteor.userId(),
                    name: { $regex: searchKey, $options: 'i' },
                    isRemoved: { $ne: true },
                    journalId: '',
                    shelf: true,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: {
                        shelfTime: -1,
                        createdAt: -1,
                    },
                },
            };
        } else {
            if (subCategory) {
                productLimiter = {
                    selector: {
                        createdBy: Meteor.userId(),
                        name: { $regex: searchKey, $options: 'i' },
                        isRemoved: { $ne: true },
                        journalId: '',
                        shelf: true,
                        category,
                        subCategory,
                    },
                    options: {
                        skip: 0,
                        limit: 10,
                        sort: {
                            shelfTime: -1,
                            createdAt: -1,
                        },
                    },
                };
            } else {
                productLimiter = {
                    selector: {
                        createdBy: Meteor.userId(),
                        name: { $regex: searchKey, $options: 'i' },
                        isRemoved: { $ne: true },
                        journalId: '',
                        shelf: true,
                        category,
                    },
                    options: {
                        skip: 0,
                        limit: 10,
                        sort: {
                            shelfTime: -1,
                            createdAt: -1,
                        },
                    },
                };
            }
        }
        self.setState({
            shelf: true,
        });
        LocalState.set('productLimiter', productLimiter);
    }
    // 下架搜索
    _removeShelf() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const searchKey = self.refs.searchValue.value;
        const category = self.state.category;
        const subCategory = self.state.subCategory;
        self.setState({
            shelf: false,
        });
        let productLimiter;
        if (category === '全部商品') {
            productLimiter = {
                selector: {
                    createdBy: Meteor.userId(),
                    name: { $regex: searchKey, $options: 'i' },
                    isRemoved: { $ne: true },
                    journalId: '',
                    shelf: false,
                },
                options: {
                    skip: 0,
                    limit: 10,
                    sort: {
                        createdAt: -1,
                    },
                },
            };
        } else {
            if (subCategory) {
                productLimiter = {
                    selector: {
                        createdBy: Meteor.userId(),
                        name: { $regex: searchKey, $options: 'i' },
                        isRemoved: { $ne: true },
                        journalId: '',
                        shelf: false,
                        category,
                        subCategory,                        
                    },
                    options: {
                        skip: 0,
                        limit: 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                };
            } else {
                productLimiter = {
                    selector: {
                        createdBy: Meteor.userId(),
                        name: { $regex: searchKey, $options: 'i' },
                        isRemoved: { $ne: true },
                        journalId: '',
                        shelf: false,
                        category,
                    },
                    options: {
                        skip: 0,
                        limit: 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                };
            }
        }
        LocalState.set('productLimiter', productLimiter);
    }
    // 下架事件
    _removeShelfProduct(list) {
        const confirm = window.confirm('确认下架？');
        if (confirm) {
            Meteor.call('Product.methods.multiRemoveShelf', { idArr: [list._id] }, (err) => {
                if (err) {
                    alert('err code:', err);
                    return;
                }
            });
        }
    }
    // 上架事件
    _addShelfProduct(list) {
        const self = this;
        const confirm = window.confirm('确认上架？');
        if (confirm) {
            Meteor.call('Product.methods.multiAddShelf', { idArr: [list._id] }, (err) => {
                if (err) {
                    alert('err code:', err);
                    return;
                }
            });
        }
    }
    // 批量下架
    multiRemoveShelf() {
        const self = this;
        let checkedArr = self.state.selectedRowKeys;
        const confirm = window.confirm('确认批量下架？');
        if (confirm) {
            Meteor.call('Product.methods.multiRemoveShelf', { idArr: checkedArr }, (err) => {
                if (err) {
                    alert('err code:', err);
                    return;
                }
                self.setState({ checkedArr: [] });
                self.setState({ selectedRowKeys: [] });
            });
        }
    }
    // 批量上架
    multiAddShelf() {
        const self = this;
        let checkedArr = self.state.selectedRowKeys;
        const confirm = window.confirm('确认批量上架？');
        if (confirm) {
            Meteor.call('Product.methods.multiAddShelf', { idArr: checkedArr }, (err) => {
                if (err) {
                    alert('err code:', err);
                    return;
                }
                self.setState({ checkedArr: [] });
                self.setState({ selectedRowKeys: [] });
            });
        }
    }
    // 批量删除
    multiDelete() {
        const self = this;
        let checkedArr = self.state.selectedRowKeys;
        const confirm = window.confirm('确认批量删除？');
        if (confirm) {
            Meteor.call('Product.methods.multiDelete', { idArr: checkedArr }, (err) => {
                if (err) {
                    alert('err code:', err);
                    return;
                }
                self.setState({ checkedArr: [] });
                self.setState({ selectedRowKeys: [] });
            });
        }
    }
    // 新增商品
    _newProduct() {
        const self = this;
        self.setState({ product: { descImage: [], mainImage: '', detail: {}, fare: 0, tariff: 0 }, visible: true });        
    }
    _saveProduct() {
        const self = this;
        self.setState({ product:null, visible: false });
    }
    _cancelEditProduct(){
        const self = this;
        self.setState({ product:null, visible: false });
    }
    // 修改商品事件
    _editProduct(product) {
        const self = this;
        self.setState({product, visible: true});
    }
    // 删除商品事件
    _deleteProduct(list) {
        const self = this;
        const id = list._id;
        const data = { _id: id, modifier: { isRemoved: true } };
        Meteor.call('Product.methods.update', data, (err) => {
            if (err) {
                alert('err code:', err);
            }
        });
    }
    // 新增内容库的商品
    _goAddContentWarehouse(from) {
        const self = this;
        const router = self.context.router;
        router.push(`/contentWarehouse?import=${from}`);
    }
    // 输入搜索
    _inputSearch(e) {
        if (e.keyCode === 13) {
            const self = this;
            const { context } = self.props;
            const { LocalState } = context();
            const name = self.refs.searchValue.value.trim();
            const productLimiter = LocalState.get('productLimiter');

            productLimiter.selector.name = {
                $regex: name,
                $options: 'i',
            };
            productLimiter.options.skip = 0;
            LocalState.set('productLimiter', productLimiter);
        }
    }
    // 搜索商品
    _searchProduct() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const name = self.refs.searchValue.value.trim();
        const productLimiter = LocalState.get('productLimiter');
        productLimiter.selector.name = {
            $regex: name,
            $options: 'i'
        };
        productLimiter.options.skip = 0;
        LocalState.set('productLimiter', productLimiter);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState, Collections } = context();

    if (!LocalState.get('productLimiter')) {
        LocalState.set('productLimiter', {
            selector: {
                createdBy: Meteor.userId(),
                isRemoved: { $ne: true },
                journalId: '',
                shelf: true,
            },
            options: {
                sort: {
                    shelfTime: -1,
                    createdAt: -1,
                },
                skip: 0,
                limit: 10,
            },
        });
    }
    const productLimiter = LocalState.get('productLimiter');

    const hasUser = Meteor.userId();
    const userInfo = Meteor.user();   
    // 数据订阅操作
    Meteor.subscribe('Product.OnlineProductCount', productLimiter);
    const isDataReady = Meteor.subscribe('Product.productList', productLimiter).ready();
    
    Meteor.subscribe('Product.category');
    // 获取数据
    const count = Counts.get('OnlineProductCount');
    const goodsList = Collections.Product.find({},{sort:productLimiter.options.sort}).fetch();
    const categorys = Collections.Category.find().fetch();
    
    // 处理折扣有效期格式
    _.each(goodsList, (item) => {
        item.validate = '\\';
        if (item.disaccountPriceValidate) {
            const endTime = new Date(item.disaccountPriceValidate).getTime();
            item.validate = parseInt((endTime - Date.now()) / 1000 / 60 / 60 / 24, 10);
            if (item.validate > 0) {
                item.validate = `剩下${item.validate}天`;
            }
        }
    });

    // 初如化目录
    categorys.unshift({ name: '全部商品', isActive: 'active', subs: [] });
    _.each(categorys, (item) => {
        if (item.name === '全部商品') {
            item.isActive = 'active';
        } else {
            item.isActive = '';
        }
    });
    // 待清除数据库表中格式不正确的数据
    _.each(goodsList, (item) =>{
        item.replaceBuyerPrice = parseFloat(item.replaceBuyerPrice);
    });
    // console.log(goodsList);
    onData(null, { hasUser, userInfo, goodsList, count, categorys, isDataReady });
}
// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
