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
