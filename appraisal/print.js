const path = require('path');
const generatePdf = require('./generate-pdf');
const { print } = require('pdf-to-printer');

// Generate PDF and save it to a file
// generatePdf('Arda Altinors', '04 February 2025', 'JWL2023-123', 'One Women’s Engagement Ring', 'Lab Diamond', 'Approx. 1.75 ct', 'Brilliant cut radiant, 5.00 mm x 7.00 mm', '18k Gold', 'White', 'Approx. 2.25 ct', '2,130', 'https://eternate.com/cdn/shop/files/EG002-200P-Y_1600x.jpg?v=1698856488&width=1400');


/**
 * Generates the appraisal PDF and sends it to the printer.
 */
async function printAppraisal(data) {
    const {
        preparedForName,
        appraisalDate,
        certificateNumber,
        itemDescription,
        gemstoneType,
        caratWeight,
        centerGemstoneDescription,
        material,
        metalColor,
        totalCaratWeight,
        estimatedValue,
        productImageUrl
    } = data;

    // Generate the PDF (the file will be saved under the "temp" folder)
    await generatePdf(
        preparedForName,
        appraisalDate,
        certificateNumber,
        itemDescription,
        gemstoneType,
        caratWeight,
        centerGemstoneDescription,
        material,
        metalColor,
        totalCaratWeight,
        estimatedValue,
        productImageUrl
    );

    // file path where PDF saved
    const filePath = path.join('temp', `appraisal-${preparedForName}-${appraisalDate}-${certificateNumber}.pdf`);

    // Send PDF to printer
    await print(filePath, { paperSize: 'A5' }).then(() => {
        console.log('PDF sent to printer');
    }).catch((err) => {
        console.error('Error sending PDF to printer', err);
    });
}

module.exports = {
    printAppraisal
};
