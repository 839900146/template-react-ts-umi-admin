const routers: IRouterConfig[] = [
  {
    path: '/User',
    layout: false,
    routes: [
      {
        path: '/User',
        routes: [
          {
            name: 'login',
            path: '/User/login',
            component: './User/Login',
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

export default routers;
