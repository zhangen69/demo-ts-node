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

        router.post(`/${this.modelName}`, (req, res) => {
            this.resHandling(res, this.modelService.create(req.body));
        });

        router.get(`/${this.modelName}/:id`, (req, res) => {
            // res.send(req.params.id);
            this.resHandling(res, this.modelService.fetch(req.params.id));
        });

        router.get(`/${this.modelName}`, (req, res) => {
            const queryModel = req.query.queryModel || '{}';
            this.resHandling(res, this.modelService.fetchAll(JSON.parse(queryModel)));
        });

        router.put(`/${this.modelName}/`, (req, res) => {
            this.resHandling(res, this.modelService.update(req.body));
        });

        router.delete(`/${this.modelName}/:id`, (req, res) => {
            this.resHandling(res, this.modelService.delete(req.params.id));
        });

        return router;
    }

    private resHandling(res, func) {
        try {
            func.then((result) => {
                // res.send('hello world!');
                res.status(result.status).json(result);
            }).catch((result) => {
                res.status(result.status).json(result);
            });
        } catch (error) {
            console.log('Error Occurs!');
            console.error(error);
        }
    }
}

module.exports = StandardRoutes;
