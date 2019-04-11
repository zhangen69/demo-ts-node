export interface IQueryModel {
  pageSize: number;
  currentPage: number;
  sort?: string;
  sortDirection?: string;
  searchText?: string;
  type?: string;
  queryType?: string; // string, number, Date, ...
  selectedFilter?: any;
  min?: number;
  max?: number;
}
