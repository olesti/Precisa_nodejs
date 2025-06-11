const fs=require("fs")
const generatePdf=require("./generate-pdf")
const settings=require("../settings.json");
const { print } = require("pdf-to-printer");
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
   /*  finally {
        // settings.json'da debug modu false ise pdf dosyası silinir.
        if (pdfPath && fs.existsSync(pdfPath)) {
            if (!settings.debug) {
                try {
                    await fs.promises.unlink(pdfPath);
                    console.log(`Temporary PDF file ${pdfPath} deleted.`);
                } catch (cleanupError) {
                    console.error(`Failed to delete temporary PDF file ${pdfPath}:`, cleanupError);
                }
            } else {
                console.log('Debug mode enabled; temporary PDF file retained at', pdfPath);
            }
        }
    } */
}
module.exports={printAppraisal}