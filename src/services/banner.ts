import { request } from '@umijs/max';

type Banner =  {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  createdAt: string;
  updatedAt: string;
}

type ReqBanner = Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>



export async function bannerListReq(): Promise<Banner[]> {
  return request('/v1/banner', {
    method: 'GET',
  })
}


export async function bannerAddReq(body: ReqBanner) {
  console.log(body, '-----')
  return request('/v1/banner', {
    method: 'POST',
    data: body,
  });
}

export async function bannerEditReq(id: number, body: ReqBanner) {
  return request(`/v1/banner/${id}`, {
    method: 'PUT',
    data: body,
  });
}

export async function bannerDelReq(id: number) {
  return request(`/v1/banner/${id}`, {
    method: 'DELETE',
  });
}

export async function bannerDetailReq(id: number) {
  return request(`/v1/banner/${id}`, {
    method: 'GET',
  });
}

