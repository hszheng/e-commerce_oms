import common from './common';
import Journal from './Journal';
import Product from './Product';
import users from './Users';
import Order from './Order';
import Withdraw from './Withdraw';
import Logistics from './Logistics'
import Account from './Account';
import VerifyInfo from './VerifyInfo';
import Category from './Category';
import ReplaceBuyOrder from './ReplaceBuyOrder';
export default () => {
    common();
	Journal();
	Product();
	users();
	Order();
	Account();
	Withdraw();
	Logistics();
    VerifyInfo();
    Category();
    ReplaceBuyOrder();
};