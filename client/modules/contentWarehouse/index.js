import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '../core/Loading';
import NewProduct from '../editProduct';
import { Modal, Table, Button } from 'antd';

class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {
            category: '全部商品',
            shelf: true,
            subCategory: '',
            selectedRowKeys: [],
            selectedRowKeysArr: [],
            product: null, 
            visible: false,
        };        
    }
    componentWillUnmount() {
        const self = this;
        const { LocalState } = self.props.context();
        LocalState.set('contentLimiter', null);
    }

    render() {
        const self = this;
        const { goodsList, count, categoryArr } = self.props;
        const { Configuration, Utility } = self.props.context();
        const columns = [
            { title: '商品', width: 350, render: (text, record) => (
                <div className="commodity">
                    <div className="imgContainer">
                        <img className="cargoImg" src={record.mainImage + Configuration.OSS_IMG_100W_100H} onClick={self._zoomImg.bind(self)}/>
                    </div>
                    <div className="proName">{record.name}</div>
                </div>
            )},
            { title: '售价', dataIndex: 'price', sorter: true, render: (text, record) => (
                    <span style={{ color: '#ff4200'}}>{text && `￥${text.toFixed(2)}`}</span>
                )
            },
            { title: '国外进货价', dataIndex: 'overseasPrice', sorter: true, render: (text, record) => (
                    <span style={{ color: '#ff4200'}}>{text && `￥${text.toFixed(2)}`}</span>
                ), sorter: true
            },
            {
                title: '代理价格', dataIndex:'agentPrice',render:(text, record) => (
                    <input type="number" ref="agentPrice" className="agentPrice" onChange={self._agentPrice.bind(self, record)}/>
                )
            },            
            {
                title: '是否允许代理', dataIndex: 'isAgent', render:(text, record) => (
                    <input type="checkbox" ref="isAgent" className="isAgent"/>
                )
            },
            { title: '操作', render: (text, record) => (
                <span>
                    <a onClick={self.goNewProduct.bind(self, record)}>查看详情</a>
                </span>
            )},
        ];
        const agentColumns = [
            { title: '商品', width: 350, render: (text, record) => (
                <div className="commodity">
                    <div className="imgContainer">
                        <img className="cargoImg" src={record.mainImage + Configuration.OSS_IMG_100W_100H} onClick={self._zoomImg.bind(self)}/>
                    </div>
                    <div className="proName">{record.name}</div>
                </div>
            )},
            { title: '售价', dataIndex: 'price', sorter: true, render: (text, record) => (
                    <span style={{ color: '#ff4200'}}>{text && `￥${text.toFixed(2)}`}</span>
                )
            },
            { title: '代理价格', dataIndex: 'agentPrice', sorter: true, render: (text, record) => (
                    <span style={{ color: '#ff4200'}}>{text && `￥${text.toFixed(2)}`}</span>
                )
            },           
            { title: '操作', render: (text, record) => (
                <span>
                    <a onClick={self.goNewProduct.bind(self, record)}>查看详情</a>
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
            onChange(selectedRowKeys, selectedRows) {
                // console.log(selectedRows);
                self.setState({
                    selectedRowKeys,
                });
            },
            onSelect(record, selected, selectedRows) {
            }
        };

        const modalTitle = '查看详情';
        const uneditable = true;
        return (
            <div id="contentWarehouse">
                <div className="loading" style={{ display: 'none' }}>
                    <img src="/loading.gif" className="loadingImg importLoading"></img>
                </div>
                <div className="product-category">
                    {categoryArr ? categoryArr.map((type, index) => (
                        <div className="category-item" key={index}>
                            <div className={`item ${type.isActive}`} onClick={self._clickCategory.bind(self, type.name)} >
                                {type.name}
                            </div>
                            { type.subs ? type.subs.map((sub, index1) => (
                                <div key={index1} className={`second-item ${type.isActive}`} onClick={self._clickSecondCategory.bind(self, sub, type.name)}>{sub}</div>
                            )) : ''}
                        </div>
                    )) : ''}
                </div>
                <div className="productDeta">
                    <nav className="navigate">
                        <input type="text" className="search" placeholder = "输入关键字进行搜索" onKeyDown = {self._inputSearch.bind(self)} />
                        <div className="grabble" onClick= {self._clickSearch.bind(self)}>搜索</div>
                        <button className="entrance" onClick={self._multiImport.bind(self)}>批量导入</button>
                    </nav>
                    <Table className="table"
                        rowKey={record => record._id}
                        rowSelection={rowSelection}
                        columns={self.props.importType === 'agent'? agentColumns : columns}
                        dataSource={goodsList}
                        pagination={pagination}
                        onChange={self.tableChange.bind(self)}
                        locale={{emptyText: self.props.isDataReady ? '您已导入该分类的全部商品' : '数据加载中'}}
                    />
                    <Modal title={modalTitle} className="productModal" visible={self.state.visible} onText='保存' onCancel={() => { self.setState({ product: null, visible: false }); } } footer={false}>
                        {self.state.product && (<NewProduct ref="newProduct" product={self.state.product} categories={categoryArr} Utility={Utility} Configuration={Configuration} uneditable={uneditable} _saveProduct={self._saveProduct.bind(self)} _cancelEditProduct={self._cancelEditProduct.bind(self)}/> )}
                    </Modal>
                    <Modal title='' className="imgModal" visible={self.state.imgVisible} onText='保存' onCancel={() => { self.setState({ imgVisible: false, imgSrc: '' })} } footer={false}>
                        <img src={self.state.imgSrc} />
                    </Modal>                    
                </div>
            </div>
        );
    }
    // 点击这么大图片
    _zoomImg (e) {
        // debugger;
        const self = this;
        const { Configuration } = self.props.context();
        const imgSrc = e.currentTarget.src.split('@!100w_100h')[0] + Configuration.OSS_IMG_ORIGINAL;
        self.setState({ imgVisible: true, imgSrc });
    }    
    // 代理价
    _agentPrice(record, e){
        const self = this;
        const agentPrice = e.currentTarget.value;
        let selectedRowKeysArr = self.state.selectedRowKeysArr;
        const _idArr = _.pluck(selectedRowKeysArr, '_id');
        if (!agentPrice) {
            $(e.currentTarget).parent().parent().find('.isAgent').attr('checked', false);
            selectedRowKeysArr = _.without(selectedRowKeysArr, record._id);
        } else {
            $(e.currentTarget).parent().parent().find('.isAgent').attr('checked', true);
            if(!_.contains(_idArr, record._id)) {
                selectedRowKeysArr.push({ _id: record._id });    
            }
            _.each(selectedRowKeysArr, (selected, index) => {
                if (selected._id === record._id) {
                    selected.agentPrice = agentPrice;
                }
            });
        }
        self.setState({
            selectedRowKeysArr,
        });
    }
    // 排序
    tableChange(pagination, filters, sorter) {
        const self = this;
        const { LocalState } = self.props.context();
        const contentLimiter = LocalState.get('contentLimiter');
        if (sorter.columnKey) {
            contentLimiter.options.sort = {
                [sorter.columnKey]: sorter.order === 'descend' ? -1 : 1,
            };
            LocalState.set('contentLimiter', contentLimiter);
        }
    }
    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const contentLimiter = LocalState.get('contentLimiter');
        contentLimiter.options.skip = (page - 1) * contentLimiter.options.limit;
        LocalState.set('contentLimiter', contentLimiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const contentLimiter = LocalState.get('contentLimiter');
        contentLimiter.options.limit = size;
        contentLimiter.options.skip = (page - 1) * contentLimiter.options.limit;
        LocalState.set('contentLimiter', contentLimiter);
    }

    // 保存商品
    _saveProduct() {
        const self = this;
        self.setState({ product:null, visible: false });
    }
    // 取消商品
    _cancelEditProduct(){
        const self = this;
        self.setState({ product:null, visible: false });
    }
    // 查看产品详情
    goNewProduct(product) {
        const self = this;
        self.setState({product, visible: true});
    }
    // 点击目录
    _clickCategory(category, e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const contentLimiter = LocalState.get('contentLimiter');
        const previewCatagory = self.state.category;
        self.setState({
            category,
            subCategory: '',
        });
        if (previewCatagory === category) {
            if (category !== '全部商品') {
                if ($(e.currentTarget).siblings('.second-item').eq(0)[0].style.display === 'block') {
                    $(e.currentTarget).siblings('.second-item').hide();
                } else {
                    $(e.currentTarget).siblings('.second-item').show();
                }
            }
        } else {
            $('#contentWarehouse .product-category .item').removeClass('active');
            $(e.currentTarget).siblings('.second-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            $(e.currentTarget).parent().siblings('.category-item')
                .find('.second-item')
                .hide();
            $(e.currentTarget).siblings('.second-item').show();
        }
        if (category === '全部商品') {
            delete contentLimiter.selector.category;
            delete contentLimiter.selector.subCategory;
        } else {
            contentLimiter.selector.category = category;
            delete contentLimiter.selector.subCategory;
        }
        delete contentLimiter.name;

        contentLimiter.options.skip = 0;
        LocalState.set('contentCurrentPage', 1);
        LocalState.set('contentLimiter', contentLimiter);
    }
    // 点击二级目录的事件
    _clickSecondCategory(subCategory, category, e) {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        self.setState({
            category,
            subCategory,
        });
        $(e.currentTarget).siblings('.second-item').removeClass('active');
        $(e.currentTarget).siblings('.item').removeClass('active');
        $(e.currentTarget).addClass('active');
        const contentLimiter = LocalState.get('contentLimiter');
        contentLimiter.selector.category = category;
        contentLimiter.selector.subCategory = subCategory;
        contentLimiter.options.skip = 0;
        LocalState.set('contentCurrentPage', 1);
        LocalState.set('contentLimiter', contentLimiter);
    }

    // 批量导入方法
    _multiImport() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const selectedRowKeysArr = self.state.selectedRowKeysArr;
        const selectedRowKeys = self.state.selectedRowKeys;
        const checkedArr = [];
        // console.log(selectedRowKeysArr);
        // console.log(selectedRowKeys);
        if(selectedRowKeysArr.length) {
            _.each(selectedRowKeys, (_id) => { 
                _.each(selectedRowKeysArr, (selectedObj) => {
                    if (_id === selectedObj._id) {
                        checkedArr.push({
                            _id,
                            agentPrice: selectedObj.agentPrice
                        });
                    } else {
                        checkedArr.push({
                            _id,
                            agentPrice: ''
                        });
                    }
                });
            });
        } else {
            _.each(selectedRowKeys, (_id) => { 
                    checkedArr.push({
                        _id,
                    });
            });
        }
        const contentLimiter = LocalState.get('contentLimiter');
        if (!selectedRowKeys.length) {
            alert('请至少选择一项进行批量导入！');
        } else {
            const confirm = window.confirm('确认导入？');
            if (confirm) {
                $('.productDeta .entrance').attr('disabled', true);
                $('.productDeta .entrance').css('backgroundColor', '#999');
                $('#contentWarehouse .loading').show();
                // console.log(checkedArr);
                Meteor.call('Product.methods.updateCreatedBy', checkedArr, (err) => {
                    if (!err) {
                        $('#contentWarehouse .loading').hide();
                        $('.productDeta .entrance').attr('disabled', false);
                        $('.productDeta .entrance').css('backgroundColor', '#04be02');

                        contentLimiter.selector._id = { $nin: selectedRowKeys };

                        LocalState.set('contentLimiter', contentLimiter);
                        self.setState({ selectedRowKeys: [], checkedArr:[], selectedRowKeysArr: [] });
                    } else {
                        alert('导入失败！');
                        $('#contentWarehouse .loading').hide();
                        $('.productDeta .entrance').attr('disabled', false);
                        $('.productDeta .entrance').css('backgroundColor', '#04be02');
                        return;
                    }
                });
            }
        }
    }
    // 搜索
    _inputSearch(e) {
        if (e.keyCode === 13) {
            const self = this;
            const { context } = self.props;
            const { LocalState } = context();
            const name = e.currentTarget.value.trim();
            const contentLimiter = LocalState.get('contentLimiter');
            contentLimiter.selector.name = {
                $regex: name,
                $options: 'i',
            };
            contentLimiter.options.skip = 0;
            LocalState.set('contentLimiter', contentLimiter);
        }
    }
    _clickSearch() {
        const self = this;
        const { context } = self.props;
        const { LocalState } = context();
        const name = $('.navigate .search').val().trim();

        const contentLimiter = LocalState.get('contentLimiter');

        contentLimiter.selector.name = {
            $regex: name,
            $options: 'i',
        };
        contentLimiter.options.skip = 0;
        LocalState.set('contentLimiter', contentLimiter);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState, Collections } = context();
    const currentUser = Meteor.user() || {};
    const importType = location.search.split('?import=')[1];
    if (!LocalState.get('contentLimiter')) {
        LocalState.set('contentLimiter', {
            selector: {
                publisher: 0,
                isRemoved: { $ne: true },
            },
            options: {
                skip: 0,
                limit: 10,
            },
        });
    }

    const contentLimiter = LocalState.get('contentLimiter');
    
    if (importType === 'agent') {
        contentLimiter.selector.publisher = 1;
        contentLimiter.selector.createdBy = { $in: currentUser.saleAgent };
        contentLimiter.selector.agentPrice = { $gt: 0 };
    } else if (importType === 'agentBuy') {
        contentLimiter.selector.replaceBuyerId = {
            $exists: true,
            $ne: Meteor.userId(),
        };
        contentLimiter.selector.publisher = 1;
    }
    // 订阅买手发布的产品总数
    Meteor.subscribe('Product.contentProductCount', contentLimiter);
    // 订阅除买手发布的产品列表
    const isDataReady = Meteor.subscribe('Product.extraProductList', contentLimiter).ready();
    Meteor.subscribe('Product.category');

    const goodsList = Collections.Product.find().fetch();
    const categoryArr = Collections.Category.find().fetch();
    const count = Counts.get('contentProductCount');

    categoryArr.unshift({ name: '全部商品', isActive: 'active', subs: [] });

    _.each(categoryArr, (item) => {
        if (item.name === '全部商品') {
            item.isActive = 'active';
        } else {
            item.isActive = '';
        }
    });

    $('#contentWarehouse .loading').hide();
    // // console.log(goodsList);
    onData(null, { goodsList, count, categoryArr, isDataReady, importType });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
