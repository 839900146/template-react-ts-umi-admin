import request from '@/utils/request';
/**
 * 登陆获取token
 */
export async function login(params: IUserApi.LoginParams) {
  return {
    status: true,
    code: 200,
    msg: '登陆成功',
    data: {
      token: '123456',
      ...params,
    },
  };
}

/**
 * 查询用户信息
 */
export async function queryUserInfo(): Promise<IUserApi.CurrentUser> {
  return {
    access: 'admin',
    address: '太阳系地球亚洲中国',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    country: '中国',
    email: 'xxx@xx.com',
    name: '张三',
    notifyCount: 12,
    phone: '10086',
    user_id: '0x001',
  };
}

/**
 * 退出登录
 */
export async function outLogin() {
  // 这是一个示例
  return request.post('/xxx', { a: 1 });
}
