import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    Meteor.publish('Account.getData', function (selector,options) {
        const self = this;
        return Collections.Account.find({ createdBy: self.userId, isRemoved: { $ne: true } });
    }); 
};

