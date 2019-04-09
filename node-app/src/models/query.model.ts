import IMongooseQueryModel from '../interfaces/mongoose/mongooseQueryModel.interface';
import IQueryModel from '../interfaces/queryModel.interface';

export default class QueryModel implements IQueryModel {
    sort = 'audit.updatedDate';
    sortDirection = 'DESC';
    pageSize = 0;
    currentPage = 0;
    searchText = '';
    max = null;
    min = null;
    type = null;
    queryType = 'string';
    filters = [];

    constructor(queryModel: any = {}) {
        // for pagination
        this.pageSize = queryModel.pageSize || this.pageSize;
        this.currentPage = queryModel.currentPage || this.currentPage;
        // for filter/search
        this.searchText = queryModel.searchText || this.searchText;
        this.max = queryModel.max || this.max;
        this.min = queryModel.min || this.min;
        this.type = queryModel.type || this.type;
        this.queryType = queryModel.queryType || this.queryType;
        // for sorting
        this.sort = queryModel.sort || this.sort;
        this.sortDirection = queryModel.sortDirection || this.sortDirection;
        // advanced search
        this.filters = queryModel.filters || this.filters;
    }

    public getQuery() {
        // query patterns: conditions, select columns, pagination options
        const conditions: any = {};
        const options = { skip: (this.currentPage * this.pageSize), limit: this.pageSize, sort: '', sortDirection: 0 };

        if (!!this.type && !!this.searchText) {
            this._getCondition(conditions, this);
        }

        if (this.filters.length > 0) {
            this.filters.forEach((filter) => {
                if (!filter.queryType) { filter.queryType = 'string'; }
                if (!!filter.type) {
                    this._getCondition(conditions, filter);
                }
            });
        }

        if (this.sort) {
            options.sort = this.sort;
            options.sortDirection = this.sortDirection === 'ASC' ? 0 : -1;
        }

        return {conditions, options};
    }

    private _isEmpty(obj) {
        return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

    private _getCondition(conditions, options) {
        switch (options.queryType) {
            case 'string':
                if (conditions[options.type] !== undefined) {
                    conditions[options.type].push(new RegExp(`${options.searchText}`, 'gi'));
                } else {
                    conditions[options.type] = [new RegExp(`${options.searchText}`, 'gi')];
                }
                break;
            case 'number':
                const query: IMongooseQueryModel = {};

                if (options.min != null) {
                    query.$gte = options.min;
                }

                if (options.max != null) {
                    query.$lte = options.max;
                }

                // if (options.searchText) {
                //     query['$in'] = [new RegExp(`${options.searchText}`, 'gi')];
                // }

                if (conditions[options.type] !== undefined) {
                    // make entries to the conditions
                    const keys = Object.keys(conditions[options.type]);

                    // check has match from query to conditions
                    const queryEntries = Object.entries(query);
                    queryEntries.forEach((keyItem) => {
                        const keyName = keyItem[0];
                        const keyVal = keyItem[1];

                        if (keys.includes(keyName)) {
                            if (conditions.$and !== undefined) {
                                conditions.$and.push({ [keyName]: keyVal });
                            } else {
                                conditions.$and = [conditions[options.type], { [keyName]: keyVal }];
                            }
                        } else {
                            conditions[options.type][keyName] = keyVal;
                        }
                    });

                } else if (!this._isEmpty(query)) {
                    conditions[options.type] = query;
                }
                break;
            default:
                throw new Error(`Undefined 'queryType' as ${this.queryType}`);
        }

        return conditions;
    }
}
