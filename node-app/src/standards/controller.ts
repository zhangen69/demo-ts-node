import Promise from 'promise';
import IMongooseQueryModel from '../interfaces/mongoose/mongooseQueryModel.interface';
import QueryModel from '../models/query.model';

export default class StandardController {
    private modelName: string;
    private model = null;

    constructor(modelName: string) {
        this.modelName = modelName;
        // this.model = require(`../models/${this.modelName}.model`);
        import(`../models/${this.modelName}.model`).then((module) => {
            this.model = module.default;
        });
    }

    // CRUD functions - create, fetch, fetchAll, update, delete

    public create(model, auth) {
        if (auth.isAuth) {
            model.audit = { updatedBy: auth.user._id, createdBy: auth.user._id };
        }
        // const Product = require('../models/product.model');
        // const newProduct = new Product();
        // newProduct.save().then((data) => {

        // });
        const newModel = new this.model(model);
        return new Promise((resolve, reject) => {
            newModel.save().then((data) => {
                const result = {
                    status: 201,
                    message: `${this.modelName} created successfully!`,
                    data,
                };
                resolve(result);
            }).catch((error) => {
                const result = {
                    status: 500,
                    message: `${this.modelName} failed to create!`,
                    error: error.toString(),
                };
                reject(result);
            });
        });
    }

    public fetch(id) {
        return new Promise((resolve, reject) => {
            this.model.findById(id).then((data) => {
                if (data == null) { throw new Error('Product not found!'); }

                const result = {
                    status: 200,
                    message: `${this.modelName} fetched successfully!`,
                    data,
                };
                resolve(result);
            }).catch((error) => {
                const result = {
                    status: 500,
                    message: `${this.modelName} not found!`,
                    error: error.toString(),
                };
                reject(result);
            });
        });
    }

    public fetchAll(queryModel) {
        return new Promise((resolve, reject) => {
            const { conditions, options } = new QueryModel(queryModel).getQuery();

            const tempConditions = { name: /e/i };
            const sortQuery = (options.sortDirection === 0 ? '' : '-') + options.sort;

            this.model.countDocuments(conditions).then((count) => {
                this.model.find(conditions).sort(sortQuery).skip(options.skip).limit(options.limit).then((data) => {
                    const result = {
                        status: 200,
                        message: `${this.modelName} fetched all successfully!`,
                        data,
                        totalItems: count,
                        currentPage: queryModel.currentPage,
                        totalPages: Math.ceil(count / queryModel.pageSize),
                    };
                    resolve(result);
                });
            });
        });
    }

    public update(model, auth) {
        return new Promise((resolve, reject) => {
            this.model.findById(model._id).then((doc) => {
                if (doc == null) { throw new Error(`${this.modelName} not found!`); }

                doc.updateOne(this._getUpdateConditions(model, auth)).then(() => {
                    this.model.findById(model._id).then((data) => {
                        const result = {
                            status: 201,
                            message: `${this.modelName} updated successfully!`,
                            data,
                        };
                        resolve(result);
                    });
                });
            }).catch((error) => {
                const result = {
                    status: 500,
                    message: `${this.modelName} failed to update!`,
                    error: error.toString(),
                };
                reject(result);
            });
        });
    }

    public delete(id) {
        return new Promise((resolve, reject) => {
            this.model.findByIdAndDelete(id).then((data) => {
                if (data == null) { throw new Error(`${this.modelName} not found!`); }

                const result = {
                    status: 200,
                    message: `${this.modelName} deleted successfully!`,
                };
                resolve(result);
            }).catch((error) => {
                const result = {
                    status: 500,
                    message: `${this.modelName} failed to delete!`,
                    error: error.toString(),
                };
                reject(result);
            });
        });
    }

    private _getUpdateConditions(model, auth) {
        const updateModel: IMongooseQueryModel = { $set: model };

        if (model.hasOwnProperty('audit')) {
            if (auth.isAuth) {
                model.audit.updatedBy = auth.user._id;
            }

            Object.keys(model.audit).forEach((key) => updateModel.$set[`audit.${key}`] = model.audit[key]);
            delete updateModel.$set.audit;
            delete updateModel.$set['audit.updatedDate'];
            updateModel.$currentDate = { 'audit.updatedDate': { $type: 'date' } };
        }

        return updateModel;
    }
}
