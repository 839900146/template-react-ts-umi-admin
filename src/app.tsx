import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import * as service from './services/api';
import { LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: IUserApi.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<IUserApi.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const data = await service.queryUserInfo();
      return data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 菜单左侧的开发文档链接, 只在开发模式下会展示, build后会自动剔除
    links: isDev
      ? [
          <a
            key="AntDesign文档"
            href="https://ant.design/index-cn"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined />
            <span>AntDesign文档</span>
          </a>,
          <a
            key="AntDesignPro文档"
            href="https://beta-pro.ant.design/index-cn"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined />
            <span>AntDesignPro文档</span>
          </a>,
          <a
            key="ProComponents文档"
            href="https://procomponents.ant.design/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined />
            <span>ProComponents文档</span>
          </a>,
          <a key="umijs文档" href="https://umijs.org/zh-CN" target="_blank" rel="noreferrer">
            <LinkOutlined />
            <span>umijs文档</span>
          </a>,
          <a
            key="antd chart文档"
            href="https://charts.ant.design/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkOutlined />
            <span>antd chart文档</span>
          </a>,
          <a key="IconFont" href="https://www.iconfont.cn/" target="_blank" rel="noreferrer">
            <LinkOutlined />
            <span>IconFont</span>
          </a>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
