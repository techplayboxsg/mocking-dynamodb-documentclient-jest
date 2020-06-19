const mockDocumentClientQueryFn = jest.fn();
jest.mock("aws-sdk", () => {
    return {
        DynamoDB: {
            DocumentClient: class {
                constructor() {
                    this.query = mockDocumentClientQueryFn;
                }
            }
        }
    };
});
const {queryProductByCode} = require("../src/query-product-by-code.js");
const {applyProductPriceMarkup} = require("../src/apply-product-price-markup.js");

describe('Product Service', () => {

    beforeEach(() => {
        mockDocumentClientQueryFn.mockReset();
    });

    it('should return product by code.', async () => {
        const code= "00001";
        const price= 13.50;
        /*
        * What we are doing here is to mock implement the
        * DocumentClient query callback function
        * (err, data) => {}
        */
        mockDocumentClientQueryFn.mockImplementation((params, callback) => {
            const productLineItem = {code, price};
            callback(null, {Items: [productLineItem]});
        });

        const product = await queryProductByCode(code);
        expect(product).toBeDefined();
        expect(product.code).toBe(code);
        expect(product.price).toBe(price);
    });

    it('markup should apply percentage on price.', async () => {
        const code= "00001";
        const price= 13.50;
        const markup = 20.00; // 20% markup
        /*
        * What we are doing here is to mock implement the
        * DocumentClient query callback function
        * (err, data) => {}
        */
        mockDocumentClientQueryFn.mockImplementation((params, callback) => {
            /*
            * First argument is null because we are mocking for
            * non-error callback
            * Second argument mocks the return object from
            * DynamoDB which is in this model structure:
            * {Items: []}
            * Ignore the count and scanned count attributes.
            */
            /*
            * Suppose that this mock query implementation returns
            * a single product line item.
            */
            // Mimics DynamoDB line item.
            const productLineItem = {code, price};
            callback(null, {Items: [productLineItem]});
        });

        const priceAfterMarkup = await applyProductPriceMarkup(code, markup);
        expect(priceAfterMarkup).toBe(16.20);
    });

    it('should throw an error if code is invalid.', async() => {
        mockDocumentClientQueryFn.mockImplementation((params, callback) => {
            /*
            * Suppose that this mock query implementation returns
            * empty results. (No product matching code)
            */
            callback(null, {Items: []});
        });
        try {
            await applyProductPriceMarkup();
        } catch (err) {
            /*
            * An Error object is thrown in applyProductPriceMarkup()
            * and since message is a property of Error, we use matcher function
            * toMatchObject to match a subset of the Error object.
            */
            expect(err).toMatchObject({
                message: "Product code is not valid.",
            });
        }
    });
});
