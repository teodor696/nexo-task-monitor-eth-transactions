const dotenv = require('dotenv').config()
    , { Sequelize, Op} = require("sequelize")
    , TransactionModel = require("./transaction")
    , TxConfigurationModel = require("./txConfigurationModel")
;

(async () => {
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
        console.log('Psql connection has been established successfully.');
    } catch (error) {
        console.log(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }

    /** Init model */
    const transactionModel = TransactionModel(sequelize);
    const txConfigurationModel = TxConfigurationModel(sequelize);
    await transactionModel.sync()
    await txConfigurationModel.sync()

    txConfigurationModel.hasMany(transactionModel, {foreignKey: "txConfigurationId"});

    await transactionModel.sync({ alter: true });
    await txConfigurationModel.sync({ alter: true });

    sequelize.close()
})();