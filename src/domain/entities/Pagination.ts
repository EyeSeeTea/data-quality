export type Pagination = {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
};

export type RowsPaginated<T> = {
    rows: T[];
    pagination: Pagination;
};
