export interface IOrderProducts {
  id?: number;
  quantity?: number;
  order_id: number;
  product_id: number;
}

export interface IOrderProductsReturn {
  id: number;
  quantity: number;
  order_id: number;
  product_id: number;
}
