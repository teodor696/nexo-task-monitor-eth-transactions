const Logger = require("./helpers/logger")
    , dotenv = require('dotenv').config()
    , ethers = require("ethers")
    , { Sequelize } = require("sequelize")
    , {Kafka} = require("kafkajs")
    , { createClient } = require("redis")
    , Sync = require('./sync')
    , TransactionModel = require('./models/transaction')
    , TransactionConfigurationModel = require('./models/txConfigurationModel')
;

(async () => {
    const logger = new Logger(process.env.LOG_LEVEL);

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
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }

    const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS] });
    const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });
    await consumer.connect();

    await consumer.subscribe({ topic: process.env.KAFKA_CONFIGURATIONS_TOPIC, fromBeginning: true });

    const redisClient = createClient();
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    await redisClient.connect();

    const ethNodeProvider = new ethers.providers.InfuraProvider.getWebSocketProvider(
        process.env.BLOCKCHAIN_NETWORK,
        process.env.INFURA_API_KEY
    );

    const transactionModel = TransactionModel(sequelize);
    const txConfigurationModel = TransactionConfigurationModel(sequelize);

    const sync = new Sync(
        consumer,
        redisClient,
        ethNodeProvider,
        transactionModel,
        txConfigurationModel,
    );

    sync.start();
})();