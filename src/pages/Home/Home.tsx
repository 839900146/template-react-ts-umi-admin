import React, { Suspense } from 'react';
const About = React.lazy(() => import('./components/About'));

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>这是首页</h1>
      <hr />
      <Suspense fallback={<h2>正在加载中</h2>}>
        <About />
      </Suspense>
    </div>
  );
};

export default HomePage;
