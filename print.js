const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const printer = new ThermalPrinter({
    interface: "//localhost/POS-80",
    type: PrinterTypes.EPSON,
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

        if (!isConnected) {
            throw new Error("Printer not connected");
        }

        // Content
        printer.alignLeft();
        printer.setTextSize(1, 1);

        // Two column layout for data
        printer.tableCustom([
            { text: data.orderId, align: "LEFT", width: 0.5 },
            { text: data.timestamp, align: "LEFT", width: 0.5 }
        ]);

        printer.tableCustom([
            { text: "Adet:", align: "LEFT", width: 0.5 },
            { text: data.count, align: "LEFT", width: 0.5 }
        ]);

        printer.tableCustom([
            { text: "Ağırlık:", align: "LEFT", width: 0.5 },
            { text: `${data.weight} gr`, align: "LEFT", width: 0.5 }
        ]);

        printer.tableCustom([
            { text: "Ayar:", align: "LEFT", width: 0.5 },
            { text: data.purity, align: "LEFT", width: 0.5 }
        ]);

        printer.newLine();
        printer.println("--------------------------------");


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