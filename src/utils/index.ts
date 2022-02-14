import moment from 'moment';
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

/**
 * 获取日期
 * @param source 日期对象的实例或者时间戳
 * @param time 是否展示时间(时分秒)
 * @returns yyyy/mm/dd hh:mm:ss
 */
export const getDate = (source?: Date | string, time?: boolean): string => {
  const d = source || Date.now();
  return moment(d).format(`YYYY/MM/dd${time ? 'HH:mm:ss' : ''}`);
};

interface SelectFile {
  multiple?: boolean;
  webkitdirectory: boolean;
  accept: string;
}
/**
 * 选择文件
 * @param conf 可选配置
 */
export const selectFile = (conf?: SelectFile): Promise<any> => {
  return new Promise((resolve) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    if (conf?.multiple) fileInput.setAttribute('multiple', 'true');
    if (conf?.webkitdirectory) fileInput.setAttribute('webkitdirectory', 'true');
    if (conf?.accept) fileInput.setAttribute('accept', conf.accept);
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.files) {
        resolve(target.files);
      }
    });
    fileInput.click();
  });
};
