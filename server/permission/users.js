import { Meteor } from 'meteor/meteor';
import Collections from '/lib';
export default () => {
    Collections.Product.allow({
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });	
    Meteor.users.deny({
        update: function (userId, party, fields, modifier) {
            return true;
        },
        remove: function (userId, party) {
            return true;
        },
    });
};