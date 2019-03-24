export default interface IQueryModel {
    pageSize: number;
    currentPage: number;
    searchText: string;
    max?: number;
    min?: number;
    type?: string;
    queryType?: string;
    filters?: any[];
    sort?: string;
    sortDirection: string;
}
