import server from '../../config/server';

/**
 * 获取用户token
 */
export const GetToken = (): string => {
  try {
    return localStorage.getItem(server.tokenKey) || '';
  } catch {
    return '';
  }
};

/**
 * 设置token
 * @param token token字符串
 */
export const SetToken = (token: string): boolean => {
  try {
    if (token) {
      localStorage.setItem(server.tokenKey, token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * 删除token
 */
export const ClearToken = (): void => {
  localStorage.removeItem(server.tokenKey);
};
