export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/Home',
    name: '首页',
    icon: 'HomeOutlined',
    component: './Home/Home',
  },
  {
    path: '/',
    redirect: '/Home',
  },
  {
    component: './404',
  },
];
