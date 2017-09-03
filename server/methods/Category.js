import Collections from '/lib';

export default () => {
	new ValidatedMethod({
        name: 'method.category.getCategory',
        validate: null,
        run() {
            const self = this
            return Collections.Category.find( {isRemoved: { $ne:true}},{sort:{createdAt:1},fields:{name:1,subs:1}}).fetch();
        },
    });
}