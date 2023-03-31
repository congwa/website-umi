import { request } from '@umijs/max';

type Product = {
  id: number;

  name: string;

  description: string;

  price: number | null;

  image: string | null;

  menuId: number | null;
};

type ReqProduct = Omit<Product, 'id'>;

export async function productListReq(): Promise<Product[]> {
  return request('/v1/product', {
    method: 'GET',
  });
}

export async function productAddReq(body: ReqProduct) {
  return request('/v1/product', {
    method: 'POST',
    data: body,
  });
}

export async function productEditReq(id: number, body: ReqProduct) {
  return request(`/v1/product/${id}`, {
    method: 'PATCH',
    data: body,
  });
}

export async function productDelReq(id: number) {
  return request(`/v1/product/${id}`, {
    method: 'DELETE',
  });
}

export async function productDetailReq(id: number) {
  return request(`/v1/product/${id}`, {
    method: 'GET',
  });
}

export async function productMenuListReq(menuId: number) {
  return request(`/v1/product/menuPage/${menuId}`, {
    method: 'GET',
  });
}

export async function productMenuListAllReq(menuId: number) {
  return request(`/v1/product/menuAll/${menuId}`, {
    method: 'GET',
  });
}
