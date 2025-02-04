const fs = require('fs');
const mustache = require('mustache');
const puppeteer = require('puppeteer');

async function generatePdf(preparedForName, appraisalDate, certificateNumber, itemDescription, gemstoneType, caratWeight, centerGemstoneDescription, material, metalColor, totalCaratWeight, estimatedValue, productImageUrl) {
    try {
        // Read the HTML template from file
        const template = fs.readFileSync('template.html', 'utf8');

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

        // Generate the PDF and save it to a file
        await page.pdf({
            path: `temp/appraisal-${preparedForName}-${appraisalDate}-${certificateNumber}.pdf`,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        console.log(`PDF generated successfully as appraisal-${preparedForName}-${appraisalDate}-${certificateNumber}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

module.exports = generatePdf;
