# 🚀 OctoTools Edge Config - Guida Completa

## 📋 Panoramica

Questa guida ti mostra come utilizzare **Vercel Edge Config** per gestire dinamicamente i tool di OctoTools senza rideploy. Con Edge Config puoi:

- ✅ **Abilitare/disabilitare tool** in tempo reale
- 🎯 **Controllare feature flags** (ads, maintenance mode, Pro)
- 🔄 **Gestire A/B testing** e esperimenti
- ⚡ **Latenza <10ms** per le configurazioni
- 🛡️ **Fallback automatico** se Edge Config non è disponibile

---

## 🛠️ Setup Iniziale

### 1. Configurazione Environment

Il tuo file `.env.local` deve contenere:

```bash
# Vercel Edge Config URL (ottenuto da Vercel Dashboard)
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_xxxxx?token=xxxxx

# Chiave admin per modifiche
ADMIN_SECRET_KEY=super-secret-admin-key-2024
```

### 2. Prima Volta: Popola Edge Config

```bash
# Carica i dati iniziali nell'Edge Config
npm run edge-config:populate
```

Questo script caricherà:

- **5 tool predefiniti** (JSON Formatter, Base64, URL Encoder, JWT Decoder, UUID Generator)
- **3 categorie** (Data Conversion, Encoding & Security, Generators)
- **Feature flags** (ads disabilitate, Pro abilitato, maintenance off)
- **Configurazioni base**

---

## 📊 Visualizzare la Configurazione

### Comando Base

```bash
npm run edge-config:show
```

**Output esempio:**

```
📋 Current Edge Config:
=======================

🛠️  Tools (5):
   ✅ ⭐ JSON Formatter (json-formatter)
   ✅ ⭐ Base64 Encoder/Decoder (base64-encoder)
   ✅ ⭐ URL Encoder/Decoder (url-encoder)
   ✅ ⭐ JWT Decoder (jwt-decoder)
   ✅    UUID Generator (uuid-generator)

📁 Categories (3):
   ✅ Data & Conversion (data-conversion)
   ✅ Encoding & Security (encoding-security)
   ✅ Generators (generators)

🎯 Feature Flags:
   Ads: ❌
   Maintenance: ✅
   Pro: ✅

📊 Meta:
   Version: 1.0.0
   Environment: production
   Last Updated: 21/08/2024, 15:30:25
```

### Test Diretto

```bash
# Visualizza raw JSON dall'Edge Config
npm run edge-config:test
```

---

## ⚙️ Gestione Tool Dinamica

### Abilitare/Disabilitare Tool

```bash
# Disabilita un tool (non apparirà sul sito)
npm run edge-config:manage disable json-formatter

# Riabilita un tool
npm run edge-config:manage enable json-formatter
```

**Cosa succede:**

- Il tool scompare immediatamente dal sito (senza rideploy!)
- Gli utenti che tentano di accedere vengono reindirizzati alla homepage
- Le API ritornano 404 per il tool disabilitato

### Esempi Pratici

```bash
# Scenario: Bug nel JSON Formatter
npm run edge-config:manage disable json-formatter
# → Tool disabilitato immediatamente per tutti gli utenti

# Scenario: Bug fixato
npm run edge-config:manage enable json-formatter
# → Tool riabilitato immediatamente
```

### Gestione Categorie

Le categorie organizzano i tool e controllano la navigazione del sito.

```bash
# Disabilita una categoria (nasconde tutti i tool della categoria)
npm run edge-config:manage disable-cat generators

# Riabilita una categoria
npm run edge-config:manage enable-cat generators

# Lista tutte le categorie disponibili
npm run edge-config:manage show
```

**📋 Categorie disponibili:**

| ID Categoria        | Nome Visualizzato   | Descrizione                               |
| ------------------- | ------------------- | ----------------------------------------- |
| `data-conversion`   | Data & Conversion   | Tool per conversione e formattazione dati |
| `encoding-security` | Encoding & Security | Codifica, decodifica e sicurezza          |
| `text-format`       | Text & Format       | Manipolazione e formattazione testo       |
| `generators`        | Generators          | Generatori di vari tipi di dati           |
| `web-design`        | Web & Design        | Tool per sviluppo web e design            |
| `dev-utilities`     | Dev Utilities       | Utilità per sviluppatori                  |

**⚡ Effetti immediati:**

- ❌ **Categoria disabilitata** = non appare nel menu di navigazione
- 🔍 **Tool della categoria** potrebbero essere nascosti nell'interfaccia
- 📱 **Gestione sezioni** intere del sito con un singolo comando
- ⚡ **Propagazione** entro 30 secondi (cache TTL)

