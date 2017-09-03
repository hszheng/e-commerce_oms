import lib from './lib';
import publications from './publications';
import permission from './permission';
import methods from './methods';
import restapi from './restapi/restapi';
import initServer from './configs';

lib();
publications();
permission();
methods();
restapi();
initServer();
