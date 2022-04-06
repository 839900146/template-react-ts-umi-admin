// 这是一个测试的model示例
import type { Effect, Reducer } from 'umi';
const namespace = 'homeModel';

/**
 * state的类型
 */
export interface IndexModelState {
  desc: string;
}

/**
 * model的类型接口
 */
export interface IndexModelType {
  namespace: typeof namespace;
  state: IndexModelState;
  effects: {
    update: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
  };
}

/**
 * model的实现
 */
const IndexModel: IndexModelType = {
  namespace,

  state: {
    desc: '这是state里的数据',
  },

  effects: {
    *update({ payload }, { put }) {
      console.log('effects query', payload);
      // 如果访问的是本文件里的reduces, 则不需要带上namespace
      yield put({ type: 'save', payload });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default IndexModel;
