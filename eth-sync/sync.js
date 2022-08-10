class Sync {
    /**
     * @param kafkaConsumer
     * @param redis
     * @param provider
     * @param txModel
     * @param txConfigurationModel
     */
    constructor(
        kafkaConsumer,
        redis,
        provider,
        txModel,
        txConfigurationModel,
    ) {
        this.kafkaConsumer = kafkaConsumer;
        this.redis = redis;
        this.provider = provider;
        this.txModel = txModel;
        this.txConfigurationModel = txConfigurationModel;
    }

    async processNewBlockEvent(blockNumber) {
        const block = await this.provider.getBlockWithTransactions(blockNumber);

        block.transactions.forEach(tx => this.processConfirmedTransaction(tx));
    }

    async processConfirmedTransaction(transaction) {
        // here we use the logic for storing the transaction
        // If the transaction doesn't match the txModel's properties (with the configurations)
        // the tranasction won't be stored

        // await this.txModel.create(transaction);
    }

    _subscribeToProviderNodeEvents() {
        this.provider.send("eth_subscribe", ["newHeads"]);
    }

    _initProviderSubscriptionsEventsListener() {
        this.provider.on("block", this.processNewBlockEvent.bind(this));
    }

    async _configurationslistener() {
        await this.kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                await this.loadNewConfiguration(JSON.parse(message.value.toString()));
            },
        });
    }

    async loadNewConfiguration(message) {
        const configuration = await this.txConfigurationModel.findByPk(message.id);
        Object.keys(configuration.getAttributes()).forEach(attr => configuration[attr] = JSON.parse(configuration[attr]));

        const preparedAttributesForDb = {};
        Object.keys(this.model.getAttributes()).forEach(atr => {
            if (request.hasOwnProperty(atr)) {
                preparedAttributesForDb[atr] = JSON.stringify(request[atr].validate);
            }
        })

        // ...needs logic for initializing the TxModel with the new configuration's properties
        // without the need of restart
    }

    start() {
        this._configurationslistener();
        this._subscribeToProviderNodeEvents();
        this._initProviderSubscriptionsEventsListener();
    }
};

module.exports = Sync;