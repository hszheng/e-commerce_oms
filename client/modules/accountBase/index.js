import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Link } from 'react-router';
// import { Cascader } from 'antd';
import { Modal } from 'antd';
import { InfoForm } from './InfoForm';
class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
    }    
    componentWillMount() {
        // 加载component时执行
    }
    componentDidMount() {
        // 组件加载完成时执行
    }
    componentDidUpdate() {
        // 完成组件更新
        const self = this;
        const { verifyInfo } = self.props;
        const router = self.context.router;
        if (verifyInfo && verifyInfo.step === 4) {
            router.push('/onlineProduct');
        }

    }
    render() {
        const self = this;
        const { Configuration, ProvinceInfo, Utility} = self.props.context();
        const router = self.context.router;
        const { verifyInfo } = self.props;
        const isAgent = localStorage.getItem('loginType') === '1';
        const addressArr = [];
        // console.log(verifyInfo);
        // if (isAgent) {
            return (
                <div id="accountBase">
                    <div className="loading" style={{ display: 'none' }}>
                        <img src="/loading.gif" className="loadingImg importLoading"></img>
                    </div>            
                    <InfoForm
                        router ={router}
                        isAgent = {isAgent}
                        verifyInfo = {verifyInfo}
                        Configuration = {Configuration} 
                        ProvinceInfo = {ProvinceInfo}
                        Utility = {Utility}
                        router = {router}
                    />
                </div>
            )
        // }
        // return (
        //     <div id="accountBase">
        //         <div className="loading" style={{ display: 'none' }}>
        //             <img src="/loading.gif" className="loadingImg importLoading"></img>
        //         </div>
        //         <div className="progress">
        //             <img src="/progress1.png" />
        //         </div>
        //         <h1 className="titleText">账户基础信息</h1>
        //         <div className="basicInfo">
        //             <div className="name basic-item">
        //                 <label className="nameLabel">*姓：</label>
        //                 <input type="text" ref="firstName" className="firstName" />
        //                 <label className="nameLabel">*名：</label>
        //                 <input type="text" ref="lastName" className="secondName" />
        //             </div>
        //             <div className="basic-item">
        //                 <label>所在地：</label>
        //                 <input type="text" ref="country" defaultValue="USA" />
        //                 <select className="selectCard" ref="state">
        //                     {Configuration.STATES.map((state, index) => (
        //                         <option key={index}>{state.name}</option>
        //                     ))}
        //                 </select>
        //                 <input type="text" placeholder="所在城市" className="city" ref="city"/>
        //             </div>
        //             <div className="basic-item">
        //                 <label>*详细地址：</label>
        //                 <input type="text" ref="address1" className="firstAddress" placeholder="地址第一行" />
        //                 <br/>
        //                 <input type="text" ref="address2" className="secondAddress" placeholder="地址第二行" />
        //             </div>
        //             <div className="basic-item">
        //                 <label>*邮政编码：</label>
        //                 <input type="text" ref="zipCode" />
        //             </div>
        //         </div>
        //         <h1 className="titleText verifyTitle">海外身份认证资料</h1>
        //         <div className="verifyInfo">
        //             <div className="verifyIdentify">
        //                 <label>*个人近照：</label>
        //                 <div className="imgContainer">
        //                     <img src="/addimg.png" ref="photo"/>
        //                     <div className="upLoading" style={{ display: 'none' }}>
        //                         <img src="/loading.gif"></img>
        //                     </div>
        //                     <input type="file" className="identifyImg" onChange={self._uploadImage.bind(self)} />
        //                 </div>
        //             </div>
        //             <div className="overseaIdentify">
        //                 <label>*海外身份证明：</label>
        //                 <select className="selectCard" ref="IDType">
        //                     <option checked="checked">请选择证件类型</option>
        //                     <option>所在国驾照</option>
        //                     <option>护照签证页</option>
        //                     <option>绿卡/护照</option>
        //                 </select>
        //                 <span>*图片需要包含个人身份信息（有效期三个月以上）</span>
        //             </div>
        //             <div className="verifyIdentify">
        //                 <label>*正面：</label>
        //                 <div className="imgContainer">
        //                     <img src="/addimg.png" ref="IDFront" />
        //                     <div className="upLoading" style={{ display: 'none' }}>
        //                         <img src="/loading.gif"></img>
        //                     </div>
        //                     <input type="file" className="front" onChange={self._uploadImage.bind(self)} />
        //                 </div>
        //             </div>
        //             <div className="verifyIdentify">
        //                 <label>*反面：</label>
        //                 <div className="imgContainer">
        //                     <img src="/addimg.png" ref="IDBack"/>
        //                     <div className="upLoading" style={{ display: 'none' }}>
        //                         <img src="/loading.gif"></img>
        //                     </div>
        //                     <input type="file" className="back" onChange={self._uploadImage.bind(self)} />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="overseaLived">
        //             <label>海外居住证明：</label>
        //             <select className="selectCard" ref="proofOfResidenceType">
        //                 <option checked="checked">请选择证件类型</option>
        //                 <option>水电煤账单</option>
        //                 <option>房屋租约</option>
        //                 <option>银行对账单</option>
        //             </select>
        //             <span>*图片需包含居住地信息（近三个月内）</span>
        //             <div className="imgContainer">
        //                 <img src="/addimg.png" ref="proofOfResidence" />
        //                 <div className="upLoading" style={{ display: 'none' }}>
        //                     <img src="/loading.gif"></img>
        //                 </div>
        //                 <input type="file" className="identifyImg" onChange={self._uploadImage.bind(self)}/>
        //             </div>
        //         </div>
        //         <div className="tip">注意事项：以上文件格式支持jpg/png;单个文件大小不能超过2M</div>
        //         <div className="admit">
        //             <input type="checkbox" id="adminProtocol"/>
        //             <label for="adminProtocol">我已阅读并同意<a href="http://www.taoerwan.com/protocol" target="_blank">《淘二万个人买手协议》</a></label>                    
        //         </div>
        //         <div className="submit">
        //             <button type="button" onClick={self._submitIdentify.bind(self)} className="submitIndentity">提交认证</button>
        //         </div>
        //     </div>
        // );
    }
