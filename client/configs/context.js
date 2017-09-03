import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { ReactiveDict } from 'meteor/reactive-dict';

import { createStore } from 'redux';

import Collections from '/lib';
import Configuration from './config';
import Utility from './utility';
import ProductList from './productList';
import ProvinceInfo from './provinceInfo';
export default ({ reducer }) => {
    return {
        Meteor,
        Tracker,
        Collections,
        Configuration,
        Utility,
        ProductList,
        ProvinceInfo,
        Store: createStore(reducer),
        LocalState: new ReactiveDict(),
    };
};