const { validations } = require("../enumerations/sequelizeValidations")
    , { sequelizeValidations } = require('../helpers/helpUrls')
;

/**
 * @param {object} requestBody
 * @param {array} tableAttributes
 * @returns {{message}}
 */
module.exports = (requestBody, tableAttributes) => {
    try {
        Object.keys(tableAttributes).forEach(atr => {
            if (requestBody[atr].validate && typeof requestBody[atr].validate === "object") {
                Object.keys(requestBody[atr].validate).forEach(v => {
                    if (!validations.hasOwnProperty(v)) {
                        throw `Invalid validation key ${v}. Check the possible validations at: ${sequelizeValidations}`;
                    }
                })
            }
        })
    } catch (err) {
        return { message: err};
    }
}