**💡 Casi d'uso:**

```bash
# Nascondi tutti i generatori temporaneamente
npm run edge-config:manage disable-cat generators

# Disabilita la sezione design durante manutenzione
npm run edge-config:manage disable-cat web-design

# Test A/B: mostra solo encoding e data conversion
npm run edge-config:manage disable-cat text-format
npm run edge-config:manage disable-cat dev-utilities
```

---

## 🎯 Gestione Feature Flags

### Maintenance Mode

```bash
# Attiva maintenance mode (tutto il sito)
npm run edge-config:manage maintenance on

# Disattiva maintenance mode
npm run edge-config:manage maintenance off
```

**Effetto:**

- Con maintenance ON: tutti gli utenti vedranno una pagina di manutenzione
- Gli admin con token possono ancora accedere

### Controllo Ads

```bash
# Abilita pubblicità
npm run edge-config:manage ads on

# Disabilita pubblicità
npm run edge-config:manage ads off
```

**Effetto:**

- Le ads appaiono/scompaiono immediatamente su tutto il sito
- Utile per test A/B o controllo dei ricavi

---

## 📝 Aggiungere Nuovi Tool

### Comando Base

```bash
npm run edge-config:manage add-tool '{"name":"Color Picker","slug":"color-picker","description":"Pick and convert colors","category":"web-design"}'
```

### Template Completo

```bash
npm run edge-config:manage add-tool '{
  "name": "Color Picker",
  "slug": "color-picker",
  "description": "Pick and convert colors between formats",
  "category": "web-design",
  "enabled": true,
  "featured": false,
  "order": 10,
  "searchVolume": 1000,
  "icon": "Palette",
  "flags": {
    "isNew": true,
    "isBeta": false
  },
  "metadata": {
    "monthlyUsers": 500,
    "averageRating": 4.5,
    "keywords": ["color", "picker", "hex", "rgb"]
  }
}'
```

**Campi obbligatori:**

- `name`: Nome del tool
- `slug`: Identificatore univoco per URL
- `description`: Descrizione breve

**Campi opzionali:**

- `category`: Categoria (default: "dev-utilities")
- `enabled`: Abilitato (default: true)
- `featured`: In evidenza homepage (default: false)
- `order`: Ordine visualizzazione (default: 999)
- `icon`: Icona Lucide (default: "Tool")
- `flags`: Badge e stati speciali
- `metadata`: Statistiche e SEO

---

## 🧪 Testing e Verifica

### Workflow di Test

```bash
# 1. Visualizza stato corrente
npm run edge-config:show

# 2. Fai una modifica
npm run edge-config:manage disable json-formatter

# 3. Avvia l'app locale
npm run dev

# 4. Testa l'API
curl http://localhost:3000/api/tools/config

# 5. Verifica sul browser
open http://localhost:3000
```

### Test API Specifici

```bash
# Test tool abilitati
curl http://localhost:3000/api/tools/config?enabled=true

# Test tool featured
curl http://localhost:3000/api/tools/config?featured=true

# Test singolo tool
curl http://localhost:3000/api/tools/json-formatter

# Test ricerca
curl "http://localhost:3000/api/tools/search?q=json"
```

---

## 🔄 Scenari d'Uso Comuni

### 1. Deploy di Sicurezza

```bash
# Scenario: Bug critico nel JSON Formatter durante il weekend
npm run edge-config:manage disable json-formatter
# → Tool disabilitato immediatamente, zero downtime

# Lunedì mattina dopo il fix
npm run edge-config:manage enable json-formatter
```

### 2. Rollout Graduale

```bash
# Step 1: Aggiungi tool come beta
npm run edge-config:manage add-tool '{"name":"New Tool","slug":"new-tool","flags":{"isBeta":true}}'

# Step 2: Testa con utenti beta

# Step 3: Rimuovi flag beta
# (modifica manuale tramite Vercel Dashboard)

# Step 4: Rendi featured
# (modifica manuale tramite Vercel Dashboard)
```

### 3. A/B Testing

```bash
# Test: Disabilita temporaneamente tool popolare
npm run edge-config:manage disable base64-encoder

# Monitora analytics per vedere l'impatto

# Riabilita dopo il test
npm run edge-config:manage enable base64-encoder
```

### 4. Gestione Traffico

