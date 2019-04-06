import { checkAuth } from '../middlewares/checkAuth';

export default class StandardRoutes {
    private modelName: string;
    private modelService: any;

    constructor(modelName, modelService) {

        this.modelName = modelName;
        this.modelService = modelService;
    }

    public router(router) {
        if (!router) {
            throw new Error('"router" is not defined.');
        }

        router.post(`/${this.modelName}`, checkAuth, (req, res) => {
            this.resHandling(res, this.modelService.create(req.body, req.auth));
        });

        router.get(`/${this.modelName}/:id`, checkAuth, (req, res) => {
            this.resHandling(res, this.modelService.fetch(req.params.id));
        });

        router.get(`/${this.modelName}`, checkAuth, (req, res) => {
            const queryModel = req.query.queryModel || '{}';
            this.resHandling(res, this.modelService.fetchAll(JSON.parse(queryModel)));
        });

        router.put(`/${this.modelName}/`, checkAuth, (req, res) => {
            this.resHandling(res, this.modelService.update(req.body, req.auth));
        });

        router.delete(`/${this.modelName}/:id`, checkAuth, (req, res) => {
            this.resHandling(res, this.modelService.delete(req.params.id));
        });

        return router;
    }

    private resHandling(res, func) {
        try {
            func.then((result) => {
                res.status(result.status).json(result);
            }).catch((result) => {
                res.status(result.status).json(result);
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = StandardRoutes;
