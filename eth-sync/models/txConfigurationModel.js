const { DataTypes, Model } = require('sequelize');

class TxConfigurationModel extends Model {
    static getPredefinedAttributes() {
        return {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                unique: true,
            },
            hash: { type: DataTypes.TEXT },
            blockHash: { type: DataTypes.TEXT },
            blockNumber: { type: DataTypes.TEXT },
            transactionIndex: { type: DataTypes.TEXT },
            from: { type: DataTypes.TEXT },
            to: { type: DataTypes.TEXT },
            value: { type: DataTypes.TEXT },
            nonce: { type: DataTypes.TEXT },
            gasPrice: { type: DataTypes.TEXT },
            gasLimit: { type: DataTypes.TEXT },
            maxFeePerGas: { type: DataTypes.TEXT },
        };
    }

}

/**
 * @param {Sequelize} sequelize
 * @param {object} options
 * @returns {TxConfigurationModel}
 */
module.exports = (sequelize, options = {}) => {
    const defaultOptions = {
        sequelize: sequelize,
        modelName: 'TxConfigurationModel',
        tableName: 'tx_configurations',
        timestamps: false,
    };

    return TxConfigurationModel.init(
        TxConfigurationModel.getPredefinedAttributes(),
        Object.assign(defaultOptions, options)
    );
};