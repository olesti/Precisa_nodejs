const fs = require('fs');
const mustache = require('mustache');
const puppeteer = require('puppeteer');
const path = require('path');

async function generatePdf(preparedForName, appraisalDate, certificateNumber, itemDescription, gemstoneType, caratWeight, centerGemstoneDescription, material, metalColor, totalCaratWeight, estimatedValue, productImageUrl) {
    try {
        // Read the HTML template from file using absolute path
        const templatePath = path.join(__dirname, 'template.html');
        const template = fs.readFileSync(templatePath, 'utf8');

        // Render the template with the provided data
        const renderedHtml = mustache.render(template, {
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
        });

        // Launch Puppeteer to convert HTML to PDF (Needs chrome installed)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content for the page
        await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Generate the PDF and save it to a file using absolute path
        const pdfPath = path.join(tempDir, `appraisal-${preparedForName}-${appraisalDate}-${certificateNumber}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        console.log(`PDF generated successfully as ${pdfPath}`);

        return pdfPath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

module.exports = generatePdf;
