import React from 'react';
import { Button } from 'antd';
export default class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {};
    }
    render() {
        const self = this;
        const { description, products, userInfo, Configuration } = self.props;
        const previewProductItemDetail = self.state.previewProductItemDetail || products[0];
        // // console.log('userInfo', userInfo.services.wechat.headimgurl);
        return (
            <div id="previewIssue">
                <article className="beforehand">
                    <h1>预览</h1>
                    <article className="screenLeft">
                        <article className="previewLeft">
                         { products ? products.map((product, index) => (
                            <article className="productInfo" key={index} onClick={self._previewProduct.bind(self, product)}>
                                <img className="commImg" src={product.mainImage + Configuration.OSS_IMG_100W_100H} />
                                <article className="detail">
                                    <div className="title">{product.name}</div>
                                    <div className="domestic">国内价:￥<span className="price">{product.civilPrice}</span></div>
                                    <div className="foreign">售价:￥<span className="price">{product.disaccountPrice ? product.disaccountPrice : product.overseasPrice}</span></div>
                                    <img className="add" src="/previewlssue/add.png" />
                                </article>
                            </article>
                            )) : ''}
                            <article className="productData">
                                <div className="backBtn" onClick={self._backNewPreview.bind(self)}>
                                   <i className="fa fa-angle-left" aria-hidden="true"></i>
                                   <span className="backText">返回</span>
                                   <span className="titleText">商品详情</span>
                                </div>
                                <div className="merchandise"><img src={previewProductItemDetail.mainImage + Configuration.OSS_IMG_ORIGINAL} /></div>
                                <div className="operate-container">
                                    <div className="operate">
                                        <div className="title"><span className="productTitle">{previewProductItemDetail.name}</span></div>
                                        <div className="price">售价：￥<span className="univalent">{previewProductItemDetail.price}</span></div>
                                        <s className="domestic">国内价：<span className="internal">￥{previewProductItemDetail.civilPrice}</span></s>
                                    </div>
                                    <div className="join">
                                        <div className="addTo"></div>
                                    </div>
                                </div>
                                <div className="transport">
                                    <div className="postage">
                                        <span className="shipping">邮费</span>
                                        <span className="condition">￥{previewProductItemDetail.fare}</span>
                                    </div>
                                    <div className="customs">
                                        <span className="dues">关税</span>
                                        <span className="subsidy">￥{previewProductItemDetail.tariff}</span>
                                    </div>
                                </div>
                                <div className="productDesc">
                                    <div className="title">商品描述</div>
                                    <div className="proExplan">
                                        {previewProductItemDetail.description.split('\n').map((desc,index) => (<div key={index}>{desc}</div>))}
                                    </div>
                                </div>
                                <div className="outputInfo">
                                    <div className="goodsInfo">商品信息</div>
                                    <div className="parameter">
                                        <div className="prodPara">
                                            <span className="title">商品名称：</span>
                                            <span className="prodEx">{previewProductItemDetail.name}</span>
                                        </div>
                                        <div className="prodPara">
                                            <span className="title">当地售价：</span>
                                            <span className="prodEx">￥{previewProductItemDetail.overseasPrice}</span>
                                        </div>
                                        {previewProductItemDetail.detail.factoryName && (<div className="prodPara">
                                            <span className="title">厂名：</span>
                                            <span className="prodEx">previewProductItemDetail.detail.factoryName</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.factoryAddress && (<div className="prodPara">
                                            <span className="title">厂址：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.factoryAddress}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.manufacturersContact && (<div className="prodPara">
                                            <span className="title">美国厂家联系方式：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.manufacturersContact}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.shelfLife && (<div className="prodPara">
                                            <span className="title">保质期：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.shelfLife}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.netWeight && (<div className="prodPara">
                                            <span className="title">净含量：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.netWeight}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.packing && (<div className="prodPara">
                                            <span className="title">packing：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.packing}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.category && (<div className="prodPara">
                                            <span className="title">种类：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.category}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.brand && (<div className="prodPara">
                                            <span className="title">品牌：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.brand}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.series && (<div className="prodPara">
                                            <span className="title">系列：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.series}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.origin && (<div className="prodPara">
                                            <span className="title">产地：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.origin}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.pricing && (<div className="prodPara">
                                            <span className="title">计价方式：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.pricing}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.specification && (<div className="prodPara">
                                            <span className="title">规格：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.specification}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.sales && (<div className="prodPara">
                                            <span className="title">销售地：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.sales}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.use && (<div className="prodPara">
                                            <span className="title">用途：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.use}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.color && (<div className="prodPara">
                                            <span className="title">颜色：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.color}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.size && (<div className="prodPara">
                                            <span className="title">尺寸：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.size}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.model && (<div className="prodPara">
                                            <span className="title">型号：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.model}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.capacity && (<div className="prodPara">
                                            <span className="title">容量：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.capacity}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.gender && (<div className="prodPara">
                                            <span className="title">性别：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.gender}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.volume && (<div className="prodPara">
                                            <span className="title">体积：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.volume}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.other && (<div className="prodPara">
                                            <span className="title">其它：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.other}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.TTM && (<div className="prodPara">
                                            <span className="title">上市时间：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.TTM}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.material && (<div className="prodPara">
                                            <span className="title">材质：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.material}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.effect && (<div className="prodPara">
                                            <span className="title">功效：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.effect}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.approvalNo && (<div className="prodPara">
                                            <span className="title">批准文号：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.approvalNo}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.forSkin && (<div className="prodPara">
                                            <span className="title">适合肤质：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.forSkin}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.foodAdditives && (<div className="prodPara">
                                            <span className="title">食品添加剂：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.foodAdditives}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.forAge && (<div className="prodPara">
                                            <span className="title">适用年龄：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.forAge}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.forPhase && (<div className="prodPara">
                                            <span className="title">适用阶段：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.forPhase}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.storageMethod && (<div className="prodPara">
                                            <span className="title">储藏方法：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.storageMethod}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.taste && (<div className="prodPara">
                                            <span className="title">口味：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.taste}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.cycle && (<div className="prodPara">
                                            <span className="title">周期：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.cycle}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.no && (<div className="prodPara">
                                            <span className="title">货号：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.no}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.useMode && (<div className="prodPara">
                                            <span className="title">使用方式：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.useMode}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.features && (<div className="prodPara">
                                            <span className="title">特性：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.features}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.forPeople && (<div className="prodPara">
                                            <span className="title">适用人群：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.forPeople}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.powerSupply && (<div className="prodPara">
                                            <span className="title">供电方式：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.powerSupply}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.shoeSize && (<div className="prodPara">
                                            <span className="title">鞋码：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.shoeSize}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.upperHeight && (<div className="prodPara">
                                            <span className="title">鞋帮高度：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.upperHeight}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.thickness && (<div className="prodPara">
                                            <span className="title">厚薄：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.thickness}</span>
                                        </div>)}
                                        {previewProductItemDetail.detail.length && (<div className="prodPara">
                                            <span className="title">长度：</span>
                                            <span className="prodEx">{previewProductItemDetail.detail.length}</span>
                                        </div>)}
                                    </div>
                                </div>
                                <div className="manipulate">
                                    <div className="share"><i></i>分享</div>
                                    <div className="addTo">立即购买</div>
                                </div>
                            </article>
                        </article>
                    </article>
                    <article className="screenRight">
                        <article className="previewRight">
                            <article className="friendCir">
                                <div className="publisher">
                                    <img className="portrait" src={userInfo.services.wechat.headimgurl} />
                                    <div className="caption">
                                        <div className="name">{userInfo.nickname}</div>
                                        <div className="illustrate">{description}</div>
                                    </div>
                                </div>
                                <div className="release">
                                    <div className="freight">
                                    { products ? products.map((product,index) => (
                                        <div className="goods" key={index}><img src= {product.momentsImage + Configuration.OSS_IMG_100W_100H} /></div>
                                    )) : ''}
                                        <div className="goods" ><img src= '/previewlssue/buyerQrCode.png' /></div>
                                    </div>
                                    <div className="foretime">
                                        <span className="past">8小时前</span>
                                        <img className="more" src="/previewlssue/more.png" />
                                    </div>
                                </div>
                            </article>
                        </article>
                    </article>
                    <div className="btn-container">
                        <Button className="return" type="primary" size="large" onClick={self.props.closePreview}>返回</Button>
                        <Button className="publish" type="primary" size="large" loading={this.props.publishLoading} onClick={self.props._publishJournal}>发布</Button>
                    </div>
                </article>
            </div>
        );
    }
    _previewProduct(productItem) {
        const self = this;
        self.setState({
            previewProductItemDetail: productItem,
        });
        $('#previewIssue .beforehand .screenLeft .previewLeft .productData').show();
        $('#previewIssue .beforehand .screenLeft .previewLeft .productInfo').hide();
    }
    _backNewPreview() {
        $('#previewIssue .beforehand .screenLeft .previewLeft .productData').hide();
        $('#previewIssue .beforehand .screenLeft .previewLeft .productInfo').show();
    }
}
