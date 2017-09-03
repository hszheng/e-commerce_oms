import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Input, Select, Collapse, Button } from 'antd';

import Loading from '../core/Loading';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        // 加载component时执行
        if (!Meteor.userId()) {
            Meteor.loginWithWechat({ loginStyle: 'redirect' });
        }
    }

    render() {
        const self = this;
        const { hasUser, currentUser } = self.props;
        const { Configuration } = self.props.context();
        const Panel = Collapse.Panel;
        if (!currentUser) {
            return (<div></div>);
        }
        if (!hasUser) {
            return (<div></div>);
        }
        return (
            <div id="setting">
                <div className="store">
                    <div className="store-detail" style={{ marginBottom: '10px' }}>
                        <Input addonBefore="店铺名称：" defaultValue={currentUser.storeName ?  currentUser.storeName : `${currentUser.nickname}的代购小店`} ref="storeName" />
                        <Input addonBefore="店铺等级：" defaultValue={currentUser.storeLevel === 0 ? '一级钻石' : '无'} disabled="true"/>
                        <Input addonBefore="加入时间：" defaultValue={moment(currentUser.createdAt).format('YYYY年MM月DD日HH:mm')} disabled="true"/>
                        <Input addonBefore="ID识别码：" defaultValue={currentUser.id} disabled="true"/>
                        <Input addonBefore="店铺介绍：" type="textarea" rows={4} defaultValue={currentUser.storeDesc} placeholder="请输入300字以内相关介绍，该介绍将展示在每期的期刊中，让您的朋友更加信任您的代购" style={{ resize: 'none' }} ref='storeDesc'/>
                        <div className="frontCov">
                            <label className="flgShops">店铺封面：</label>
                            <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                                <img className="addimg" src={currentUser.storeBanner ? currentUser.storeBanner + Configuration.OSS_IMG_100W_100H : '/setting/addimg.png'} />
                                <input type="file" className="upload" ref='storeBanner' onChange={self._uploadPic.bind(self)}/>
                                <span className="prompt">建议上传640*400像素的图片，作为店铺封面</span>
                            </div>
                        </div>
                        {
                        <div className="frontCov">
                            <label className="flgShops">微信二维码：</label>
                            <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                                <img className="qrCodeImg" src={currentUser.qrCode ? currentUser.qrCode + Configuration.OSS_IMG_100W_100H : '/setting/addimg.png'} />
                                <input type="file" className="upload" ref='qrCode' onChange={self._uploadPic.bind(self)}/>
                                <span className="prompt">建议上传300*300像素的图片，作为在线客服</span>
                            </div>
                        </div> 
                        }
                        {
                            // <div className="storeName">店铺等级：<input type="text" ref='storeName' className="heading" defaultValue={currentUser.storeName}/></div>
                            // <div className="grade">店铺等级：<span className="degree">{currentUser.storeLevel === 0 ? '一级钻石' : '无'}</span></div>
                            // <div className="join">加入时间：<span className="time">{`${currentUser.createdAt.getFullYear()}-${currentUser.createdAt.getMonth() + 1}-${currentUser.createdAt.getDate()}`}</span></div>
                            // <div className="grade">ID识别码：<span className="degree">{currentUser.id}</span></div>
                            // <div className="introduction">
                            //     <span className="introduce">店铺介绍：</span>
                            //     <textarea ref='storeDesc' placeholder="请输入300字以内相关介绍，该介绍将展示在每期的期刊中，让您的朋友更加信任您的代购" defaultValue={currentUser.storeDesc}></textarea>
                            // </div>
                        }
                    </div>
                    <Collapse>
                        <Panel header="个人资料" key="1">
                            {
                                currentUser.status.indexOf(2) !== -1 ? (
                                <div className="store-detail" ref="contactContainer" style={{ marginLeft: '10px' }}>
                                    <Input addonBefore="真实姓名：" defaultValue={currentUser.name} disabled="true"/>
                                    <Input addonBefore="身份证号：" defaultValue={currentUser.IDCard} disabled="true"/>
                                    <Input addonBefore="详细地址：" defaultValue={`${currentUser.province}${currentUser.cuty}${currentUser.qzone}${currentUser.address2}`} disabled="true"/>
                                    <Input addonBefore="邮政编码：" defaultValue={currentUser.zipCode} disabled="true"/>
                                </div>) : (
                                <div className="store-detail" ref="contactContainer" style={{ marginLeft: '10px' }}>
                                    <Input addonBefore="姓名：" defaultValue={`${currentUser.firstName}${currentUser.lastName}`} disabled="true"/>
                                    <Input addonBefore="所在州：" defaultValue={`${currentUser.country}${currentUser.state}${currentUser.city}`} disabled="true"/>
                                    <Input addonBefore="详细地址：" defaultValue={`${currentUser.address1}/${currentUser.address2}`} disabled="true"/>
                                    <Input addonBefore="邮政编码：" defaultValue={currentUser.zipCode} disabled="true"/>
                                    <Input addonBefore="联系QQ：" defaultValue={currentUser.qq} disabled="true"/>
                                    <Input addonBefore="联系手机：" defaultValue={ currentUser.phone && `+${parseFloat(currentUser.phone.substr(0, 3))} ${currentUser.phone.substr(3)}`} disabled="true"/>
                                    <Input addonBefore="联系邮箱：" defaultValue={currentUser.email} disabled="true"/>
                                </div>)
                            }

                        </Panel>
                        <Panel header={currentUser.status.indexOf(2) !== -1 ? '账号基本信息' : '海外身份认证资料'} key="2">
                            {
                                currentUser.status.indexOf(2) !== -1 ? (
                                <div className="store-detail" style={{ marginLeft: '10px' }}>
                                    <Input addonBefore="联系QQ：" defaultValue={currentUser.qq} disabled="true"/>
                                    <Input addonBefore="联系手机：" defaultValue={ currentUser.phone && `+${parseFloat(currentUser.phone.substr(0, 3))} ${currentUser.phone.substr(3)}`} disabled="true"/>
                                    <Input addonBefore="联系邮箱：" defaultValue={currentUser.email} disabled="true"/>
                                    <div className="frontCov">
                                        <label className="overseeLabel">个人近照：</label>
                                        <div className="imgContainer">
                                            <img src={currentUser.photo ? currentUser.photo + Configuration.OSS_IMG_100W_100H : 'none'} ref="photo"/>
                                        </div>
                                    </div>
                                </div>) : (
                                <div className="store-detail" ref="overseaContainer" style={{ marginLeft: '10px' }}>
                                    <div className="frontCov">
                                        <label className="overseeLabel">个人近照：</label>
                                        <div className="imgContainer">
                                            <img src={currentUser.photo ? currentUser.photo + Configuration.OSS_IMG_100W_100H : 'none'} ref="photo"/>
                                        </div>
                                    </div>
                                    <div className="frontCov">
                                        <label>海外身份证明：</label>
                                        <span>{currentUser.IDType}</span>
                                    </div>
                                    <div className="frontCov">
                                        <label className="overseeLabel">正面：</label>
                                        <div className="imgContainer">
                                            <img src={currentUser.IDFront ? currentUser.IDFront + Configuration.OSS_IMG_100W_100H : 'none'} ref="IDFront" />
                                        </div>
                                    </div>
                                    <div className="frontCov">
                                        <label className="overseeLabel">反面：</label>
                                        <div className="imgContainer">
                                            <img src={currentUser.IDBack ? currentUser.IDBack + Configuration.OSS_IMG_100W_100H : 'none'} ref="IDBack"/>
                                        </div>
                                    </div>
                                    <div className="frontCov">
                                        <label className="overseeLabel" style={{ width: '150px' }}>海外居住证明：{currentUser.proofOfResidenceType}</label>
                                        <div className="imgContainer">
                                            <img src={currentUser.proofOfResidence ? currentUser.proofOfResidence + Configuration.OSS_IMG_100W_100H : 'none'} ref="proofOfResidence" />
                                        </div>
                                    </div>
                                </div>)
                            }

                        </Panel>
                    </Collapse> 
                {
                    // <div className="contactText">
                    //     <label>个人资料</label>
                    //     <div className="rightOperation" onClick={self._toggleContact.bind(self)}>
                    //         <span ref="contactOpenText">展开</span>
                    //         <div className="operation" ref="contactOpen">+</div>
                    //     </div>
                    // </div>
                    // <div className="contactContainer" ref="contactContainer">
                    //     <div className="contactWay">
                    //         <div className="basic-item">
                    //             <label>联系QQ：</label>
                    //             <span>{currentUser.qq}</span>
                    //         </div>
                    //         <div className="basic-item">
                    //             <label>联系手机：</label>
                    //             <span>{ currentUser.phone && `+${parseFloat(currentUser.phone.substr(0, 3))} ${currentUser.phone.substr(3)}`}</span>
                    //         </div>
                    //         <div className="basic-item">
                    //             <label>联系邮箱：</label>
                    //             <span>{currentUser.email}</span>
                    //         </div>
                    //     </div>
                    //     <div className="basicInfo">
                    //         <div className="basic-item">
                    //             <label>姓名：</label>
                    //             <span>{currentUser.firstName}{currentUser.lastName}</span>
                    //         </div>
                    //         <div className="basic-item">
                    //             <label>州：</label>
                    //             <span>{currentUser.country} {currentUser.state} {currentUser.city}</span>
                    //         </div>
                    //         <div className="basic-item">
                    //             <label>详细地址：</label>
                    //             <span>{currentUser.address1} {currentUser.address2}</span>
                    //         </div>
                    //         <div className="basic-item">
                    //             <label>邮政编码：</label>
                    //             <span>{currentUser.zipCode}</span>
                    //         </div>
                    //     </div>
                    // </div>
                    // <div className="overseaText">
                    //     <label>海外身份认证资料</label>
                    //     <div className="rightOperation" onClick={self._toggleOversea.bind(self)}>
                    //         <span ref="overseaOpenText">展开</span>
                    //         <div className="operation" ref="overseaOpen">+</div>
                    //     </div>
                    // </div>
                    // <div className="overseaContainer" ref="overseaContainer">
                    //     <div className="verifyInfo">
                    //         <div className="verifyIdentify">
                    //             <label>个人近照：</label>
                    //             <div className="imgContainer">
                    //                 <img src={currentUser.photo ? currentUser.photo + Configuration.OSS_IMG_100W_100H : 'none'} ref="photo"/>
                    //             </div>
                    //         </div>
                    //         <div className="overseaIdentify">
                    //             <label>海外身份证明：</label>
                    //             <span>{currentUser.IDType}</span>
                    //         </div>
                    //         <div className="verifyIdentify">
                    //             <label>正面：</label>
                    //             <div className="imgContainer">
                    //                 <img src={currentUser.IDFront ? currentUser.IDFront + Configuration.OSS_IMG_100W_100H : 'none'} ref="IDFront" />
                    //             </div>
                    //         </div>
                    //         <div className="verifyIdentify">
                    //             <label>反面：</label>
                    //             <div className="imgContainer">
                    //                 <img src={currentUser.IDBack ? currentUser.IDBack + Configuration.OSS_IMG_100W_100H : 'none'} ref="IDBack"/>
                    //             </div>
                    //         </div>
                    //     </div>
                    //     <div className="overseaLived">
                    //         <label>海外居住证明：</label>
                    //         <span>{currentUser.proofOfResidenceType}</span>
                    //         <div className="imgContainer">
                    //             <img src={currentUser.proofOfResidence ? currentUser.proofOfResidence + Configuration.OSS_IMG_100W_100H : 'none'} ref="proofOfResidence" />
                    //         </div>
                    //     </div>
                    // </div>
                }
                <div style={{ width: '300px', margin: '0 auto' }}>
                    <Button type="primary" className="save" onClick={self._saveMyData.bind(self)}>确定保存</Button>
                    <Button type="primary" className="cancel" onClick={self._cancelMyData.bind(self)}>取消</Button>
                </div>
                </div>
            </div>
        );
    }
    // 图片上传展示
    _uploadPic(e) {
        const self = this;
        const { context } = self.props;
        const { Utility, Configuration} = context();
        // const storeBanner = self.refs.storeBanner.files[0];
        const dom = e.currentTarget;
        Utility.resizeImageAndUploadToOSS(e.currentTarget.files[0], {
            progress(e) {
                // console.log('progress', e);
            },
            uploaded(e, url) {
                $(dom).siblings('img').attr('src', url + Configuration.OSS_IMG_100W_100H);
                self.refs.storeBanner.value = '';
            },
            failed(e) {
                alert('上传失败');
            },
            canceled(e) {
                // console.log('canceled', e);
            },
        });
    } 
    // 取消保存我的资料
    _cancelMyData(e) {
        e.preventDefault();
        const self = this;
        const router = self.context.router;
        router.push('/onlineProduct');
    }
    // 保存我的资料
    _saveMyData(e) {
        e.preventDefault();
        const self = this;
        const { currentUser } = self.props;
        const router = self.context.router;
        const storeName = self.refs.storeName.refs.input.value || `${currentUser.nickname}的代购小店`;
        const storeDesc = self.refs.storeDesc.refs.input.value || `您好，我是${currentUser.nickname}，欢迎来到我的小店`;
        const _id = Meteor.userId();
        const storeBanner = $('.addimg').attr('src') !== "/setting/addimg.png" && $('.addimg').attr('src').split('@!100w')[0];
        const qrCode = $('.qrCodeImg').attr('src') !== "/setting/addimg.png" && $('.qrCodeImg').attr('src').split('@!100w')[0];
        // return;
        const data = { storeName, storeDesc, storeBanner, qrCode};
        Meteor.call('User.methods.updateUserInfo', data, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            alert('修改成功');
            router.push('/onlineProduct');
        });
    }
    // 显示或隐藏个人的资料信息
    _toggleContact(e) {
        const self = this;
        if (self.refs.contactContainer.style.display !== 'block') {
            self.refs.contactContainer.style.display = 'block';
            self.refs.contactOpen.innerHTML = '-';
            self.refs.contactOpenText.innerHTML = '收起';
        }
        else {
            self.refs.contactContainer.style.display = 'none';
            self.refs.contactOpen.innerHTML = '+';
            self.refs.contactOpenText.innerHTML = '展开';
        }
    }
    // 显示或隐藏海外的信息
    _toggleOversea(e) {
        const self = this;
        if (self.refs.overseaContainer.style.display !== 'block') {
            self.refs.overseaContainer.style.display = 'block';
            self.refs.overseaOpen.innerHTML = '-';
            self.refs.overseaOpenText.innerHTML = '收起';
        }
        else {
            self.refs.overseaContainer.style.display = 'none';
            self.refs.overseaOpen.innerHTML = '+';
            self.refs.overseaOpenText.innerHTML = '展开';
        }
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState } = context();
    const hasUser = Meteor.userId();
    const error = LocalState.get('DEMO_ERROR');
    const currentUser = Meteor.user();
    if (!hasUser) {
        Meteor.loginWithWechat({ loginStyle: 'redirect' });
        return;
    }
    onData(null, { hasUser, currentUser, error });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