// 提交认证
    // _submitIdentify() {
    //     const self = this;
    //     const router = self.context.router;
    //     const userId = Meteor.userId();
    //     const firstName = self.refs.firstName.value;
    //     const lastName = self.refs.lastName.value;
    //     const country = self.refs.country.value;
    //     const state = self.refs.state.value;
    //     const city = self.refs.city.value;
    //     const address1 = self.refs.address1.value;
    //     const address2 = self.refs.address2.value;
    //     const zipCode = self.refs.zipCode.value;
    //     const photo = self.refs.photo.src.split('@!100w')[0];
    //     const IDType = self.refs.IDType.value;
    //     const IDFront = self.refs.IDFront.src.split('@!100w')[0];
    //     const IDBack = self.refs.IDBack.src.split('@!100w')[0];
    //     const proofOfResidenceType = self.refs.proofOfResidenceType.value;
    //     const proofOfResidence = self.refs.proofOfResidence.src.split('@!100w')[0];
    //     const checked = $('.admit input')[0].checked;
    //     let data = {};

    //     if (!checked) {
    //         alert('请先同意买手协议');
    //         return;
    //     }
    //     if (IDType === '请选择证件类型' || proofOfResidenceType === '请选择证件类型') {
    //         alert('请选择证件类型！');
    //         return;
    //     }
    //     if (state === '所在州') {
    //         alert('请选择所在州！');
    //         return;
    //     }
    //     if (firstName && lastName && country && state && city && address1 && zipCode && photo && IDType && IDFront && IDBack && lastName && lastName) {
    //         data = { userId, modifier: { firstName, lastName, country, state, city, address1, address2, zipCode, photo, IDType, IDFront, IDBack, proofOfResidenceType, proofOfResidence, step: 1 } };
    //     } else {
    //         alert('请将信息填写完整！');
    //         return;
    //     }

    //     if (self._disableSubmit) {
    //         return;
    //     }
    //     self._disableSubmit = true;
    //     $('#accountBase .loading').show();
    //     Meteor.call('VerifyInfo.methods.step2', data, (err) => {
    //         self._disableSubmit = false;
    //         $('#accountBase .loading').hide();
    //         if (err) {
    //             alert(err);
    //             return;
    //         }
    //         router.push('/mobileVerify');
    //     });
    // }
// 上传图片事件
    // _uploadImage(e) {
    //     const self = this;
    //     const { context } = self.props;
    //     const { Utility, Configuration } = context();
    //     const el = $(e.currentTarget);
    //     Utility.resizeImageAndUploadToOSS(e.currentTarget.files[0], {
    //         progress(e) {
    //             // console.log('progress', e);
    //             if (e.loaded / e.total !== 1) {
    //                 el.siblings('.upLoading').show();
    //             } else {
    //                 el.siblings('.upLoading').hide();
    //             }
    //         },
    //         uploaded(e, url) {
    //             el.parent()
    //                 .find('img')
    //                 .attr('src', url + Configuration.OSS_IMG_100W_100H);
    //         },
    //         failed(e) {
    //             alert('上传失败');
    //         },
    //         canceled(e) {
    //             // console.log('canceled', e);
    //         },
    //     });
    // }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState } = context();
    const hasUser = Meteor.userId();
    const error = LocalState.get('DEMO_ERROR');

    onData(null, { hasUser, verifyInfo: Meteor.user(), error });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
