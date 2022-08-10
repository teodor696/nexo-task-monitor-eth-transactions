const Router = require("koa-router");

class TxConfigurationsRouter {
    /**
     * @param {TxConfigurationController} txConfigurationsController
     */
    constructor(txConfigurationsController) {
        this.txConfigurationsController = txConfigurationsController;
        this.router = new Router();
        this._createRoutes();
    };

    _createRoutes() {
        this.router.get('/tx-configuration/:id', this.txConfigurationsController.getById.bind(this.txConfigurationsController))
        // this.router.get('/tx-configuration', this.txConfigurationsController.getAll.bind(this.txConfigurationsController))
        // this.router.get('/tx-configuration/current', this.txConfigurationsController.getCurrent().bind(this.txConfigurationsController))
        this.router.post('/tx-configuration', this.txConfigurationsController.create.bind(this.txConfigurationsController))
        // this.router.put('/tx-configuration/:id', this.txConfigurationsController.updateById.bind(this.txConfigurationsController))
        // this.router.delete('/tx-configuration/:id', this.txConfigurationsController.deleteById.bind(this.txConfigurationsController))
    }

    getRoutes() {
        return this.router.routes();
    }
}

module.exports = TxConfigurationsRouter;
