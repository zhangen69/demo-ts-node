import Promise from 'promise';
import MQueryModel from '../interfaces/mongoose/query.interface';
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

    public create(model) {
        const newModel = new this.model(model);
        return new Promise((fulfill, reject) => {
            newModel.save().then((data) => {
                const result = {
                    status: 201,
                    message: `${this.modelName} created successfully!`,
                    data,
                };
                fulfill(result);
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
        return new Promise((fulfill, reject) => {
            this.model.findById(id).then((data) => {
                if (data == null) { throw new Error('Product not found!'); }

                const result = {
                    status: 200,
                    message: `${this.modelName} fetched successfully!`,
                    data,
                };
                fulfill(result);
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
        return new Promise((fulfill, reject) => {
            const query = new QueryModel(queryModel).getQuery();

            this.model.estimatedDocumentCount(query.conditions).then((count) => {
                this.model.find(query.conditions, query.selections, query.options).then((data) => {
                    const result = {
                        status: 200,
                        message: `${this.modelName} fetched all successfully!`,
                        data,
                        totalItems: count,
                        pages: Math.ceil(count / queryModel.pageSize),
                    };
                    fulfill(result);
                });
            });
        });
    }

    public update(model) {
        return new Promise((fulfill, reject) => {
            this.model.findById(model._id).then((doc) => {
                if (doc == null) { throw new Error(`${this.modelName} not found!`); }

                doc.updateOne(this._getUpdateConditions(model)).then(() => {
                    this.model.findById(model._id).then((data) => {
                        const result = {
                            status: 201,
                            message: `${this.modelName} updated successfully!`,
                            data,
                        };
                        fulfill(result);
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
        return new Promise((fulfill, reject) => {
            this.model.findByIdAndDelete(id).then((data) => {
                if (data == null) { throw new Error(`${this.modelName} not found!`); }

                const result = {
                    status: 200,
                    message: `${this.modelName} deleted successfully!`,
                };
                fulfill(result);
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

    private _getUpdateConditions(model) {
        const updateModel: MQueryModel = { $set: model };

        if (model.hasOwnProperty('audit')) {
            Object.keys(model.audit).forEach((key) => updateModel.$set[`audit.${key}`] = model.audit[key]);
            delete updateModel.$set.audit;
            delete updateModel.$set['audit.updatedDate'];
            updateModel.$currentDate = { 'audit.updatedDate': { $type: 'date' } };
        }

        return updateModel;
    }
}
