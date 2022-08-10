const Logger = require("./helpers/logger")
    , dotenv = require('dotenv').config()
    , { Sequelize } = require("sequelize")
    , { Kafka } = require("kafkajs")
    , Koa = require('koa')
    , bodyParser = require("koa-body")
    , TxConfigurationController = require("./controllers/txConfigurationController")
    , TxConfigurationsRouter = require("./routes/TxConfigurationsRouter")
    , TxConfigurationModel = require("./models/txConfigurationModel")
;

(async () => {
    const logger = new Logger(process.env.LOG_LEVEL);

    /** Init psql connection */
    const sequelize = new Sequelize(
        process.env.POSTGRESQL_DB,
        process.env.POSTGRESQL_USER,
        process.env.POSTGRESQL_PASSWORD,
        {
            host: process.env.POSTGRESQL_HOST || 'localhost',
            port: process.env.POSTGRESQL_PORT ? parseInt(process.env.POSTGRESQL_PORT, 10) : 5432,
            dialect: 'postgres',
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        logger.info('Psql connection has been established successfully.');
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }

    /** Init kafka connection */
    const kafka = new Kafka({ brokers: ["localhost:29092"] });
    const producer = kafka.producer();

    await producer.connect().then(() => {
        logger.info("Kafka connection has been established successfully.")
    }).catch(reason => {
        logger.error(`Unexpected server error: ${reason}`);
        process.exit(1);
    });

    /** Init model */
    const txConfigurationModel = TxConfigurationModel(sequelize);

    /** Init controller */
    const txConfigurationsController = new TxConfigurationController(logger, producer, txConfigurationModel);

    /** Create routes */
    const txConfigurationsRouter = new TxConfigurationsRouter(txConfigurationsController);

    const app = new Koa();
    app.use(bodyParser());
    app.use(txConfigurationsRouter.getRoutes());

    app.listen(3000);
})();