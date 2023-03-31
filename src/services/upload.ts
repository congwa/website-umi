import { request } from '@umijs/max';

export async function uploadReq(body: any) {
  return request('/v1/upload/album', {
    method: 'POST',
    data: body,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
