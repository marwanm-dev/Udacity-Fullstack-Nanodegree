export interface IOrder {
  id?: number;
  status: string;
  user_id: number;
}

export interface IOrderReturn {
  id: number;
  status: string;
  user_id: number;
}
