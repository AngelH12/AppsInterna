export interface GenericApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
