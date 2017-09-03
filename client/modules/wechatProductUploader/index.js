import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Helmet from 'react-helmet';
class Page extends React.Component {
	constructor(props){
		super(props);
		const self = this;
		self.state = {
			option: 'null'
		}
	}
	
    componentWillMount() {
        // 加载component时执行
        // if (!Meteor.userId()) {
        //     Meteor.loginWithWechat({ loginStyle: 'redirect' });
        // }
    }
    componentDidMount() {
        // 组件加载完成时执行
        
    }
    componentDidUpdate() {
        // 完成组件更新
        
    }
    render() {
    	const self = this;
    	const { categorys } = self.props;
    	return (  		
    		<div id="uploader"> 		
		       <div className="weui_cell_bd weui_cell_primary uploadTitle">
		           <p>发布商品</p>
		           <hr/>
		       </div> 
		       <div className="weui_cell_bd weui_cell_primary" style={{padding: "0 1rem"}}>
		           <img src="/previewlssue/portrait.png" className="photo"></img>
		           <p className="storeTitle">熊焰密歇根小店</p>
		       </div> 		       
				<div className="weui_cells weui_cells_form" style={{marginTop:0}}>
				    <div className="weui_cell">
				        <div className="weui_cell_bd weui_cell_primary">
				            <div className="weui_uploader">
				                <div className="weui_uploader_hd weui_cell">
				                    <div className="weui_cell_bd weui_cell_primary">商品实图</div>
				                    {
				                    	// <div className="weui_cell_ft">0/8</div>
				                	}
				                </div>
				                <div className="weui_uploader_bd">
				                    <div className="weui_uploader_input_wrp">
				                        <input className="weui_uploader_input" type="file" accept="image/*" multiple="" />
				                    </div>
				                    <ul className="weui_uploader_files">
				                        <li className="weui_uploader_file">
				                            <div className="weui_uploader_status_content">
				                                <i className="weui_icon_warn"></i>
				                            </div>
				                        </li>
				                    </ul>				                    
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
				<div className="weui_cells weui_cells_form" style={{marginTop:0}}>
				    <div className="weui_cell">
				        <div className="weui_cell_bd weui_cell_primary">
				            <div className="weui_uploader">
				                <div className="weui_uploader_hd weui_cell">
				                    <div className="weui_cell_bd weui_cell_primary">商品UPC图</div>
				                    {
				                    	// <div className="weui_cell_ft">0/8</div>
				                	}
				                </div>
				                <div className="weui_uploader_bd">
				                    <div className="weui_uploader_input_wrp">
				                        <input className="weui_uploader_input" type="file" accept="image/*" multiple="" />
				                    </div>
				                    <ul className="weui_uploader_files">
				                        <li className="weui_uploader_file">
				                            <div className="weui_uploader_status_content">
				                                <i className="weui_icon_warn"></i>
				                            </div>
				                        </li>
				                    </ul>				                    
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
				<div className="weui_cells weui_cells_form" style={{marginTop:0}}>
				    <div className="weui_cell">
				        <div className="weui_cell_hd">
				            <div className="weui_cell_hd">商品名称</div>
				        </div>
				        <div className="weui_cell_bd weui_cell_primary">
				            <input className="weui_input" type="text" placeholder="最多可输入30个字"/>
				        </div>
				    </div>
				    <div className="weui_cell">
				        <div className="weui_cell_hd">
				            <div className="weui_cell_hd">商品品牌</div>
				        </div>
				        <div className="weui_cell_bd weui_cell_primary">
				            <input className="weui_input" type="text" placeholder="英文品牌名"/>
				        </div>
				    </div>
				    <div className="weui_cell">
				        <div className="weui_cell_hd">
				        	<div className="weui_cell_hd">报关中文名</div>
				        </div>
				        <div className="weui_cell_bd weui_cell_primary">
				            <input className="weui_input" type="text" placeholder="商品类别，如营养液"/>
				        </div>
				    </div>
				    <div className="weui_cell weui_cell_select weui_select_after">
				        <div className="weui_cell_hd">商品类目</div>
				        <div className="weui_cell_bd weui_cell_primary">
				        	<input className="weui_input" type="text" placeholder="类目" defaultValue={self.state.option} ref="subcataryValue" style={{position: 'absolute', height: '100%'}}/>
				            <select className="weui_select" onClick={self._category.bind(self)} name="select" defaultValue='dd'></select>
				        </div>				        		
				    </div>			    
				    <div className="weui_cell">
				        <div className="weui_cell_hd">
				        	<div className="weui_cell_hd">国外价格($)</div>
				        </div>
				        <div className="weui_cell_bd weui_cell_primary">
				            <input className="weui_input" type="number" placeholder="0.00美元"/>
				        </div>					    				        
				    </div>
				    <div className="weui_cell">
				        <div className="weui_cell_hd">
				        	<div className="weui_cell_hd">销售价格(￥)</div>
				        </div>
				        <div className="weui_cell_bd weui_cell_primary">
				            <input className="weui_input" type="number" placeholder="0.00元"/>
				        </div>					    				        
				    </div>				    			    
					<div className="weui_cells weui_cells_form" style={{marginTop:0}}>
					    <div className="weui_cell">
					        <div className="weui_cell_bd weui_cell_primary">
					            <textarea className="weui_textarea" placeholder="商品描述" rows="3"></textarea>
					            <div className="weui_textarea_counter"><span>0</span>/500</div>
					        </div>
					    </div>
					</div>				    			    				    				    
					<div className="weui_cells weui_cells_checkbox" style={{marginTop:0}}>
					    <label className="weui_cell weui_check_label" for="s11">
					        <div className="weui_cell_hd">
					            <input type="checkbox" className="weui_check" name="checkbox1" id="s11" />
					            <i className="weui_icon_checked"></i>
					        </div>
					        <div className="weui_cell_bd weui_cell_primary">
					            <p>是否立即上架</p>
					        </div>
					    </label>
					    <label className="weui_cell weui_check_label" for="s11">
					    	<p>提示：买手上传商品后，默认保存到未加架，若勾选立即上架商品将保存到已上架，并显示在商城中。</p>
					    </label>
					</div>	
					<div className="button_sp_area" style={{textAlign:'center'}}>
					    <a href="javascript:;" className="weui_btn weui_btn_plain_default reset">重新录入</a>
					    <a href="javascript:;" className="weui_btn weui_btn_plain_default save">立即保存</a>
					</div>									
				</div>			
		       <div className="category">
			       <div className="weui_cell_bd weui_cell_primary uploadTitle">
			           <p>发布商品</p>
			       </div> 
			       	{
				        categorys && categorys.map((category,index) =>(
					       	<div className="weui_cell weui_cell_select weui_select_after" key={index}>
						        <div className="weui_cell_hd">{category.name}</div>
						        <div className="weui_cell_bd weui_cell_primary">
						            <select className="weui_select subcatary" defaultValue="请选择" name="select" ref="subcatary" onChange={self._subCategory.bind(self)}>
						            <option value=""></option>
						            	{category.subs.length ? (category.subs.map((sub,subIndex) =>(
						            		<option value={sub} key={subIndex}>{sub}</option>
						            		))) : (<option value={category.name} key={index}>{category.name}</option>)
						            	}
						            </select>
						        </div>
						    </div>
					    ))
					}
		       </div>				
    		</div>
    		);
    }
    _category() {
    	const self = this;
    	$('.category').css('transform','translateX(0)');
    }
    _subCategory(e){
    	const self = this;
    	// const option = self.refs.subcatary.value;
    		// debugger;
    	const option = e.currentTarget.value
    	self.refs.subcataryValue.value = option;
    	$('.category').css('transform',`translateX(${document.body.clientWidth}px)`);
    	self.setState({option});
    	e.currentTarget.value = '';
    	// // console.log(option);		
    }
};

Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { Collections } = context();
    const hasUser = null;
    // const error = LocalState.get('DEMO_ERROR');
    // 订阅数据
    Meteor.subscribe('Product.category');
    const categorys = Collections.Category.find().fetch();
    // // console.log(categorys);
    onData(null, { hasUser, categorys });
};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Page);
