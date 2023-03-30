import { loginReq } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';
import { history } from 'umi';
const Login = React.memo(() => {
  const onFinish = async (values) => {
    const res = await loginReq({
      ...values,
    });
    console.log(res);
    if (res.data) {
      localStorage.setItem('token', res.data.token);
      history.replace('/home');
    }
  };
  return (
    <>
      <div className="fixed inset-0" style={{ backgroundColor: 'white' }}>
        <LoginForm title="biomed168" subTitle="biomed168" onFinish={onFinish}>
          <ProFormText
            name="identifier"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名'}
            initialValue={'biomed'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            initialValue={'88888888'}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </LoginForm>
      </div>
    </>
  );
});
export default Login;
