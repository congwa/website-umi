import { defineConfig } from '@umijs/max';

//  这里umi有bug，一直没有修复
// https://github.com/umijs/umi/issues/10863
// https://github.com/umijs/umi/issues/10855
// https://github.com/umijs/umi/issues/10851

// 使用不优雅的方式实现目的
const defineEnv = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      'process.env.UMI_APP_UPLOAD_URL': 'http://localhost:3003',
    };
  } else if (process.env.NODE_ENV === 'production') {
    return {
      'process.env.UMI_APP_UPLOAD_URL': 'http://localhost:3003',
    };
  }
};

export default defineConfig({
  define: defineEnv(),
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'biomed168',
  },
  mfsu: {},
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
  tailwindcss: {},
  npmClient: 'pnpm',
});
