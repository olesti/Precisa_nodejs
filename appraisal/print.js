const path = require('path');
const generatePdf = require('./generate-pdf');
const { print } = require('pdf-to-printer');
const settings = require('../settings.json');
const fs = require('fs');

// Generate PDF and save it to a file
// generatePdf('Arda Altinors', '04 February 2025', 'JWL2023-123', 'One Women's Engagement Ring', 'Lab Diamond', 'Approx. 1.75 ct', 'Brilliant cut radiant, 5.00 mm x 7.00 mm', '18k Gold', 'White', 'Approx. 2.25 ct', '2,130', 'https://eternate.com/cdn/shop/files/EG002-200P-Y_1600x.jpg?v=1698856488&width=1400');


/**
 * Generates the appraisal PDF and sends it to the printer.
 */
async function printAppraisal(data) {
    // Validate printer settings
    if (!settings.AppraisalPrinterName) {
        throw new Error('Printer name not configured in settings.json. Please set AppraisalPrinterName.');
    }

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

    let pdfPath;
    try {
        // Generate the PDF and get the file path
        pdfPath = await generatePdf(
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

        // Verify PDF file exists
        if (!fs.existsSync(pdfPath)) {
            throw new Error('Generated PDF file not found');
        }

        // Send PDF to printer using printer name from settings
        await print(pdfPath, {
            printer: settings.AppraisalPrinterName,
            paperSize: 'A5'
        }).catch(error => {
            if (error.message.includes('printer not found')) {
                throw new Error(`Printer "${settings.AppraisalPrinterName}" not found. Please check settings.json and verify printer name.`);
            }
            throw error;
        });

        console.log('PDF sent to printer successfully');
    } catch (err) {
        console.error('Error in printAppraisal:', {
            error: err.message,
            stack: err.stack,
            printerName: settings.AppraisalPrinterName,
            pdfPath: pdfPath || 'Not generated'
        });
        throw err;
    }
}

module.exports = {
    printAppraisal
};
