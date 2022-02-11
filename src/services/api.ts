import { request } from 'umi';

/**
 * 登陆获取token
 */
export async function login(params: { username: string; password: string; type: string }) {
  return {
    status: true,
    code: 200,
    msg: '登陆成功',
    data: {
      token: '123456',
    },
  };
}

/**
 * 查询用户信息
 */
export async function queryUserInfo() {
  return {
    status: true,
    data: {
      access: 'admin',
      address: '太阳系地球亚洲中国',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      country: '中国',
      email: 'xxx@xx.com',
      name: '张三',
      notifyCount: 12,
      phone: '10086',
      user_id: '0x001',
    },
  };
}

/**
 * 退出登录
 */
export async function outLogin() {}
