import Configuration from './config';

export default () => {
    ServiceConfiguration.configurations.remove({
        service: 'wechat',
    });
    ServiceConfiguration.configurations.insert({
        service: 'wechat',
        appId: Configuration.APP_ID,
        scope: 'basic',
        secret: Configuration.APP_SECRET,
        mainId: 'openId',
    });
};