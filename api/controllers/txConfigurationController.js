const createTxConfigurationValidation = require('../serviceValidations/createTxConfiguration')
    , getTxConfigurationById = require('../serviceValidations/getTxConfigurationById')
    , { txConfigurationEvents } = require("../enumerations/events")
;

class TxConfigurationController {
    /**
     * @param {Logger} logger
     * @param {Producer} kafkaProducer
     * @param {TxConfigurationModel} txConfigurationModel
     */
    constructor(logger, kafkaProducer, txConfigurationModel) {
        this.logger = logger;
        this.kafkaProducer = kafkaProducer;
        this.model = txConfigurationModel;
    };

    async create(ctx, next) {
        const request = ctx.request.body;
        const validation = createTxConfigurationValidation(request, Object.keys(this.model.getAttributes()));
        if (validation) {
            this.logger.debug(`${this.constructor.name}.create() Bad request: ${validation}`);

            ctx.status = 400;
            ctx.body = { message: validation };
        }

        const preparedAttributesForDb = {};
        Object.keys(this.model.getAttributes()).forEach(atr => {
            if (request.hasOwnProperty(atr)) {
                preparedAttributesForDb[atr] = JSON.stringify(request[atr].validate);
            }
        })

        try {
            const doc = await this.model.create(preparedAttributesForDb);
            console.log(doc.id);
            await this.kafkaProducer.send({
                topic: "tx-configurations",
                messages: [
                    { value: JSON.stringify(
                            {id: doc.id.toString(), event: txConfigurationEvents.CONFIGURATION_CREATED}
                        )}
                ]
            });

            ctx.status = 200;
            ctx.body = { message: "Configuration created", configuration: doc };
        } catch (e) {
            this.logger.error(`Unexpected server error: ${e}`);
        }
    };

    async getById(ctx, next) {
        const request = {
            id: ctx.request.params.id
        };

        const validation = getTxConfigurationById(request);
        if (validation) {
            this.logger.debug(`${this.constructor.name}.create() Bad request: ${validation}`);

            ctx.status = 400;
            ctx.body = { message: validation };
        }

        try {
            const doc = await this.model.findByPk(request.id);

            ctx.status = 200;
            ctx.body = doc;
        } catch (e) {
            this.logger.error(`Unexpected server error: ${e}`);
        }
    };

    //
    // async getCurrent(ctx, next) {
    //
    // }
    //
    // async updateById(ctx, next) {
    //
    // };
    //
    // async deleteById(ctx, next) {
    //
    // };
}

module.exports = TxConfigurationController;