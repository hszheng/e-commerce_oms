import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '../core/Loading';
import { Link } from 'react-router';
import QRCode from 'qrcode.react';

import { Popconfirm, Button, Table, Input} from 'antd';

class Page extends React.Component {

    componentWillMount() {
        // 加载component时执行
        const self = this;
    }

    componentWillUnmount() {
        const self = this;
        const { LocalState } = self.props.context();
        LocalState.set('limiter', null);
    }

    render() {
        const self = this;
        const { journals, journalImageUrl, count } = self.props;
        const InputGroup = Input.Group;
        const columns = [
            { title: '名称', render: (text, record) => (
                <span>{record.name}</span>
            )},
            { title: '涉及商品', dataIndex: 'categories' },
            { title: '浏览次数', dataIndex: 'views' },
            { title: '创建时间', render: (text, record) => (
                <span>{moment(record.createdAt).format('YYYY-MM-DD')}</span>
            )},
            { title: '操作', render: (text, record) => (
                <span>
                    <a onClick={self._shareJournalItem.bind(self, record)}>分享</a>
                    <span className="ant-divider"></span>
                    <Popconfirm title="确定要删除该淘刊？" onConfirm={self._deleteJournalItem.bind(self, record)}>
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
            )},
        ];
        journals.forEach((data, index) => {
            data.key = data._id;
        });
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

        return (
            <div className="periodical">
                <div className="ant-search-input-wrapper" style={{ width: '200px', margin: '20px' }}>
                    <InputGroup>
                      <Input placeholder="搜索" style={{ textAlign: 'center' }} onChange={self.searchChange.bind(self)} onKeyDown = {self.pressSearch.bind(self)} ref="searchKey" />
                      <div className="ant-input-group-wrap">
                        <Button icon="search" nClick={self.searchProduct.bind(self)}/>
                      </div>
                    </InputGroup>
                </div>
                <Button className="newlyBuild" type="primary"><Link to='/newIssue'>+新建淘刊</Link></Button>
                <Table className="table" columns={columns} dataSource={journals} pagination={pagination} />
                <div className="qr-code" ref="qrcode" onClick={self._cancelCode.bind(self)}>
                    <div className="code-image">
                        <i className="fa fa-times cancel" aria-hidden="true"></i>
                        <QRCode value = {journalImageUrl } size={300} />
                    </div>
                </div>
            </div>
        );
    }

    // 页码改变
    pageChange(page) {
        const self = this;
        const { LocalState } = self.props.context();
        const limiter = LocalState.get('limiter');
        limiter.options.skip = (page - 1) * limiter.options.limit;
        LocalState.set('limiter', limiter);
    }
    // 每页加载数量改变
    pageSizeChange(page, size) {
        const self = this;
        const { LocalState } = self.props.context();
        const limiter = LocalState.get('limiter');
        limiter.options.limit = size;
        limiter.options.skip = (page - 1) * limiter.options.limit;
        LocalState.set('limiter', limiter);
    }

    // 分享剘刊
    _shareJournalItem(journal) {
        const self = this;
        const { Configuration, LocalState } = self.props.context();
        const unionid = self.props.unionid;
        self.refs.qrcode.style.display = 'block';
        const qrcode = `${Configuration.WECHAT_HOST}/journalImage/${journal._id}?inviteId=${unionid}`;
        // console.log(qrcode);
        LocalState.set('journalImageUrl', `${Configuration.WECHAT_HOST}/journalImage/${journal._id}?inviteId=${unionid}`);
    }
    // 关掉分享的界面
    _cancelCode(e) {
        const self = this;
        if (e.target.tagName.toUpperCase() === 'CANVAS') {
            return;
        }
        self.refs.qrcode.style.display = 'none';
    }
    // 删除Item的函数
    _deleteJournalItem(journal) {
        const self = this;
        const { LocalState } = self.props.context();
        const data = {
            _id: journal._id,
            modifier: {
                isRemoved: true,
            },
        };
        Meteor.call('Journal.methods.update', data);
    }
    // 搜索产品
    searchProduct() {
        const self = this;
        const { LocalState } = self.props.context();
        const searchKey = self.refs.searchKey.refs.input.value.trim();
        const limiter = LocalState.get('limiter');
        limiter.selector.name = {
            $regex: searchKey,
            $options: 'i',
        };
        limiter.options.skip = 0;
        LocalState.set('limiter', limiter);
    }
    // 搜索框变化
    searchChange() {
        const self = this;
        const { LocalState } = self.props.context();
        const searchKey = self.refs.searchKey.refs.input.value.trim();
        const limiter = LocalState.get('limiter');
        limiter.selector.name = {
            $regex: searchKey,
            $options: 'i',
        };
        limiter.options.skip = 0;
        LocalState.set('limiter', limiter);
    }
    // 搜索框回车
    pressSearch(e) {
        if (e.keyCode === 13) {
            const self = this;
            const { LocalState } = self.props.context();
            const searchKey = self.refs.searchKey.refs.input.value.trim();
            const limiter = LocalState.get('limiter');
            limiter.selector.name = {
                $regex: searchKey,
                $options: 'i',
            };
            limiter.options.skip = 0;
            LocalState.set('limiter', limiter);
        }
    }    
}


Page.contextTypes = {
    router: React.PropTypes.object,
};

// 从状态管理模块获取数据
const composer = ({ context }, onData) => {
    const { LocalState, Meteor, Collections } = context();

    if (!LocalState.get('limiter')) {
        LocalState.set('limiter', {
            selector: {
                createdBy: Meteor.userId(),
                isRemoved: { $ne: true },
            },
            options: {
                skip: 0,
                limit: 10,
                sort: { createdAt: -1 },
            },
        });
    }
    const limiter = LocalState.get('limiter');

    const journalImageUrl = LocalState.get('journalImageUrl') || '';

    // 订阅数据
    Meteor.subscribe('Journal.issueCount');
    Meteor.subscribe('Journal.issueList', limiter);

    const count = Counts.get('issueCount');
    const journals = Collections.Journal.find({}, {sort: limiter.options.sort}).fetch();
    const unionid = Meteor.user() ? Meteor.user().unionid : '';
    // // console.log(unionid);
    // // console.log(journals);
    onData(null, { journals, journalImageUrl, count, unionid });

};

// 从依赖注入层获取数据
const depsMapper = (context) => ({
    context: () => context,
});

export default composeAll(
    composeWithTracker(composer, Loading),
    useDeps(depsMapper)
)(Page);
