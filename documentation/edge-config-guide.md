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

---

## 📌 COMANDI - Riferimento Completo

### 🔧 Comandi di Configurazione Locale

#### Setup e Configurazione

```bash
# Inizializza configurazione locale per development
npm run local:config init

# Mostra la configurazione locale corrente
npm run local:config show

# Reset configurazione locale ai default
npm run local:config reset
```

#### Gestione Feature Flags Locali

```bash
# Abilita/disabilita ads in locale
npm run local:ads on
npm run local:ads off

# Toggle maintenance mode locale
npm run local:maintenance on
npm run local:maintenance off

# Abilita/disabilita features Pro in locale
npm run local:pro on
npm run local:pro off

# Abilita/disabilita beta features in locale
npm run local:beta on
npm run local:beta off
```

#### Test e Debug Locali

```bash
# Test configurazione ads locale
npm run local:ads test

# Verifica tutte le configurazioni locali
npm run local:config verify

# Export configurazione locale come JSON
npm run local:config export > my-local-config.json

# Import configurazione locale da JSON
npm run local:config import < my-local-config.json
```

### 🌐 Comandi Edge Config

#### Setup Iniziale

```bash
# Popola Edge Config con dati iniziali
npm run edge-config:populate

# Inizializza Edge Config vuoto
npm run edge-config:init

# Backup completo Edge Config
npm run edge-config:backup
```

#### Visualizzazione e Test

```bash
# Mostra configurazione Edge Config formattata
npm run edge-config:show

# Visualizza solo tool abilitati
npm run edge-config:show:enabled

# Visualizza solo tool featured
npm run edge-config:show:featured

# Test connessione Edge Config (raw JSON)
npm run edge-config:test

# Verifica salute Edge Config
npm run edge-config:health

# Confronta Edge Config con configurazione locale
npm run edge-config:diff
```

#### Gestione Tool

```bash
# Abilita/disabilita singolo tool
npm run edge-config:manage enable <tool-slug>
npm run edge-config:manage disable <tool-slug>

# Toggle tool (inverte stato corrente)
npm run edge-config:manage toggle <tool-slug>

# Aggiungi nuovo tool
npm run edge-config:manage add-tool '{"name":"Tool Name","slug":"tool-slug","description":"Description"}'

# Rimuovi tool
npm run edge-config:manage remove-tool <tool-slug>

# Aggiorna tool esistente
npm run edge-config:manage update-tool <tool-slug> '{"field":"new-value"}'

# Imposta tool come featured
npm run edge-config:manage feature <tool-slug>
npm run edge-config:manage unfeature <tool-slug>

# Riordina tool (cambia priorità)
npm run edge-config:manage reorder <tool-slug> <new-order-number>
```

#### Gestione Categorie

```bash
# Abilita/disabilita categoria
npm run edge-config:manage enable-cat <category-id>
npm run edge-config:manage disable-cat <category-id>

# Aggiungi nuova categoria
npm run edge-config:manage add-category '{"id":"new-cat","name":"New Category","description":"Description"}'

# Rimuovi categoria
npm run edge-config:manage remove-category <category-id>

# Aggiorna categoria
npm run edge-config:manage update-category <category-id> '{"field":"new-value"}'

# Lista tool in una categoria
npm run edge-config:manage list-category <category-id>

# Sposta tool in altra categoria
npm run edge-config:manage move-tool <tool-slug> <new-category-id>
```

#### Gestione Feature Flags

```bash
# Maintenance mode
npm run edge-config:manage maintenance on
npm run edge-config:manage maintenance off
npm run edge-config:manage maintenance status

# Controllo Ads
npm run edge-config:manage ads on
npm run edge-config:manage ads off
npm run edge-config:manage ads status

# Pro features
npm run edge-config:manage pro on
npm run edge-config:manage pro off
npm run edge-config:manage pro status

# Beta features
npm run edge-config:manage beta on
npm run edge-config:manage beta off
npm run edge-config:manage beta status

# Imposta tutti i flags contemporaneamente
npm run edge-config:manage flags '{"ads":true,"maintenance":false,"pro":true,"beta":false}'
```

#### Operazioni Batch

```bash
# Abilita tutti i tool
npm run edge-config:manage enable-all

# Disabilita tutti i tool
npm run edge-config:manage disable-all

# Abilita tutti i tool di una categoria
npm run edge-config:manage enable-category-tools <category-id>

# Disabilita tutti i tool di una categoria
npm run edge-config:manage disable-category-tools <category-id>

# Importa configurazione completa da file
npm run edge-config:manage import < config.json

# Esporta configurazione corrente
npm run edge-config:manage export > backup.json

# Reset ai default
npm run edge-config:manage reset
```

#### Comandi di Sviluppo

```bash
# Avvia server Edge Config locale per development
npm run edge-config:dev

# Simula Edge Config con dati mock
npm run edge-config:mock

# Genera TypeScript types da Edge Config
npm run edge-config:generate-types

# Valida schema Edge Config
npm run edge-config:validate

# Benchmark performance Edge Config
npm run edge-config:benchmark
```

#### Help e Documentazione

```bash
# Mostra help generale
npm run edge-config:manage help

# Help per comando specifico
npm run edge-config:manage help <command>

# Lista tutti i comandi disponibili
npm run edge-config:manage list-commands

# Genera documentazione markdown
npm run edge-config:manage docs
```

### 🎯 Comandi Combinati (Workflow)

```bash
# Workflow: Deploy nuovo tool
npm run workflow:new-tool

# Workflow: Emergenza (disabilita tutto)
npm run workflow:emergency

# Workflow: Ripristino da backup
npm run workflow:restore

# Workflow: A/B test setup
npm run workflow:ab-test

# Workflow: Migrazione da locale a Edge Config
npm run workflow:migrate
```

### 🔍 Comandi di Monitoraggio

```bash
# Monitor real-time Edge Config
npm run edge-config:monitor

# Check latenza Edge Config
npm run edge-config:latency

# Statistiche di utilizzo
npm run edge-config:stats

# Log delle modifiche
npm run edge-config:changelog
```

### 🚀 Alias Rapidi

```bash
# Alias brevi per comandi frequenti
npm run ec:show         # edge-config:show
npm run ec:enable       # edge-config:manage enable
npm run ec:disable      # edge-config:manage disable
npm run ec:test         # edge-config:test

npm run lc:show         # local:config show
npm run lc:ads-on       # local:ads on
npm run lc:ads-off      # local:ads off
```

### 📝 Note Importanti

1. **Precedenza delle configurazioni:**
   - Le configurazioni locali (`local:*`) hanno precedenza su Edge Config in development
   - In produzione, solo Edge Config è utilizzato

2. **Permessi richiesti:**
   - Comandi `edge-config:manage` richiedono `ADMIN_SECRET_KEY`
   - Comandi `edge-config:show` e `test` sono read-only

3. **Tempi di propagazione:**
   - Modifiche locali: Immediate
   - Modifiche Edge Config: ~10ms globalmente, cache TTL 30 secondi

4. **Best practices:**
   - Usa comandi locali per development/test
   - Usa Edge Config per produzione
   - Sempre fare backup prima di modifiche massive
   - Testa in locale prima di applicare a Edge Config
