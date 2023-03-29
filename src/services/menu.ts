
import { request } from '@umijs/max';

type Menu = {
  id: number;
  name: string;
  url?: string;
  parentId?: string;
}

type ReqMenu = Omit<Menu, 'id'>

export async function menuListReq(): Promise<Menu[]> {
  return request('/v1/menu', {
    method: 'GET',
  })
}

export async function menuAddReq(body: ReqMenu) {
    return request('/v1/menu', {
      method: 'POST',
      data: body,
    })
}

export async function menuEditReq(id: number, body: ReqMenu) {
  return request(`/v1/menu/${id}`, {
    method: 'PUT',
    data: body,
  })
}

export async function menuDelReq(id: number) {
  return request(`/v1/menu/${id}`, {
    method: 'DELETE',
  })  
}

export async function menuDetailReq(id: number) {
  return request(`/v1/menu/${id}`, {
    method: 'GET',
  })
}