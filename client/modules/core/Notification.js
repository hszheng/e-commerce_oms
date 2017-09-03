import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from './Loading';
import PreSettleOrderFee from './PreSettleOrderFee';
class Page extends React.Component {
    constructor(props) {
        // 构造函数
        super(props);
        const self = this;   
    }    
    componentWillMount() {
        // 加载component时执行

    }

    componentWillUnmount() {
        // 卸载component时执行

    }

    render() {
        const self = this;
        const { toConfirm, toDeliver, toPurchase, signed, withdrawAmount } = self.props;
        return (
            <div className="merchanInfo-container">
                <div className="merchanInfo">
                    <div className="waitConfirm" onClick={self._toStatus.bind(self)}>
                        <div className="quantity" >{toConfirm}</div>
                        <div className="illustrate">待确定</div>
                    </div>
                    <div className="waitBuy" onClick={self._toStatus.bind(self)}>
                        <div className="quantity">{toPurchase}</div>
                        <div className="illustrate">待采购</div>
                    </div>
                    <div className="waitShip" onClick={self._toStatus.bind(self)}>
                        <div className="quantity">{toDeliver}</div>
                        <div className="illustrate">待发货</div>
                    </div>
                    <div className="alrReceive" onClick={self._toStatus.bind(self)}>
                        <div className="quantity">{signed}</div>
                        <div className="illustrate">总订单</div>
                    </div>
                    <div className="totalTurn" onClick={self._toMyAccount.bind(self)}>
                        <div className="quantity"><PreSettleOrderFee /></div>
                        <div className="illustrate">待结算金额</div>
                    </div>
                    <div className="withdraw" onClick={self._toMyAccount.bind(self)}>
                        <div className="quantity">{withdrawAmount.toFixed(2)}</div>
                        <div className="illustrate">可提现金额</div>
                    </div>
                </div>
            </div>
        );
    }
    // 点击总交易额/可提现金额
    _toMyAccount(e) {
        const self = this;
        const router = self.context.router;
        router.push('/myAccount');
    }
    // 点击待确定
    _toStatus(e){
        const self = this;
        const content = e.currentTarget.children[1].textContent;
        let status = '';
        if(content === '总订单') {
            status = '全部';
        } else {
            status = content;
        }
        // // // console.log(e.currentTarget);

        self.props._toStatus(status);
    }
}

Page.contextTypes = {
    router: React.PropTypes.object,
};

const composer = ({ context, clearErrors }, onData) => {
    const { Meteor } = context();

    const currentUser = Meteor.user();

    currentUser && Meteor.call('Order.methods.getNotiCount', (err, { toConfirm, toDeliver, toPurchase, signed }) => {
        if (!err) {
            onData(null, { toConfirm, toDeliver, toPurchase, signed, withdrawAmount: currentUser.withdrawAmount }); 
        }
    });
};

const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
