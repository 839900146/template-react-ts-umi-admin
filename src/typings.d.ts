declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'prd' | false;

interface ApiPrefix {
  dev: string;
  prd: string;
  test: string;
}

interface IRouterConfig {
  /**组件的相对路径, 相对于pages文件夹 */
  component?: any;
  /**如果为true, 则是绝对匹配 */
  exact?: boolean;
  /**浏览器访问该组件的路径 */
  path?: string;
  /**子路由 */
  routes?: IRouterConfig[];
  /**路由的高阶组件封装 */
  wrappers?: string[];
  /**配置路由的标题 */
  name?: string;
  /**路由菜单的图标名, 图标名只支持antd的图标 */
  icon?: string;
  /**路由重定向 */
  redirect?: string;
  [key: string]: any;
}

declare module IUserApi {
  interface CurrentUser {
    user_id: string;
    name: string;
    phone: string;
    avatar: string;
    access: string;
    country?: string;
    email?: string;
    address?: string;
    [propName: string]: any;
  }

  interface LoginParams {
    username: string;
    password: string;
    type: 'account' | 'mobile';
  }

  interface LoginResult {
    status: boolean;
    code: number;
    msg?: string;
    data: {
      token: string;
      type?: 'account' | 'mobile';
    };
  }
}
