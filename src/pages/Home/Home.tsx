import React, { Suspense } from 'react';
import type { Dispatch } from 'umi';
import { useDispatch, useSelector } from 'umi';
import type { IndexModelState } from '@/models';
import { Button } from 'antd';

const About = React.lazy(() => import('./components/About'));

const HomePage: React.FC = () => {
  // 获取dispatch
  const dispatch = useDispatch<Dispatch>();

  // 获取state
  const state = useSelector(({ homeModel }: { homeModel: IndexModelState }) => homeModel);

  return (
    <div>
      <h1>这是首页</h1>
      <h2>{state.desc}</h2>
      <Button
        onClick={() => {
          dispatch({
            type: 'homeModel/update',
            payload: {
              desc: '改变后的值:' + Math.random(),
            },
          });
        }}
      >
        改变state
      </Button>
      <hr />
      <Suspense fallback={<h2>正在加载中</h2>}>
        <About />
      </Suspense>
    </div>
  );
};

export default HomePage;
