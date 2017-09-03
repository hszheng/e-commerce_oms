import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { Cascader } from 'antd';
import { message, Menu, Dropdown, Button, Form, Input, Select, Col, Checkbox, Modal } from 'antd';
import Loading from '../core/Loading';
class InfoForm extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.state = {
            selectState: '',
            IDType: '',
            proofOfResidenceType: '',
        }
        self.sendSMSCaptcha = self.sendSMSCaptcha.bind(self);
        self._uploadImage = self._uploadImage.bind(self);
        self.submitVerify = self.submitVerify.bind(self);
        self._onCancel = self._onCancel.bind(self);
        self._editAccount = self._editAccount.bind(self);
    }
    componentDidMount() {
        // 组件加载完成时执行
    }    
    componentDidUpdate() {
        // 完成组件更新
    }
    componentWillReceiveProps(nextProps) {}
    // 上传图片事件
    _uploadImage(e) {
        const self = this;
        const { Utility, Configuration, verifyInfo } = self.props;
        const el = $(e.currentTarget);
        Utility.resizeImageAndUploadToOSS(e.currentTarget.files[0], {
            progress(e) {
                if (e.loaded / e.total !== 1) {
                    el.siblings('.upLoading').show();
                } else {
                    el.siblings('.upLoading').hide();
                }
            },
            uploaded(e, url) {
                el.parent()
                    .find('img')
                    .attr('src', url + Configuration.OSS_IMG_100W_100H);
            },
            failed(e) {
                alert('上传失败');
            },
            canceled(e) {
                // console.log('canceled', e);
            },
        });
    }      
    /**
     * 倒计时函数
     * @param  {DOM} btn  点击发送验证码的button
     * @param  {Number} wait 倒计时时间
     * @return {Void}    无
     */
    time(btn, wait) {
        const self = this;
        if (wait === 0) {
            btn.removeAttribute('disabled');
            btn.style.backgroundColor = '#56be10';
            btn.innerHTML = '发送验证码';
            wait = 90;
        } else {
            btn.setAttribute('disabled', true);
            btn.style.backgroundColor = 'grey';
            btn.innerHTML = `重新发送(${wait})`;
            wait--;
            setTimeout(() => {
                self.time(btn, wait);
            },
            1000);
        }
    }
    /**
     * 发送验证码函数
     * @param  {DOM} o 点击发送验证码的button
     * @return {Void}  无
     */
    sendSMSCaptcha(e) {
        e.preventDefault();
        const self = this;
        const valueObj = self.props.form.getFieldsValue();
        const phone = valueObj.phone;
        const photo = self.refs.photo.src.split('@!100w')[0];   
        const areaCode = `${parseInt(valueObj.areaCode, 10)}`;
        const wait = 90;
        const btn = e.currentTarget;
        if (!phone) {
            message.warning('请输入手机号码');
            return;
        }
        self.time(btn, wait);
        const code = _.random(1000, 9999);
        $('#phoneCaptcha').data('code', `${code}`);
        // console.log(code);
        Meteor.call('sendSMS', { areaCode, mobile: phone, msg: `您好，您的验证码是${code}，感谢您对淘二万的信任。` },() =>{});
    }

    // 提交认证
    submitVerify(e) {
        e.preventDefault();
        const self = this;
        const { isAgent, verifyInfo } = self.props;
        const valueArr = self.props.form.getFieldsValue();
        const qq = self.refs.qq.refs.input.value;
        const email = self.refs.email.refs.input.value;
        const address2 = self.refs.address2.refs.input.value;
        const zipCode = self.refs.zipCode.refs.input.value;
        const phone = valueArr.areaCode + valueArr.phone;
        const phoneCaptcha = valueArr.phoneCaptcha;
        const photo = self.refs.photo.src.split('@!100w')[0];
        const checked = valueArr.checked;
        let data = {};
        let district = [], province = '', city = '', qzone = '', name = '', IDCard = '', id = 0;
        let firstName = '', lastName = '', country = '', state = '', address1 = '', IDType = '', IDFront = '', IDBack = '', proofOfResidenceType = '', proofOfResidence = '';
        if(isAgent) {
            district = valueArr.district;
            province = district[0];
            city = district[1];
            qzone = district[2];
            name = valueArr.name;
            IDCard = valueArr.IDCard;
            id = parseFloat(valueArr.id);
        } else {
            firstName = self.refs.firstName.refs.input.value;
            lastName = self.refs.lastName.refs.input.value;
            country = 'USA';
            state = self.state.selectState || verifyInfo.state;
            city = self.refs.city.refs.input.value;
            address1 = self.refs.address1.refs.input.value;
            IDType = self.state.IDType || verifyInfo.IDType;
            IDFront = self.refs.IDFront.src.split('@!100w')[0];
            IDBack = self.refs.IDBack.src.split('@!100w')[0];
            proofOfResidenceType = self.state.proofOfResidenceType || verifyInfo.proofOfResidenceType;
            proofOfResidence = self.refs.proofOfResidence.src.split('@!100w')[0];
            switch(IDType) {
                case '所在国驾照': IDType = 0; break;
                case '护照签证页': IDType = 1; break;
                case '绿卡/护照': IDType = 2; break;
                default: break;
            }
            switch(proofOfResidenceType) {
                case '水电煤账单': proofOfResidenceType = 0; break;
                case '房屋租约': proofOfResidenceType = 1; break;
                case '银行对账单': proofOfResidenceType = 2; break;
                default: break;
            }
        }
        // if (phoneCaptcha !== $('#phoneCaptcha').data('code')) {
        //     message.warning('手机验证码错误');
        //     return;
        // }
        if (isAgent && name && IDCard && district && qq && email && address2 && zipCode && valueArr.areaCode && phone && valueArr.phone && phoneCaptcha && photo && id) {
            data = { id, isAgent, obj: { name, IDCard, qq, email, province, city, qzone, address2, zipCode, phone, photo, step: 4 } };
            console.log(data);
        } else if(!isAgent && firstName && lastName && country && state && city && address1 && zipCode && valueArr.areaCode && phone && valueArr.phone && phoneCaptcha && photo && IDFront && IDBack && proofOfResidence) {
            data = { isAgent, obj: { firstName, lastName, qq, email, country, state, city, address1, address2, zipCode, phone, photo, IDType, IDFront, IDBack, proofOfResidenceType, proofOfResidence, step: 2 }};
            console.log(data);
        } else {
                message.warning('信息不完整');
            return;
        }
        $('#mobileVerifyPage .loading').show();
        Meteor.call('User.methods.updateNewUserInfo', data, (err, result) => {
            if (err) {
                console.log(err);
                message.warning('找不到该用户');
                return;
            }
            $('#mobileVerifyPage .loading').hide();
            self.setState({ visible: false });
        });
    } 
    // 关掉弹窗
    _onCancel() {
        const self = this;
        const { router, verifyInfo } = self.props;
        if(verifyInfo.step === 3) {
            self.setState({visible: false });
        } else {
            localStorage.removeItem('loginType');
            Accounts.logout()
        }
    }
    // 关掉弹窗编辑
    _editAccount() {
        const self = this;
        $('#mobileVerifyPage .loading').show();
        Meteor.call('User.methods.updateUserInfo',{ step: 0 }, (err, result) => {
            if (err) {
                console.log(err);
                message.warning('找不到该用户');
                return;
            }
            $('#mobileVerifyPage .loading').hide();
            // self.setState({visible: false });
        });
    }
    render() {
        const self = this;
        const { Configuration, ProvinceInfo, isAgent, verifyInfo } = self.props;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const InputGroup = Input.Group;
        const formItemLayout = {
          labelCol: { span: 2 },
          wrapperCol: { span: 6 },
        }; 
        const _formItemLayout = {
          labelCol: { span: 2 },
          wrapperCol: { span: 18 },
        };
        const { getFieldProps } = self.props.form;
        const addressArr = [];
        ProvinceInfo.provinceInfo.forEach((province) => {
            const provinceChild = [];
            province.child.forEach((city) => {
                const cityChild = [];
                if (!city.child) {
                    city.child = [];
                }
                city.child.forEach((qzone) => {
                    cityChild.push({
                        value: qzone.name,
                        label: qzone.name,
                    });
                });
                provinceChild.push({
                    value: city.name,
                    label: city.name,
                    children: cityChild,
                });
            });
            addressArr.push({
                value: province.name,
                label: province.name,
                children: provinceChild,
            });
        });        
        const selectBefore = (
            <Select defaultValue="+86" ref="areaCode"  placeholder="请选择国际区号" style={{ width: '120px' }} {...getFieldProps('areaCode')}>
              <Option value="001" >+1</Option>
              <Option value="086">+86</Option>
            </Select>
        );
        const selectStateBefore = (
            <Select ref="state" placeholder="请选择所在州" defaultValue={verifyInfo && verifyInfo.state ? verifyInfo.state: '亚拉巴马州'} className="selectState" onSelect= {(value, option)=> {self.setState({selectState: option.props.children})}}>
                {Configuration.STATES.map((state, index) => (
                    <Option key={index}>{state.name}</Option>
                ))}
            </Select>
            )
        const buttonAfter = (
            <button onClick={self.sendSMSCaptcha} className="sendCode sent" style={{ cursor: 'pointer' }}>发送验证码</button>
        );
        const label = (
                <label for="adminProtocol">我已阅读并同意<a href="http://www.taoerwan.com/protocol" target="_blank">《淘二万个人买手协议》</a></label>
            )
        const agentForm = (
                <Form horizontal onSubmit={self.submitVerify} className="submitForm">
                    <h1 className="titleText">个人基础信息</h1>
                    <FormItem label="*真实姓名：" {...formItemLayout} >
                      <Input type="text" placeholder="请输入真实姓名" defaultValue={verifyInfo && verifyInfo.name} ref="name" {...getFieldProps('name')}/>
                    </FormItem>
                    <FormItem label="*身份证号：" {...formItemLayout} >
                      <Input type="text" placeholder="请输入身份证号" defaultValue={verifyInfo && verifyInfo.IDCard} ref="IDCard" {...getFieldProps('IDCard')}/>
                    </FormItem>
                    <FormItem label="*详细地址：" {...formItemLayout}>
                        <Cascader options={addressArr} onChange={(value) => { console.log(value) }} placeholder="请选择地区" ref="district" {...getFieldProps('district')}/>
                        <Input type="text" className="secondAddress" placeholder="详细地址" defaultValue={verifyInfo && verifyInfo.address2} ref="address2" style={{ marginTop: '10px' }}/>
                    </FormItem>
                    <FormItem label="*联系QQ：" {...formItemLayout} >
                      <Input type="number" placeholder="请输入qq" defaultValue={verifyInfo && verifyInfo.qq} ref="qq"/>
                    </FormItem>
                    <FormItem label="*联系邮箱：" {...formItemLayout} >
                      <Input type="email" placeholder="请输入邮箱" defaultValue={verifyInfo && verifyInfo.email} ref="email"/>
                    </FormItem>                
                    <FormItem label="*当地邮编：" {...formItemLayout} >
                        <Input type="number" placeholder="请输入邮编" defaultValue={verifyInfo && verifyInfo.zipCode} ref="zipCode"/>
                    </FormItem>
                    <FormItem inline label="*联系手机：" className="phoneDetail"{..._formItemLayout}>
                        <InputGroup>
                          <Col span="11">
                            <Input type="phone" addonBefore={selectBefore} addonAfter={buttonAfter} placeholder="请输入手机号码" defaultValue={verifyInfo && verifyInfo.phone} ref="phone" {...getFieldProps('phone')}/>  
                          </Col>
                          <Col span="4">
                            <Input type="number" id="phoneCaptcha" placeholder="请输入验证码" ref="phoneCaptcha" {...getFieldProps('phoneCaptcha')}/>
                          </Col>
                        </InputGroup>                
                    </FormItem>
                    <h1 className="titleText verifyTitle">账户基本信息</h1>
                    <FormItem label="*个人近照：" className="uploadImg" {...formItemLayout}>
                        <div className="imgContainer other">
                            <img src={verifyInfo && verifyInfo.photo ? verifyInfo.photo + Configuration.OSS_IMG_100W_100H : "/addimg.png"} ref="photo"/>
                            <div className="upLoading" style={{ display: 'none' }}>
                                <img src="/loading.gif"></img>
                            </div>
                            <input type="file" className="identifyImg" onChange={self._uploadImage} />
                        </div>
                        {
                            // <span style={{ float: 'right' }}>提示：个人近照用于显示在商城首页</span>
                        }
                    </FormItem>
                    <FormItem label="*ID识别码：" {...formItemLayout} >
                      <Input type="number" placeholder="请输入ID识别码" defaultValue={verifyInfo && verifyInfo.id} ref="id" {...getFieldProps('id')}/>
                    </FormItem>
                    <FormItem className="checkbox" {...formItemLayout} >
                        <Checkbox id="adminProtocol" ref="checked" {...getFieldProps('checked')}>{label}</Checkbox>
                    </FormItem>                    
                    <FormItem wrapperCol={{ span: 3, offset: 9 }} style={{ padding: 24, textAlign: 'center'}} className="submitContainer other">
                        <Button type="submit" htmlType="submit" className="submitVerify" >提交认证</Button> 
                    </FormItem>
                </Form>
            );
        const buyerForm = (
                <div>
                    <Form horizontal onSubmit={self.submitVerify} className="submitForm">
                        <h1 className="titleText">个人基础信息</h1>
                        <FormItem inline label="*真实姓名：" {..._formItemLayout}>
                            <InputGroup>
                              <Col span="3">
                                <Input type="text" placeholder="姓" defaultValue={verifyInfo && verifyInfo.firstName} ref="firstName"/>  
                              </Col>
                              <Col span="5">
                                <Input type="text" placeholder="名" defaultValue={verifyInfo && verifyInfo.lastName} ref="lastName"/>
                              </Col>
                            </InputGroup>                
                        </FormItem>
                        <FormItem label="*地址：" {...formItemLayout}>
                            <InputGroup>
                              <Col span="10">
                                <Input type="text" addonBefore="" defaultValue='USA' disabled="true" style={{ width: '100px' }} />
                              </Col>
                              <Col span="6">
                                <Input type="text" addonBefore={selectStateBefore} placeholder="填写所在城市" defaultValue={verifyInfo && verifyInfo.city} ref="city" style={{ width: '120px' }}/>
                              </Col>
                            </InputGroup>
                            <Input type="text" className="secondAddress" placeholder="详细地址1" defaultValue={verifyInfo && verifyInfo.address1} ref="address1" style={{ marginTop: '10px' }}/>
                            <Input type="text" className="secondAddress" placeholder="详细地址2" defaultValue={verifyInfo && verifyInfo.address2} ref="address2" style={{ marginTop: '10px' }}/>
                        </FormItem>
                        <FormItem label="*联系QQ：" {...formItemLayout} >
                          <Input type="number" placeholder="请输入qq" defaultValue={verifyInfo && verifyInfo.qq} ref="qq"/>
                        </FormItem>
                        <FormItem label="*联系邮箱：" {...formItemLayout} >
                          <Input type="email" placeholder="请输入邮箱" defaultValue={verifyInfo && verifyInfo.email} ref="email"/>
                        </FormItem>                
                        <FormItem label="*当地邮编：" {...formItemLayout} >
                            <Input type="number" placeholder="请输入邮编" defaultValue={verifyInfo && verifyInfo.zipCode} ref="zipCode"/>
                        </FormItem>
                        <FormItem inline label="*联系手机：" className="phoneDetail"{..._formItemLayout}>
                            <InputGroup>
                              <Col span="11">
                                <Input type="phone" addonBefore={selectBefore} addonAfter={buttonAfter} placeholder="请输入手机号码" defaultValue={verifyInfo && verifyInfo.phone} ref="phone"  {...getFieldProps('phone')}/>  
                              </Col>
                              <Col span="4">
                                <Input type="number" id="phoneCaptcha" placeholder="请输入验证码" ref="phoneCaptcha" {...getFieldProps('phoneCaptcha')}/>
                              </Col>
                            </InputGroup>                
                        </FormItem>                
                        <h1 className="titleText verifyTitle">海外身份认证资料：</h1>
                        <FormItem label="*个人近照：" className="uploadImg" {...formItemLayout}>
                            <div className="imgContainer other">
                                <img src={verifyInfo && verifyInfo.photo ? verifyInfo.photo + Configuration.OSS_IMG_100W_100H : "/addimg.png"} ref="photo"/>
                                <div className="upLoading" style={{ display: 'none' }}>
                                    <img src="/loading.gif"></img>
                                </div>
                                <input type="file" className="identifyImg" onChange={self._uploadImage} />
                            </div>
                        </FormItem>                
                        <FormItem label="*身份证明：" className="uploadImg" {...formItemLayout}>
                            <Select 
                                defaultValue={(()=>{
                                    const type = verifyInfo && verifyInfo.IDType;
                                    switch(type) {
                                        case 0: return '所在国驾照';
                                        case 1: return '护照签证页';
                                        case 2: return '绿卡/护照';
                                        default: return '';
                                    }                                    
                                })()} 
                                ref="IDType"
                                placeholder="请选择证件类型"
                                style={{ width: '120px' }}
                                onSelect= {(value, option)=> {self.setState({IDType: option.props.children})}}>
                                <Option value="所在国驾照">所在国驾照</Option>
                                <Option value="护照签证页">护照签证页</Option>
                                <Option value="绿卡/护照">绿卡/护照</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="*正面截图：" className="uploadImg" {...formItemLayout}>
                            <div className="imgContainer other">
                                <img src={verifyInfo && verifyInfo.IDFront ? verifyInfo.IDFront + Configuration.OSS_IMG_100W_100H: "/addimg.png"} ref="IDFront"/>
                                <div className="upLoading" style={{ display: 'none' }}>
                                    <img src="/loading.gif"></img>
                                </div>
                                <input type="file" className="identifyImg" onChange={self._uploadImage} />
                            </div>
                        </FormItem>
                        <FormItem label="*反面截图：" className="uploadImg" {...formItemLayout}>
                            <div className="imgContainer other">
                                <img src={verifyInfo && verifyInfo.IDBack ? verifyInfo.IDBack + Configuration.OSS_IMG_100W_100H : "/addimg.png"} ref="IDBack"/>
                                <div className="upLoading" style={{ display: 'none' }}>
                                    <img src="/loading.gif"></img>
                                </div>
                                <input type="file" className="identifyImg" onChange={self._uploadImage} />
                            </div>
                        </FormItem>
                        <FormItem label="*居住证明：" className="uploadImg" {...formItemLayout}>
                            <Select defaultValue={(()=>{
                                    const type = verifyInfo && verifyInfo.proofOfResidenceType;
                                    switch(type) {
                                        case 0: return '水电煤账单';
                                        case 1: return '房屋租约';
                                        case 2: return '银行对账单';
                                        default: return '';
                                    }
                                })()} 
                                ref="proofOfResidenceType"
                                placeholder="请选择证件类型"
                                style={{ width: '120px' }}
                                onSelect= {(value, option)=> {self.setState({proofOfResidenceType: option.props.children})}}
                            >
                                <Option value="水电煤账单">水电煤账单</Option>
                                <Option value="房屋租约">房屋租约</Option>
                                <Option value="银行对账单">银行对账单</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="*证件截图" className="uploadImg" {...formItemLayout}>
                            <div className="imgContainer other">
                                <img src={verifyInfo && verifyInfo.proofOfResidence ? verifyInfo.proofOfResidence + Configuration.OSS_IMG_100W_100H : "/addimg.png"}  ref="proofOfResidence"/>
                                <div className="upLoading" style={{ display: 'none' }}>
                                    <img src="/loading.gif"></img>
                                </div>
                                <input type="file" className="identifyImg" onChange={self._uploadImage} />
                            </div>
                        </FormItem>                
                        <FormItem className="checkbox" {...formItemLayout} >
                            <Checkbox id="adminProtocol" ref="checked" {...getFieldProps('checked')}>{label}</Checkbox>
                        </FormItem>
                        <FormItem wrapperCol={{ span: 3, offset: 9 }} style={{ padding: 24, textAlign: 'center'}} className="submitContainer other">
                            <Button type="submit" htmlType="submit" className="submitVerify" >提交认证</Button> 
                        </FormItem>
                    </Form>
                </div>
            );
        const step = verifyInfo && verifyInfo.step;
        switch(step) {
        case 0:
            return (isAgent ? agentForm : buyerForm);
            break;
        case 2:
            return (
                        <div className="verifying">
                            <p>您的资料已提交审核，请耐心等待。</p><p>如有任何疑问，请联系平台客服</p><p>联系邮箱：taoerwan@xuuue.cn</p>
                        </div>                
                    )
            break;
        case 3:
            return (
                        <div className="verifying">
                            <p>你的资料审核未通过，有一些信息不正确。<a href="javascript:void(0);" onClick={self._editAccount}>返回修改</a></p><p>如有任何疑问，请联系平台客服</p><p>联系邮箱：taoerwan@xuuue.cn</p>
                        </div>
                    )
            break;
        default:
            return (<Loading/>);
            break;

        }
    }

}
InfoForm = Form.create()(InfoForm);

export {
    InfoForm
}
