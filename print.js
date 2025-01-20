const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const printer = new ThermalPrinter({
    interface: "//localhost/POS-80",
    width: 42, // Standard thermal paper width
    characterSet: "PC857_TURKISH",
    removeSpecialCharacters: false,
    options: {
        timeout: 10000
    }
});

async function printReceipt(data) {
    try {
        const isConnected = await printer.isPrinterConnected();
        console.log("Printer connected:", isConnected);

        // Content
        printer.alignLeft();
        printer.setTextSize(0, 0);

        // Order details
        printer.println(` ${data.orderId} ${new Date().toLocaleString()}`);
        printer.println(`${data.count} adet >> ${data.weight}gr/${data.purity}`);

        printer.drawLine(); // Çizgi çiz

        // Cut the paper
        printer.cut();

        const executeResult = await printer.execute();
        console.log("Print success:", executeResult);
        return executeResult;
    } catch (error) {
        console.error("Error printing:", error);
        throw error;
    }
}

module.exports = { printReceipt };