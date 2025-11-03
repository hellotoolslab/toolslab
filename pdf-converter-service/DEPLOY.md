# 🚀 Deploy PDF Converter su Railway

## Step 1: Setup Railway

1. Vai su [railway.app](https://railway.app) e crea un account (gratuito)
2. Installa Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Login:
   ```bash
   railway login
   ```

## Step 2: Deploy il Service

Dalla directory `pdf-converter-service`:

```bash
cd pdf-converter-service

# Inizializza progetto Railway
railway init

# Seleziona "Empty Project" quando richiesto
# Dai un nome tipo "toolslab-pdf-converter"

# Deploy
railway up

# Railway builderà automaticamente usando il Dockerfile
```

## Step 3: Ottieni l'URL Pubblico

```bash
# Genera un dominio pubblico
railway domain

# Output sarà tipo:
# https://toolslab-pdf-converter-production.up.railway.app
```

Oppure dalla dashboard Railway:

1. Vai al tuo progetto
2. Click su "Settings" → "Domains"
3. Click "Generate Domain"
4. Copia l'URL generato

## Step 4: Configura Vercel

1. Vai su [vercel.com](https://vercel.com) → Dashboard
2. Seleziona il progetto "toolslab"
3. Settings → Environment Variables
4. Aggiungi nuova variabile:
   - **Name**: `NEXT_PUBLIC_PDF_CONVERTER_URL`
   - **Value**: `https://toolslab-pdf-converter-production.up.railway.app` (il tuo URL Railway)
   - **Environments**: Seleziona Production, Preview, Development

5. Rideploy il sito:
   ```bash
   git push origin main
   ```

## Step 5: Test

Dopo il deploy di Vercel, vai su:

```
https://toolslab.dev/tools/pdf-to-word
```

Carica un PDF e verifica che la conversione funzioni!

## 🎯 Free Tier Limits (Railway)

- ✅ **500 ore/mese** di runtime (più che sufficiente)
- ✅ **512MB RAM**
- ✅ **1GB Storage**
- ✅ **100GB Bandwidth**

Con il nostro servizio, questo significa:

- ~**50,000 conversioni/mese** (ipotizzando 3 secondi per conversione)
- Completamente **GRATUITO** ✨

## 🔧 Test Locale

Prima di deployare, puoi testare in locale:

```bash
# Terminal 1: Avvia il servizio
cd pdf-converter-service
pip install -r requirements.txt
python main.py

# Terminal 2: Avvia toolslab
cd ..
npm run dev

# Il servizio girerà su http://localhost:8080
# ToolsLab lo userà automaticamente come fallback
```

## 📊 Monitoring

Dashboard Railway mostra:

- CPU usage
- Memory usage
- Request count
- Deployment logs

Accedi a: `railway logs --tail`

## 🚨 Troubleshooting

**Errore: "Service not reachable"**

- Verifica che il dominio Railway sia attivo: `railway domain`
- Controlla logs: `railway logs --tail`

**Errore: "Out of memory"**

- PDF troppo grande (limite 10MB è intenzionale)
- Controlla Railway dashboard per memory usage

**Build fallisce:**

- Verifica che Dockerfile sia corretto
- Controlla requirements.txt dependencies

## 🔐 Security

Il servizio include:

- CORS configurato per accettare richieste da toolslab.dev
- Pulizia automatica dei file temporanei
- Timeout di 120 secondi per evitare hanging requests
- No storage permanente (privacy garantita)

---

✅ Una volta completato il setup, la conversione PDF funzionerà con qualità professionale, completamente gratis! 🎉
