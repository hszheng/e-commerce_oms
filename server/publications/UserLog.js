import { Meteor } from 'meteor/meteor';

import Collections from '/lib';

export default () => {
    Meteor.publish('UserLog.getData', function () {
        const self = this;
        return Collections.UserLog.find({ createdBy: self.userId, isRemoved: { $ne: true } }, {sort: { createdAt: -1 }});
    });
};

