import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    Meteor.publish('Withdraw.getData', function () {
        const self = this;
        return Collections.Withdraw.find({ createdBy: self.userId, isRemoved: { $ne: true } }, {sort: { createdAt: -1 }});
    }); 
};

