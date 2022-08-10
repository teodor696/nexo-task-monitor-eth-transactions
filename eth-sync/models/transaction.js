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
            txConfigurationId: {type: DataTypes.INTEGER, allowNull: false }
        };
    }

    static async assignConfigurationToCurrentPredefinedAttributes(configuration) {
        const attributes = this.getPredefinedAttributes();

        Object.keys(attributes).forEach(k => {
            attributes[k].validate = configuration[k].validate;
        })

        return attributes;
    }
}


/**
 * Returns a function which accepts db attributes properties
 * and initializes a model
 * @param {Sequelize} sequelize
 * @returns {function}
 */
module.exports = (sequelize, options) => {
    const defaultOptions = Object.assign({
        sequelize: sequelize,
        modelName: 'TxConfigurationModel',
        tableName: 'tx_configurations',
        timestamps: false,
    }, options);

    return (attributes) => {
        return TransactionModel.init(
            attributes,
            Object.assign(defaultOptions, options)
        )
    };
};