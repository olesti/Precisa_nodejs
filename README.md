## Configuration

Başlatmadan önce, `settings.json` üzerinden Printer'ın adını girin. Printer adını bulmak için localhost:5000 get isteği atabilirsiniz.

```json
{
    "AppraisalPrinterName": "YOUR_PRINTER_NAME"
}
```

## API Endpoints

### Print Appraisal

Generates and prints an appraisal document.

**Endpoint:** `POST /print-appraisal`

**Example Request:**

```bash
curl -X POST "http://localhost:5000/print-appraisal" -H "Content-Type: application/json" -d "{\"preparedForName\": \"Arda Altinors\", \"appraisalDate\": \"04 February 2025\", \"certificateNumber\": \"JWL2023-123\", \"itemDescription\": \"One Women's Engagement Ring\", \"gemstoneType\": \"Lab Diamond\", \"caratWeight\": \"Approx. 1.75 ct\", \"centerGemstoneDescription\": \"Brilliant cut radiant, 5.00 mm x 7.00 mm\", \"material\": \"18k Gold\", \"metalColor\": \"White\", \"totalCaratWeight\": \"Approx. 2.25 ct\", \"estimatedValue\": \"2,130\", \"productImageUrl\": \"https://eternate.com/cdn/shop/files/EG002-200P-Y_1600x.jpg?v=1698856488^&width=1400\"}"
```

## Starting the Service

1. Make sure your printer is configured in `settings.json`
2. Run `start.bat` to start the service
3. The service will be available at `http://localhost:5000`
