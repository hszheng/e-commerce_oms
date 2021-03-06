import Journal from './Journal';
import users from './users';
import Product from './Product';
import Category from './Category';
import Order from './Order';
import Account from './Account';
import Withdraw from './Withdraw';
import UserLog from './UserLog';
import ReplaceBuyOrder from './ReplaceBuyOrder';
export default () => {
    Journal();
    users();
    Product();
    Category();
    Order();
    Account();
    Withdraw();
    UserLog();
    ReplaceBuyOrder();
};
