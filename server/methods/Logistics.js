import Collections from '/lib';

export default () => {

	// 根据订单的id去查找与其有关的物流
	new ValidatedMethod({
        name: 'Logistics.methods.getNowOrder',
        validate: null,
        run(orderId) {
        	return Collections.Logistics.find({orderId:orderId}).fetch();
        }
    });
}