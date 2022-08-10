const { DataTypes, Model } = require('sequelize');

class TransactionModel extends Model {
    static getPredefinedAttributes() {
        return {
            hash: {
                type: DataTypes.TEXT,
                primaryKey: true,
                unique: true,
            },
            blockHash: {type: DataTypes.TEXT},
            blockNumber: {type: DataTypes.INTEGER},
            transactionIndex: {type: DataTypes.INTEGER},
            from: {type: DataTypes.TEXT},
            to: {type: DataTypes.TEXT},
            value: {type: DataTypes.TEXT},
            txConfigurationId: {type: DataTypes.INTEGER }
        };
    }
}

/**
 * @param {Sequelize} sequelize
 * @param {object} options
 * @returns {TransactionModel}
 */
module.exports = (sequelize, options) => {
    const defaultOptions = Object.assign({
        sequelize: sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        timestamps: false,
    }, options);

    return TransactionModel.init(
        TransactionModel.getPredefinedAttributes(),
        Object.assign(defaultOptions, options)
    )
};