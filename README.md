# 文件结构以及意义

> Meteor+Mantra+React+React Router

```js
meteorDemo
    |---client                          保存客户端加载的资源。
    |     |---configs                   保存配置文件。
    |     |     |---context.js          context配置文件。
    |     |
    |     |---modules                   所有模块。
    |     |     |---core                核心模块。
    |     |         |---actions         业务逻辑。
    |     |         |---components      组件。
    |     |         |---configs         模块的配置信息。
    |     |         |---containers      容器。
    |     |         |---lib             第三方库。
    |     |         |---index.js        模块的入口。
    |     |         |---routes.jsx      前端Route。
    |     |
    |     |---main.js                   客户端入口。
    |
    |---lib                             保存Collections。
    |     |---collections               保存所有Collections文件。
    |     |---index.js                  lib入口。
    |
    |---node_modules                    保存npm安装的包。
    |---public                          保存所有的公有资源，不会默认加载到前端，通过路径访问。
    |---server                          保存服务端使用的所有资源。
    |     |---configs                   保存服务端的配置文件。
    |     |---lib                       保存服务端使用的第三方资源。
    |     |---methods                   保存服务端所有的methods文件。
    |     |      |---index.js           methods入口。
    |     |
    |     |---permission                设置collections的权限。
    |     |      |---index.js           permission入口。
    |     |      |---users.js           用户信息的权限设置。
    |     |
    |     |---publications              collections数据publish规则。
    |     |      |---index.js           publications入口。
    |     |
    |     |---restapi                   保存服务端所有的接口文件。
    |     |      |---restapi.js         服务端所有的接口。
    |     |
    |     |---main.js                   服务端入口。
    |
    |---packages.json                   设置项目依赖的npm安装的packages。
```
