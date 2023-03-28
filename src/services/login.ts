import { request } from '@umijs/max';

export async function loginReq(body: any) {
  return request('/v1/auth/login', {
    method: 'POST',
    data: body,
  });
}
