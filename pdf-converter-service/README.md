# PDF to Word Converter Service

Microservizio per convertire PDF in DOCX usando pdf2docx.

## Deploy su Railway

1. Crea un account su [Railway](https://railway.app)
2. Installa Railway CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. Inizializza progetto: `railway init`
5. Deploy: `railway up`

Railway genererà automaticamente un URL pubblico tipo:
`https://your-service.up.railway.app`

## Configurazione in ToolsLab

Dopo il deploy, aggiungi l'URL come variabile d'ambiente in Vercel:

```bash
NEXT_PUBLIC_PDF_CONVERTER_URL=https://your-service.up.railway.app
```

## Test locale

```bash
# Installa dipendenze
pip install -r requirements.txt

# Avvia server
python main.py

# Test
curl -X POST http://localhost:8080/convert \
  -H "Content-Type: application/json" \
  -d '{"pdf": "BASE64_PDF_DATA"}'
```

## API Endpoints

### POST /convert

Converte un PDF in DOCX

**Request:**

```json
{
  "pdf": "base64_encoded_pdf_data"
}
```

**Response:**

```json
{
  "docx": "base64_encoded_docx_data",
  "metadata": {
    "docxSize": 12345,
    "pdfSize": 54321
  }
}
```

### GET /health

Health check endpoint

**Response:**

```json
{
  "status": "ok"
}
```
