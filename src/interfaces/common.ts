import { IGenericErrorMessage } from "./error";

export type IGenericErrorResponse = {
  status_code: number;
  message: string;
  error_messages: IGenericErrorMessage[];
};

export type IGenericPaginationResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
