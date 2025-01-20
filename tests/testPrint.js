// testPrint.js
const { printReceipt } = require('../print');

const sampleData = {
    orderId: "E131231231",
    count: 2,
    weight: 500,
    purity: "575",
    timestamp: new Date().toLocaleString()
};

printReceipt(sampleData)
    .then(result => {
        console.log("Receipt printed successfully:", result);
    })
    .catch(error => {
        console.error("Failed to print receipt:", error);
    });