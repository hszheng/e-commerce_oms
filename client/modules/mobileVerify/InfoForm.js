import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import { message, Menu, Dropdown, Button, Form, Input, Select, Col } from 'antd';
import { Cascader } from 'antd';

class InfoForm extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;
        self.sendSMSCaptcha = self.sendSMSCaptcha.bind(self);
        self.submitVerify = self.submitVerify.bind(self);
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
        // // console.log(code);
        Meteor.call('sendSMS', { areaCode, mobile: phone, msg: `您好，您的验证码是${code}，感谢您对淘二万的信任。` },(err, result) =>{
            if(err){
                // // console.log(err);
            } else {
                // // console.log(result);
            }
        });
    }

    submitVerify(e) {
        e.preventDefault();
        const self = this;
        const router = self.context.router;
        const valueArr = self.props.form.getFieldsValue();
        const qq = valueArr.qq;
        const phone = valueArr.areaCode + valueArr.phone;
        // const phoneCaptcha = valueArr.phoneCaptcha;
        const email = valueArr.email;
        if (!qq || !valueArr.areaCode || !phone || !phoneCaptcha || !email) {
            message.warning('信息不完整');
            return;
        }

        // if (phoneCaptcha !== $('#phoneCaptcha').data('code')) {
        //     message.warning('手机验证码错误');
        //     return;
        // }
        $('#mobileVerifyPage .loading').show();
        Meteor.call('VerifyInfo.methods.update', { qq, phone, email, step: 2 }, (err, result) => {
            if (err) {
                message.warning('提交认证失败，错误代码：', err);
                return;
            }
            $('#mobileVerifyPage .loading').hide();
            location.assign('/verifyStatus')
        });
    }   
    render() {
        const self = this;
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
        return (
            <Form horizontal onSubmit={self.submitVerify}>              
                <FormItem label="联系QQ：" {...formItemLayout} >
                  <Input type="text" placeholder="请输入qq" ref="qq" {...getFieldProps('qq')}/>
                </FormItem>
                <FormItem label="联系邮箱：" {...formItemLayout} >
                  <Input type="email" placeholder="请输入邮箱" ref="email" {...getFieldProps('email')}/>
                </FormItem>
                <FormItem inline label="联系手机：" {..._formItemLayout}>
                    <InputGroup>
                        <Col span="5">
                            <Select defaultValue="+86" ref="areaCode"  placeholder="请选择国际区号" {...getFieldProps('areaCode')}>
                              <Option value="001" >+1</Option>
                              <Option value="086">+86</Option>
                            </Select>
                        </Col>
                        <Col span="8">
                          <Input type="phone" placeholder="请输入手机号码" ref="phone" {...getFieldProps('phone')}/>  
                        </Col>
                        <Col span="5">
                          <Button onClick={self.sendSMSCaptcha} htmlType="submit" className="sendCode sent">发送验证码</Button>
                        </Col>                                
                    </InputGroup>
                </FormItem>
                <FormItem label="手机验证码：" {...formItemLayout} >
                  <Input type="text" ref="phoneCaptcha" id="phoneCaptcha" placeholder="请输入手机验证码" {...getFieldProps('phoneCaptcha')}/>
                </FormItem>                        
                <FormItem wrapperCol={{ span: 3, offset: 9 }} style={{ marginTop: 24, textAlign: 'center'}} className="submitContainer">
                    <Button type="submit" htmlType="submit" className="submitVerify">提交认证</Button> 
                </FormItem>                        
            </Form>
        );
    }

}
InfoForm = Form.create()(InfoForm);

export {
    InfoForm
}
