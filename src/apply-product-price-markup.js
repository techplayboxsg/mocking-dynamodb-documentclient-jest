const {queryProductByCode} = require("./query-product-by-code.js");

/**
* @arg code - Product code
* @arg markup - Floating markup in percentage
*/
const applyProductPriceMarkup = async(code = '', markup = 1.00) => {
    const product = await queryProductByCode(code);
    if (product) {
        const priceAfterMarkup = product.price * (1 + (markup/100));
        return priceAfterMarkup;
    } else {
        throw new Error("Product code is not valid.");        
    }
};

module.exports = {applyProductPriceMarkup};
