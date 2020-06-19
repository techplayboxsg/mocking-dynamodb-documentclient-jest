const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const queryProductByCode = (code = '') => {
    return new Promise((resolve, reject) => {
        documentClient.query({
            TableName: "product",
            KeyConditionExpression: "#code= :code",
            ExpressionAttributeNames: {
                "#code": "code"
            },
            ExpressionAttributeValues: {
                ":code": code,
            }
        },
        (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Items.pop());
            }
        });
    });
};
module.exports = {queryProductByCode};