```bash
# Picco di traffico inaspettato? Disabilita tool pesanti
npm run edge-config:manage disable json-formatter
npm run edge-config:manage disable base64-encoder

# Server sotto controllo? Riabilita tutto
npm run edge-config:manage enable json-formatter
npm run edge-config:manage enable base64-encoder
```

---

## 🚨 Troubleshooting

### Edge Config Non Funziona

```bash
# 1. Testa connessione
npm run edge-config:test

# 2. Se fallisce, usa development mode
# Modifica temporaneamente .env.local:
EDGE_CONFIG=http://localhost:3001

# 3. Avvia server locale
npm run edge-config:dev    # Terminal 1
npm run dev                # Terminal 2
```

### Modifiche Non Si Applicano

```bash
# 1. Verifica che la modifica sia stata salvata
npm run edge-config:show

# 2. Riavvia Next.js (cache middleware)
# Ctrl+C e poi npm run dev

# 3. Testa API direttamente
curl http://localhost:3000/api/tools/config
```

### Tool Non Appare Dopo Aggiunta

```bash
# 1. Verifica che sia abilitato
npm run edge-config:show

# 2. Controlla slug univoco
npm run edge-config:manage enable nome-tool-corretto

# 3. Verifica categoria esistente
# (deve corrispondere a una categoria in Edge Config)
```

---

## 📈 Monitoraggio e Analytics

### Headers di Debug

L'app aggiunge automaticamente headers per debugging:

```
X-Edge-Config-Status: loaded | fallback
X-Tool-Category: data-conversion
X-Tool-Featured: true
X-Processed-At: 2024-08-21T15:30:25Z
```

### Monitoring in Produzione

```bash
# Check headers in produzione
curl -I https://octotools.org/tools/json-formatter

# Dovrebbe includere:
# X-Edge-Config-Status: loaded
# X-Tool-Category: data-conversion
```

---

## 🔒 Sicurezza e Best Practices

### Permessi

- **EDGE_CONFIG URL**: Contiene token read-only, sicuro nei file env
- **ADMIN_SECRET_KEY**: Solo per operazioni di scrittura, mantieni segreto
- **Modifiche**: Solo tramite script autorizzati o Vercel Dashboard

### Backup

```bash
# Salva configurazione corrente
npm run edge-config:show > backup-$(date +%Y%m%d).txt

# O in JSON
curl "$EDGE_CONFIG" > backup-$(date +%Y%m%d).json
```

### Limiti

- **Dimensione**: Massimo 512KB per Edge Config
- **Rate limiting**: Max 1000 request/min per token
- **Propagazione**: Cambiamenti attivi in ~10ms globalmente

---

## 🎯 Comandi Quick Reference

```bash
# Setup iniziale
npm run edge-config:populate

# Visualizzazione
npm run edge-config:show
npm run edge-config:test

# Gestione tool
npm run edge-config:manage enable tool-slug
npm run edge-config:manage disable tool-slug

# Gestione categorie
npm run edge-config:manage enable-cat category-id
npm run edge-config:manage disable-cat category-id

# Feature flags
npm run edge-config:manage maintenance on|off
npm run edge-config:manage ads on|off

# Nuovo tool
npm run edge-config:manage add-tool '{"name":"Tool","slug":"tool"}'

# Help completo
npm run edge-config:manage help
```

---

## 🔮 Funzionalità Avanzate

### Integrazione con CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Update Edge Config
  run: |
    npm run edge-config:manage enable new-feature
    npm run edge-config:manage ads on
```

### Scripting Avanzato

```bash
# Disabilita tutti i tool tranne i core
for tool in $(npm run edge-config:show | grep "✅" | awk '{print $4}'); do
  if [[ ! "$tool" =~ (json-formatter|base64-encoder) ]]; then
    npm run edge-config:manage disable ${tool//(/}
  fi
done
```

### Monitoraggio Automatico

```bash
# Script per check periodici
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$EDGE_CONFIG")
if [[ $STATUS != "200" ]]; then
  echo "🚨 Edge Config down! Status: $STATUS"
  # Notify Slack/Discord/Email
fi
```

---

## 📞 Supporto

In caso di problemi:

1. **Consulta troubleshooting** in questa guida
2. **Testa con development mode** (`npm run edge-config:dev`)
3. **Verifica Vercel Dashboard** → Settings → Edge Config
4. **Check logs** di Next.js per errori Edge Config

**Remember**: Edge Config è progettato per la massima affidabilità. In caso di problemi, l'app usa automaticamente configurazioni di fallback garantendo zero downtime! 🛡️
