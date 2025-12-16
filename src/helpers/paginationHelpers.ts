import { SortOrder } from 'mongoose';

// receive type
type IOptions = {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: SortOrder;
};
// return type
type IReturn = {
  page: number;
  limit: number;
  skip: number;
  sort_by: string;
  sort_order: SortOrder;
};

const calculatePagination = (options: IOptions): IReturn => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  // Queries
  const sort_by = options.sort_by || 'createdAt';
  const sort_order = options.sort_order || 'desc';
  return {
    page,
    limit,
    skip,
    sort_by,
    sort_order,
  };
};

export const paginationHelper = {
  calculatePagination,
};
