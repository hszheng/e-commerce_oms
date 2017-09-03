import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '../core/Loading';

import { Modal } from 'antd';
export default class NewProduct extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);

        const self = this;
        self.state = {
            product: props.product,
            categories: props.categories,
            subs: props.categories[0].subs,
            visible: false,
        };        

        if (props.product.category &&
            _.findWhere(props.categories, { name: props.product.category })) {
            self.state.subs = _.findWhere(props.categories, { name: props.product.category }).subs;
        }        
    }
    componentWillUnmount() {
        // 加载component时执行
    }

    componentDidMount() {
        // 加载component时执行
        const self = this;
        const { Configuration } = self.props;
        const product = self.state.product;
        if (self.props.uneditable) {
            _.each($('#productDetail input'), (item) => {
                item.disabled = true;
            });
            _.each($('#productDetail select'), (item) => {
                item.disabled = true;
            });
            $('textarea')[0].disabled = true;
        }
    }

    render() {
        const self = this;
        const { Configuration } = self.props;
        const product = self.state.product;
        // // console.log(product);
        return (
            <div id="productDetail">
                <div className="loading" style={{ display: 'none' }}>
                    <img src="/loading.gif" className="loadingImg importLoading"></img>
                </div>
                <div className="productInfo">
                    <div className="commodityInfo">
                        <div className="rows">
                            <div className="itemOnLeft">
                                <b>商品类别</b>
                                <select defaultValue={product.category} ref="category" onChange={self.changeCategory.bind(self)} className="category">
                                { self.state.categories.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                                </select>
                            </div>
                            <div className="itemOnRight">
                                <b>商品子类</b>
                                <select defaultValue={product.subCategory} ref="subCategory" className="subCategory">
                                    { self.state.subs.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="rows">
                            <div className="itemOnLeft"><b>商品名称</b><input type="text" className="commodity" defaultValue={product.name} ref="name"/></div>
                            <div className="itemOnRight"><b>售&nbsp;&nbsp;价(￥)</b><input type="text" className="sell" defaultValue={product.price || 0} ref="price"/></div>
                        </div>
                        <div className="rows">
                            <div className="itemOnLeft"><b>报关中文名</b><input type="text" name="surname" defaultValue={product.surname} ref="surname"/></div>
                            <div className="itemOnRight"><b>品&nbsp;&nbsp;&nbsp;牌</b><input type="text" name="brand" defaultValue={product.brand} ref="brand"/></div>
                        </div>
                        <div className="rows">
                            <div className="itemOnLeft"><b>折&nbsp;扣&nbsp;价(￥)</b><input type="text" className="rebate" defaultValue={product.disaccountPrice || 0} ref="disaccountPrice"/></div>
                            <div className="itemOnRight"><b>折扣价有效期(￥)</b>
                                <input type="date" className="end" defaultValue={product.disaccountPriceValidate} ref= "disaccountPriceValidate"/>
                            </div>
                        </div>
                        <div className="rows">
                            <div className="itemOnLeft"><b>运&nbsp;&nbsp;&nbsp;费(￥)</b><input type="text" defaultValue={product.fare} ref="fare"/></div>
                            <div className="itemOnRight"><b>关&nbsp;&nbsp;&nbsp;税(￥)</b><input type="text" defaultValue={product.tariff} ref="tariff"/></div>
                        </div>
                        {
                            Meteor.user() && Meteor.user().status.indexOf(2) === -1 && (
                                <div className="rows">
                                    <div className="itemOnLeft"><b>国外进货价($)</b><input type="text" defaultValue={product.overseasPrice || 0} ref="overseasPrice"/></div>
                                    <div className="itemOnRight"><b>代理价格(￥)</b><input type="text" defaultValue={product.agentPrice || 0} ref="agentPrice" /></div>
                                </div>
                            )
                        }
                        <div className="rows">
                            {
                                //  (()=> {
                                //     if(self.state.product.replaceBuyerPrice){
                                        
                                //         return (
                                //                 <div>
                                //                     <div className="itemOnLeft"><b>可代买店铺</b><input type="text" defaultValue={Meteor.user().storeName} ref="displayStoreName"/></div>
                                //                     <div className="itemOnRight"><b>代买价格(￥)</b><input type="text" defaultValue={product.replaceBuyerPrice} ref="replaceBuyerPrice"/></div>
                                //                 </div>
                                //                 )
                                //     } else {
                                //            return  (
                                //                     <div>
                                //                         <div className="itemOnLeft"><input type="checkbox" ref="agentBuyer" style={{marginLeft: '50px', width: '25px'}} onClick={self._listenToBuyerPrice.bind(self)} />是否可以帮其他买手代买</div>
                                //                         <div className="itemOnRight marginLeft replaceBuyerPrice"><b>代买价格(￥)</b><input type="text" disabled="disabled" defaultValue= {0} ref="replaceBuyerPrice"/></div>
                                //                     </div>
                                //                     )
                                //             }
                                // })()
                                
                            }
                        </div>                      

                        {
                            // <div className="domestic">
                            //     <div className="price"><b// console>国内价(￥)：</b><input type="text" name="price" defaultValue={product.civilPrice} ref="civilPrice"/></div>
                            //     <div className="address"><b>查询地址：</b><input type="text" name="price" defaultValue={product.civilPriceUrl} ref="civilPriceUrl"/></div>
                            // </div>
                            // <div className="foreign">
                            //     <div className="price"><b>国外价($)：</b><input type="text" name="price" defaultValue={product.overseasPrice} ref="overseasPrice"/></div>
                            //     <div className="address"><b>查询地址：</b><input type="text" name="price" defaultValue={product.overseasPriceUrl} ref="overseasPriceUrl"/></div>
                            // </div>
                                            }
                        <div className="synopsis">
                            <span className="summary"><b className="descTitle">商品详情：</b></span>
                            <textarea ref="description" defaultValue= {product.description}></textarea>
                        </div>
                    </div>
                    {
                    //     <div className="parameters">
                    //     <div className="commInfo">
                    //         <span className="parametric"><b>详细参数：</b></span>
                    //         <div className="addData" onClick={self._openAddData.bind(self)}>添加更多参数</div>
                    //     </div>
                    //     {product.detail.brand && (<div className="dataFull">
                    //         <b>品牌：</b>
                    //         <input type="text" name="brands" ref= "brands" defaultValue={product.detail.brand} />
                    //         </div>)}
                    //    {product.detail.factoryName && (<div className="dataFull">
                    //         <b className="title">厂名：</b>
                    //         <input type="text" name="factoryName" ref="factoryName" defaultValue={product.detail.factoryName} />
                    //     </div>)}
                    //     {product.detail.factoryAddress && (<div className="dataFull">
                    //         <b className="title">厂址：</b>
                    //         <input type="text" name="factoryAddress" ref="factoryAddress" defaultValue={product.detail.factoryAddress} />
                    //     </div>)}
                    //     {product.detail.manufacturersContact && (<div className="dataFull">
                    //         <b className="title">美国厂家联系方式：</b>
                    //         <input type="text" name="manufacturersContact" ref="manufacturersContact" defaultValue={product.detail.manufacturersContact} />
                    //     </div>)}
                    //     {product.detail.shelfLife && (<div className="dataFull">
                    //         <b className="title">保质期：</b>
                    //         <input type="text" name="shelfLife" ref="shelfLife" defaultValue={product.detail.shelfLife} />
                    //     </div>)}
                    //     {product.detail.netWeight && (<div className="dataFull">
                    //         <b className="title">净含量：</b>
                    //         <input type="text" name="netWeight" ref="netWeight" defaultValue={product.detail.netWeight} />
                    //     </div>)}
                    //     {product.detail.packing && (<div className="dataFull">
                    //         <b className="title">包装方式：</b>
                    //         <input type="text" name="packing" ref="netWeight" defaultValue={product.detail.packing} />
                    //     </div>)}
                    //     {product.detail.category && (<div className="dataFull">
                    //         <b className="title">种类：</b>
                    //         <input type="text" name="category" ref="category" defaultValue={product.detail.category} />
                    //     </div>)}
                    //     {product.detail.series && (<div className="dataFull">
                    //         <b className="title">系列：</b>
                    //         <input type="text" name="series" ref="series" defaultValue={product.detail.series} />
                    //     </div>)}
                    //     {product.detail.origin && (<div className="dataFull">
                    //         <b className="title">产地：</b>
                    //         <input type="text" name="origin" ref="origin" defaultValue={product.detail.origin} />
                    //     </div>)}
                    //     {product.detail.pricing && (<div className="dataFull">
                    //         <b className="title">计价方式：</b>
                    //         <input type="text" name="pricing" ref="pricing" defaultValue={product.detail.pricing} />
                    //     </div>)}
                    //     {product.detail.specification && (<div className="dataFull">
                    //         <b className="title">规格：</b>
                    //         <input type="text" name="specification" ref="specification" defaultValue={product.detail.specification} />
                    //     </div>)}
                    //     {product.detail.sales && (<div className="dataFull">
                    //         <b className="title">销售地：</b>
                    //         <input type="text" name="sales" ref="sales" defaultValue={product.detail.sales} />
                    //     </div>)}
                    //     {product.detail.use && (<div className="dataFull">
                    //         <b className="title">用途：</b>
                    //         <input type="text" name="use" ref="use" defaultValue={product.detail.use} />
                    //     </div>)}
                    //     {product.detail.color && (<div className="dataFull">
                    //         <b className="title">颜色：</b>
                    //         <input type="text" name="color" ref="color" defaultValue={product.detail.color} />
                    //     </div>)}
                    //     {product.detail.size && (<div className="dataFull">
                    //         <b className="title">尺寸：</b>
                    //         <input type="text" name="size" ref="size" defaultValue={product.detail.size} />
                    //     </div>)}
                    //     {product.detail.model && (<div className="dataFull">
                    //         <b className="title">型号：</b>
                    //         <input type="text" name="model" ref="model" defaultValue={product.detail.model} />
                    //     </div>)}
                    //     {product.detail.capacity && (<div className="dataFull">
                    //         <b className="title">容量：</b>
                    //         <input type="text" name="capacity" ref="capacity" defaultValue={product.detail.capacity} />
                    //     </div>)}
                    //     {product.detail.gender && (<div className="dataFull">
                    //         <b className="title">性别：</b>
                    //         <input type="text" name="gender" ref="gender" defaultValue={product.detail.gender} />
                    //     </div>)}
                    //     {product.detail.volume && (<div className="dataFull">
                    //         <b className="title">体积：</b>
                    //         <input type="text" name="volume" ref="volume" defaultValue={product.detail.volume} />
                    //     </div>)}
                    //     {product.detail.other && (<div className="dataFull">
                    //         <b className="title">其它：</b>
                    //         <input type="text" name="other" ref="other" defaultValue={product.detail.other} />
                    //     </div>)}
                    //     {product.detail.TTM && (<div className="dataFull">
                    //         <b className="title">上市时间：</b>
                    //         <input type="text" name="TTM" ref="TTM" defaultValue={product.detail.TTM} />
                    //     </div>)}
                    //     {product.detail.material && (<div className="dataFull">
                    //         <b className="title">材质：</b>
                    //         <input type="text" name="material" ref="material" defaultValue={product.detail.material} />
                    //     </div>)}
                    //     {product.detail.effect && (<div className="dataFull">
                    //         <b className="title">功效：</b>
                    //         <input type="text" name="effect" ref="effect" defaultValue={product.detail.effect} />
                    //     </div>)}
                    //     {product.detail.approvalNo && (<div className="dataFull">
                    //         <b className="title">批准文号：</b>
                    //         <input type="text" name="approvalNo" ref="approvalNo" defaultValue={product.detail.approvalNo} />
                    //     </div>)}
                    //     {product.detail.forSkin && (<div className="dataFull">
                    //         <b className="title">适合肤质：</b>
                    //         <input type="text" name="forSkin" ref="forSkin" defaultValue={product.detail.forSkin} />
                    //     </div>)}
                    //     {product.detail.foodAdditives && (<div className="dataFull">
                    //         <b className="title">食品添加剂：</b>
                    //         <input type="text" name="foodAdditives" ref="foodAdditives" defaultValue={product.detail.foodAdditives} />
                    //     </div>)}
                    //     {product.detail.forAge && (<div className="dataFull">
                    //         <b className="title">适用年龄：</b>
                    //         <input type="text" name="forAge" ref="forAge" defaultValue={product.detail.forAge} />
                    //     </div>)}
                    //     {product.detail.forPhase && (<div className="dataFull">
                    //         <b className="title">适用阶段：</b>
                    //         <input type="text" name="forPhase" ref="forPhase" defaultValue={product.detail.forPhase} />
                    //     </div>)}
                    //     {product.detail.storageMethod && (<div className="dataFull">
                    //         <b className="title">储藏方法：</b>
                    //         <input type="text" name="storageMethod" ref="storageMethod" defaultValue={product.detail.storageMethod} />
                    //     </div>)}
                    //     {product.detail.taste && (<div className="dataFull">
                    //         <b className="title">口味：</b>
                    //         <input type="text" name="taste" ref="taste" defaultValue={product.detail.taste} />
                    //     </div>)}
                    //     {product.detail.cycle && (<div className="dataFull">
                    //         <b className="title">周期：</b>
                    //         <input type="text" name="cycle" ref="cycle" defaultValue={product.detail.cycle} />
                    //     </div>)}
                    //     {product.detail.no && (<div className="dataFull">
                    //         <b className="title">货号：</b>
                    //         <input type="text" name="no" ref="no" defaultValue={product.detail.no} />
                    //     </div>)}
                    //     {product.detail.useMode && (<div className="dataFull">
                    //         <b className="title">使用方式：</b>
                    //         <input type="text" name="useMode" ref="useMode" defaultValue={product.detail.useMode} />
                    //     </div>)}
                    //     {product.detail.features && (<div className="dataFull">
                    //         <b className="title">特性：</b>
                    //         <input type="text" name="features" ref="features" defaultValue={product.detail.features} />
                    //     </div>)}
                    //     {product.detail.forPeople && (<div className="dataFull">
                    //         <b className="title">适用人群：</b>
                    //         <input type="text" name="forPeople" ref="forPeople" defaultValue={product.detail.forPeople} />
                    //     </div>)}
                    //     {product.detail.powerSupply && (<div className="dataFull">
                    //         <b className="title">供电方式：</b>
                    //         <input type="text" name="powerSupply" ref="powerSupply" defaultValue={product.detail.powerSupply} />
                    //     </div>)}
                    //     {product.detail.shoeSize && (<div className="dataFull">
                    //         <b className="title">鞋码：</b>
                    //         <input type="text" name="shoeSize" ref="shoeSize" defaultValue={product.detail.shoeSize} />
                    //     </div>)}
                    //     {product.detail.upperHeight && (<div className="dataFull">
                    //         <b className="title">鞋帮高度：</b>
                    //         <input type="text" name="upperHeight" ref="upperHeight" defaultValue={product.detail.upperHeight} />
                    //     </div>)}
                    //     {product.detail.thickness && (<div className="dataFull">
                    //         <b className="title">厚薄：</b>
                    //         <input type="text" name="thickness" ref="thickness" defaultValue={product.detail.thickness} />
                    //     </div>)}
                    //     {product.detail.length && (<div className="dataFull">
                    //         <b className="title">长度：</b>
                    //         <input type="text" name="length" ref="length" defaultValue={product.detail.length} />
                    //     </div>)}
                    //     <div className="addContainer"></div>
                    // </div>
                }
                    <div className="describe">
                        <div style={{ overflow: 'hidden', marginBottom: '15px' }}>
                            <span className="depict">
                                <b className="descTitle">详情描述图：</b>
                            </span>
                            <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
                                <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*" title="上传图片" multiple="multiple"/>
                            </span>
                        </div> 
                        <div className="figDeta">
                            { product.descImage.map( (desc, index)=>(
                                <div className="bewrite" key={index}>
                                    <div className="picture">
                                        <img className="commImg" src={ desc + Configuration.OSS_IMG_100W_100H ? desc + Configuration.OSS_IMG_100W_100H : "/white.png"} onClick={self.viewLargeImg.bind(self)}/>
                                        {
                                                // <img className="main active" src="/productDetail/main.png" />
                                        }
                                        <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self, index)}>-</span>
                                    </div>
                                    
                                    {
                                        // <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                        // <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                    }
                                </div>
                                ))
                            }
                                
                            {
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                                // <div className="bewrite">
                                //     <div className="picture">
                                //         <img className="commImg" src="/white.png" onClick={self.viewLargeImg.bind(self)}/>
                                //         <img className="main" src="/productDetail/main.png" />
                                //         <span className="deleteDescImage" onClick={self.deleteDescImage.bind(self)}>-</span>
                                //     </div>
                                //     <input type="file" className="upload" onChange={self.uploadImages.bind(self)} ref="banners" accept="image/*"/>
                                //     <div className="instal" onClick={self._siteMainMap.bind(self)}>设置为主图</div>
                                // </div>
                            }
                        </div>
                        {
                            !self.props.uneditable && (
                                <div className="btn-container">
                                    <button type="button" className="save" onClick={self._saveProduct.bind(self)}>保存</button>
                                    <button type="button" className="cancel" onClick={self._cancelEditProduct.bind(self)}>取消</button>     
                                </div>
                            )
                        }                        
                    </div>
                </div>
                {
                    // <Modal
                    //     className="addMaterial"
                    //     title="添加更多参数"
                    //     width={1000}
                    //     visible={self.state.moreDataVisible}
                    //     onCancel={() => { self.setState({ moreDataVisible: false }) }}
                    //     okText="确定添加"
                    //     footer={false}
                    //     style={{ top: '50px' }}
                    // >
                    //     <div className="common">通用参数：</div>
                    //     <div className="community">
                    //         <div className="parameter" data-id="factoryName" onClick={self._selectData.bind(self)}>厂名</div>
                    //         <div className="parameter" data-id="factoryAddress" onClick={self._selectData.bind(self)}>厂址</div>
                    //         <div className="parameter" data-id="manufacturersContact" onClick={self._selectData.bind(self)}>厂家联系方式</div>
                    //         <div className="parameter" data-id="series" onClick={self._selectData.bind(self)}>系列</div>
                    //         <div className="parameter" data-id="specification" onClick={self._selectData.bind(self)}>规格</div>
                    //         <div className="parameter" data-id="sales" onClick={self._selectData.bind(self)}>销售地</div>
                    //         <div className="parameter" data-id="use" onClick={self._selectData.bind(self)}>用途</div>
                    //         <div className="parameter" data-id="model" onClick={self._selectData.bind(self)}>型号</div>
                    //         <div className="parameter" data-id="capacity" onClick={self._selectData.bind(self)}>容量</div>
                    //         <div className="parameter" data-id="color" onClick={self._selectData.bind(self)}>颜色</div>
                    //         <div className="parameter" data-id="size" onClick={self._selectData.bind(self)}>尺寸</div>
                    //         <div className="parameter" data-id="gender" onClick={self._selectData.bind(self)}>性别</div>
                    //         <div className="parameter" data-id="volume" onClick={self._selectData.bind(self)}>体积</div>
                    //         <div className="parameter" data-id="other" onClick={self._selectData.bind(self)}>其它</div>
                    //         <div className="parameter" data-id="TTM" onClick={self._selectData.bind(self)}>上市时间</div>
                    //         <div className="parameter" data-id="material" onClick={self._selectData.bind(self)}>材质</div>
                    //     </div>
                    //     <div className="cosmetic">化妆品类参数：</div>
                    //     <div className="toiletries">
                    //         <div className="parameter" data-id="effect" onClick={self._selectData.bind(self)}>功效</div>
                    //         <div className="parameter" data-id="approvalNo" onClick={self._selectData.bind(self)}>批准文号</div>
                    //         <div className="parameter" data-id="forSkin" onClick={self._selectData.bind(self)}>适合肤质</div>
                    //     </div>
                    //     <div className="foodstuff">食品类参数：</div>
                    //     <div className="eatables">
                    //         <div className="parameter" data-id="foodAdditives" onClick={self._selectData.bind(self)}>食品添加剂</div>
                    //         <div className="parameter" data-id="forAge" onClick={self._selectData.bind(self)}>使用年龄</div>
                    //         <div className="parameter" data-id="forPhase" onClick={self._selectData.bind(self)}>适用阶段</div>
                    //         <div className="parameter" data-id="storageMethod" onClick={self._selectData.bind(self)}>储藏方法</div>
                    //         <div className="parameter" data-id="taste" onClick={self._selectData.bind(self)}>口味</div>
                    //         <div className="parameter" data-id="cycle" onClick={self._selectData.bind(self)}>周期</div>
                    //     </div>
                    //     <div className="electron">电子类参数：</div>
                    //     <div className="model">
                    //         <div className="parameter" data-id="no" onClick={self._selectData.bind(self)}>货号</div>
                    //         <div className="parameter" data-id="useMode" onClick={self._selectData.bind(self)}>使用方式</div>
                    //         <div className="parameter" data-id="features" onClick={self._selectData.bind(self)}>特性</div>
                    //         <div className="parameter" data-id="forPeople" onClick={self._selectData.bind(self)}>适用人群</div>
                    //         <div className="parameter" data-id="powerSupply" onClick={self._selectData.bind(self)}>供电方式</div>
                    //     </div>
                    //     <div className="apparel">服装鞋包参数：</div>
                    //     <div className="raiment">
                    //         <div className="parameter" data-id="shoeSize" onClick={self._selectData.bind(self)}>鞋码</div>
                    //         <div className="parameter" data-id="upperHeight" onClick={self._selectData.bind(self)}>鞋帮高度</div>
                    //         <div className="parameter" data-id="thickness" onClick={self._selectData.bind(self)}>厚薄</div>
                    //         <div className="parameter" data-id="length" onClick={self._selectData.bind(self)}>长度</div>
                    //     </div>
                    //     <div className="defineAdd" onClick={self._addParameter.bind(self)}>确定添加</div>
                    // </Modal>
                }
                <Modal title='' className="imgModal" visible={self.state.imgVisible} onText='保存' onCancel={() => { self.setState({ imgVisible: false, imgSrc: '' })} } footer={false}>
                    <img src={self.state.imgSrc} />
                </Modal>
            </div>
        );
    }
    // 监听是否有选择可代买
    _listenToBuyerPrice(e) {

        if(e.currentTarget.checked) {
            $('.replaceBuyerPrice input')[0].disabled = false;
        } else {
            $('.replaceBuyerPrice input')[0].disabled = true;
        }
    }
    // 改变目录时触发子目录改变
    changeCategory() {
        const self = this;
        const subs = _.findWhere(self.state.categories, { name: self.refs.category.value }).subs;
        self.setState({subs: subs});

    }
    // 查看大图
    viewLargeImg(e) {
        // const img = e.currentTarget;
        //     img.src = img.src.replace('100w', '800w');
        //     img.src = img.src.replace('100h', '800h');
        // if (img.src.substring(img.src.lastIndexOf('/') + 1) !== 'white.png') {
        //     window.open(img.src);
        // }
        const self = this;
        const { Configuration } = self.props;
        const imgSrc = e.currentTarget.src.split('@!100w_100h')[0] + Configuration.OSS_IMG_ORIGINAL;
        self.setState({ imgVisible: true, imgSrc });        
    }
    // 取消保存
    cancelProduct(e) {
        history.back();
    }
    // 删除详情图
    deleteDescImage(index, e) {
        // 删除图片
        const self = this;
        const product = self.state.product;
        product.descImage.splice(index, 1);
        self.setState({ product });
    }  
    // 设为主图
   _siteMainMap(e) {
        const self = this;
        if(self.props.uneditable){
            return;
        }
        if ($(e.currentTarget).siblings('.picture').find('.commImg').attr('src') === '/white.png') {
            return alert('请上传图片');
        }
        $('#productDetail .productInfo .describe .figDeta .bewrite .picture .main').removeClass('active');
        $(e.currentTarget).siblings('.picture').children('.main')
        .addClass('active');
    }

    uploadImages(e) {
        // 上传图片
        const self = this;
        const { Utility, Configuration } = self.props;
        _.each(e.currentTarget.files, (file) => {
            Utility.resizeImageAndUploadToOSS(file, {
                progress(e) {
                },
                uploaded(e, url) {
                    const product = self.state.product;
                    product.descImage.push(url);
                    self.setState({product});
                },
                failed(e) {
                    alert('上传失败');
                },
                canceled(e) {
                    alert('取消上传');
                },
            });
        });
    }
    // 显示添加更多参数
    _openAddData(e) {
        const self = this;
        const { product } = self.props;
        self.setState({ moreDataVisible: true });
    }

    // 选中添加的参数
    _selectData(e) {
        if(!$(e.currentTarget).hasClass('have')) {
            $(e.currentTarget).toggleClass('active');
        }
    }
    // 添加参数
    _addParameter(e) {
        const self = this;
        self.setState({ moreDataVisible: false });
        $('#productDetail .productInfo .parameters .addContainer').html('');
        const paramArr = [];
        _.each($('.parameters .dataFull b'),(item, index) =>{
            paramArr.push(item.innerHTML.trim().split('：')[0]);
        })
        $('.addMaterial .active').each(function(index,item) {
            const data = $('.addMaterial .active').eq(index).data('id');
            const name = $('.addMaterial .active').eq(index).html();
            if (!_.contains(paramArr, name)) {
                $('#productDetail .productInfo .parameters .addContainer').append(`<div class="dataFull"><b>${name}:</b><input type="text" name="${data}" ref="detail.${data}"/></div>`);                
            }

        });
    }
    // 取消编辑
    _cancelEditProduct() {
        const self = this;
        self.props._cancelEditProduct();
    }
    // 编辑商品保存
    _saveProduct(e) {
        const self = this;
        if (parseFloat(self.refs.disaccountPrice.value) && !self.refs.disaccountPriceValidate.value) {
            return alert('请选择折扣有效期');
        }
        const product = {
            category: self.refs.category.value || '其它',
            subCategory: self.refs.subCategory.value,
            name: self.refs.name.value,
            price: parseFloat(self.refs.price.value) || 0,
            disaccountPrice: parseFloat(self.refs.disaccountPrice.value) || 0,
            disaccountPriceValidate: self.refs.disaccountPriceValidate.value,
            brand: self.refs.brand.value,
            // overseasPriceUrl: self.refs.overseasPriceUrl.value,
            // civilPrice: parseFloat(self.refs.civilPrice.value),
            // civilPriceUrl: self.refs.civilPriceUrl.value,
            surname: self.refs.surname.value,
            description: self.refs.description.value,
            descImage: self.state.product.descImage,
            mainImage: self.state.product.descImage[0],
            momentsImage: '',
            fare: parseFloat(self.refs.fare.value) || 0,
            tariff: parseFloat(self.refs.tariff.value) || 0,
            replaceBuyerId: '',
            replaceBuyerName: '',
            replaceBuyerPrice: 0
        };
        if (self.refs.overseasPrice) {
            product.overseasPrice = parseFloat(self.refs.overseasPrice.value) || 0;
        }
        if (self.refs.agentPrice) {
            product.agentPrice = parseFloat(self.refs.agentPrice.value) || 0;
        }
        
        if (self.state.product._id) {
            product._id = self.state.product._id;
        }
        // debugger;
        if(self.refs.agentBuyer && self.refs.agentBuyer.checked) {
            const user = Meteor.user();
            product.replaceBuyerId = user._id;
            product.replaceBuyerName = user.storeName;
            product.replaceBuyerPrice = parseFloat(self.refs.replaceBuyerPrice.value) || 0;
        }
        //     replaceBuyerId: 'YLkwrRLP37J9ax9Tk', // 代买人userId
        //     replaceBuyerName: 'gavin代购小店', // 代买人店铺名称
        //     replaceBuyerPrice: 100, // 代买价格 
        // if()
        // 保存详情描述图
        // $.each($('#productDetail .bewrite .commImg[src!="/white.png"]'), (index, el) => {
        //     product.descImage.push($(el).attr('src').split('@!100w')[0]);
        // });
        // 保存主图
        // if ($('#productDetail .bewrite .main.active').siblings('.commImg[src!="/white.png"]').length > 0) {
        //     product.mainImage = $('#productDetail .bewrite .main.active').siblings('.commImg[src!="/white.png"]').attr('src')
        //     .split('@!100w')[0];
        // }
        
        // self._toFabricImage(product, (momentsImage) => {
        // product.momentsImage = momentsImage;
        // loading ...
        $('#productDetail .loading').show();
        
        if(product._id){
            // 更新商品
            const data = { _id: product._id, modifier: product };
            Meteor.call('Product.methods.update', data, (err) => {
                if (err) {
                    $('#productDetail .loading').hide();
                    window.alert('err:' + err);
                    self.props._saveProduct();
                    return;
                } else {
                    $('#productDetail .loading').hide();
                    // window.alert('编辑成功！');
                    self.props._saveProduct();
                }
            });
        } else {
            // 新增商品
            product.detail = {};
            delete product._id;
            const data = product;
            Meteor.call('Product.methods.insert', data, (err, result) => {
                if (err) {
                    window.alert('err:' + err);
                    $('#productDetail .loading').hide();
                    self.props._saveProduct();
                } else {
                    $('#productDetail .loading').hide();
                    // window.alert('新增成功！');
                    // // // console.log(result);
                    self.props._saveProduct();
                }
            });            
        }

    }

    // 生成朋友圈图片
    _toFabricImage(product, callback) {
        const self = this;

        const { Configuration} = self.props.context();

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
            bg.onerror = () => {
                self.updateMomentsImage(product, callback);   
            }
            bg.onload = () => {
                // 背景图
                ctx.drawImage(bg, (800 - bg.width) / 2, (800 - bg.height) / 2);
                self.updateMomentsImage(product, callback);
            };
            bg.src = product.mainImage + Configuration.OSS_IMG_ORIGINAL;
        } else {
            self.updateMomentsImage(product, callback);
        }
    }
    // 更新朋友圈图片
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
            // ctx.font = '25px Microsoft Yahei';
            ctx.font = '40px Microsoft Yahei';
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
            // ctx.font = '25px Microsoft Yahei';
            ctx.font = '40px Microsoft Yahei';
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
                callback && callback(url);
            },
            failed(e) {
                alert('上传失败');
            },
            canceled(e) {
                // // // console.log('canceled', e);
            },
        });
    }
}
