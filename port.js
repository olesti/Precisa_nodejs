// Node.js program to read data from a serial port
const { SerialPort } = require("serialport");
const ReadlineParser = require("@serialport/parser-readline");
const express = require("express");
const cors = require("cors");
const { Document, Packer,TabStopType,TabStopPosition , Paragraph, TextRun, AlignmentType } = require("docx");
const fs = require("fs");
const app = express();

app.use(cors());
const portApp = 5000;
let latestData = "";
const portName = "COM3";
const port = new SerialPort({
  baudRate: 9600, // Adjust the baud rate as needed
  autoOpen: true,
  path: "COM3",
   
});

function extractFirstFloat(str) {
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}
port.setEncoding("ascii");
/* if(!port.isOpen){
  port.open((err) => {
    if (err) {
      
      return console.error(`Error opening port: ${err.message}`);
    }
    console.log(`Port ${portName} opened successfully.`);
  });
} */
// Create a parser to read data line-by-line
const parser = port.pipe(new ReadlineParser.ReadlineParser());
// Listen for data
parser.on("data", (data) => {
  // const buffer = Buffer.from(data, "utf8");
  // const stringData = buffer.toString("utf8");
  latestData = data;
  // console.log(`Received data: ${data}`);
});
// Handle errors
port.on("error", (err) => {
  console.error(`Error: ${err.message}`);
});

// Handle port closure
port.on("close", () => {
  console.log("Port closed.");
});

// API endpoint to trigger reading data
app.get("/Weight", (req, res) => {
  // res.status(200).send("0.0");
   if (latestData) {
    const floatNumbers = extractFirstFloat(latestData);

    res.status(200).send("0.0");
    // res.status(200).send(floatNumbers.toString());
  } else {
    res.status(500).json({ error: "No data available or not received yet" });
  } 
});




app.listen(portApp, () => {
  console.log(`Example app listening on port ${port.path}`);
});