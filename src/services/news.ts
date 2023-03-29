import { request } from '@umijs/max';

type News = {
  id: number;

  title: string;

  content: string | null;

  authorId: number | null;

  menuId: number;

  createdAt: Date | null;

  updatedAt: Date | null;
};

type ReqNews = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;

export async function newsListReq(): Promise<News[]> {
  return request('/v1/news', {
    method: 'GET',
  });
}

export async function newsAddReq(body: ReqNews) {
  return request('/v1/news', {
    method: 'POST',
    data: body,
  });
}

export async function newsEditReq(id: number, body: ReqNews) {
  return request(`/v1/news/${id}`, {
    method: 'PUT',
    data: body,
  });
}

export async function newsDelReq(id: number) {
  return request(`/v1/news/${id}`, {
    method: 'DELETE',
  });
}

export async function newsDetailReq(id: number) {
  return request(`/v1/news/${id}`, {
    method: 'GET',
  });
}
