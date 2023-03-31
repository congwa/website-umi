import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'biomed168',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '登陆',
      path: '/login',
      headerRender: false,
      menuRender: false,
      component: './Login',
      hideInMenu: true,
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      hideInMenu: true,
      wrappers: ['@/wrappers/login'],
    },
    {
      name: '公司信息',
      path: '/companies',
      component: './Companies',
      hideInMenu: false,
      wrappers: ['@/wrappers/login'],
    },
    {
      name: '菜单管理',
      path: '/menu',
      component: './Menu',
      hideInMenu: false,
      wrappers: ['@/wrappers/login'],
    },
    {
      name: '轮播图',
      path: '/banner',
      component: './Banner',
      hideInMenu: false,
      wrappers: ['@/wrappers/login'],
    },
    {
      name: '新闻管理',
      path: '/news',
      component: './News',
      hideInMenu: false,
      wrappers: ['@/wrappers/login'],
    },
    {
      name: '产品管理',
      path: '/product',
      component: './Product',
      hideInMenu: false,
      wrappers: ['@/wrappers/login'],
    },
  ],
  proxy: {
    '/v1': {
      target: 'http://127.0.0.1:3003',
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
      logLevel: 'debug',
    },
  },
  npmClient: 'pnpm',
  tailwindcss: {},
});
