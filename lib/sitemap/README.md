# ToolsLab Multilingual Sitemap System

Sistema completo di sitemap multilingua per ToolsLab che segue le best practice Google per siti internazionali.

## 📋 Struttura

```
/sitemap-index.xml        → Master sitemap index
/sitemap-en.xml          → English sitemap (all pages)
/sitemap-it.xml          → Italian sitemap (all pages)
```

## ✨ Caratteristiche

- ✅ **Sitemap Index Master** - Indice che punta a tutti i sitemap delle lingue
- ✅ **Sitemap per Lingua** - Un sitemap separato per ogni locale (en, it)
- ✅ **Annotazioni Hreflang** - Ogni URL include hreflang per tutte le lingue
- ✅ **X-Default** - Punta sempre alla versione inglese
- ✅ **Generazione Dinamica** - Basato sui tool e lingue configurate
- ✅ **Validazione** - Script di validazione automatica
- ✅ **Caching** - Revalidazione ogni 24 ore

## 🌍 Copertura

### Pagine Incluse per Locale

- **Homepage** (`/`)
- **Tools Page** (`/tools`)
- **About Page** (`/about`)
- **Lab Page** (`/lab`)
- **Tool Pages** (`/tools/{tool-id}`) - 27 tools
- **Category Pages** (`/category/{category-id}`) - 8 categorie

**Totale:** 39 pagine per lingua × 2 lingue = **78 URL totali**

## 🔗 Formato URL

### Inglese (default - nessun prefisso)

```
https://toolslab.dev/
https://toolslab.dev/tools
https://toolslab.dev/tools/json-formatter
```

### Italiano (prefisso /it)

```
https://toolslab.dev/it/
https://toolslab.dev/it/tools
https://toolslab.dev/it/tools/json-formatter
```

## 🏷️ Annotazioni Hreflang

Ogni URL nel sitemap include riferimenti a:

```xml
<url>
  <loc>https://toolslab.dev/tools/json-formatter</loc>
  <lastmod>2025-01-04T...</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://toolslab.dev/tools/json-formatter"/>
  <xhtml:link rel="alternate" hreflang="it" href="https://toolslab.dev/it/tools/json-formatter"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://toolslab.dev/tools/json-formatter"/>
</url>
```

## 🛠️ Utilizzo

### Validazione Sitemap

```bash
npm run sitemap:validate
```

Questo comando:

- Mostra statistiche dei sitemap
- Valida completezza delle traduzioni
- Verifica hreflang bidirezionali
- Controlla formato XML
- Mostra URL di esempio

### Testing Locale

```bash
# Avvia il server dev
npm run dev

# In un altro terminale, testa gli endpoint
curl http://localhost:3000/sitemap-index.xml
curl http://localhost:3000/sitemap-en.xml
curl http://localhost:3000/sitemap-it.xml
```

### Verifica in Produzione

```bash
curl https://toolslab.dev/sitemap-index.xml
curl https://toolslab.dev/sitemap-en.xml
curl https://toolslab.dev/sitemap-it.xml
```

## 📊 Priorità e Frequenza

| Tipo Pagina | Priority | Change Frequency |
| ----------- | -------- | ---------------- |
| Homepage    | 1.0      | daily            |
| Tools Page  | 0.9      | daily            |
| Tool Detail | 0.9      | weekly           |
| Lab Page    | 0.8      | weekly           |
| About Page  | 0.7      | monthly          |
| Categories  | 0.7      | weekly           |

## 🔄 Aggiornamento

I sitemap vengono rigenerati automaticamente:

- **Revalidazione:** Ogni 24 ore
- **Trigger:** Build di produzione
- **Caching:** Headers HTTP con max-age=86400

## 📦 Aggiungere Nuove Pagine

Per aggiungere nuove pagine al sitemap:

1. **Pagine Statiche:** Aggiorna `getStaticPages()` in `sitemap-utils.ts`
2. **Tool Pages:** I tool vengono automaticamente inclusi da `/lib/tools.ts`
3. **Categorie:** Le categorie vengono estratte automaticamente dai tool

## 🌐 Aggiungere Nuove Lingue

Per aggiungere una nuova lingua (es. Francese):

1. Aggiungi `fr` a `/lib/i18n/config.ts`:

   ```typescript
   export const locales = ['en', 'it', 'fr'] as const;
   ```

2. Crea `/lib/i18n/dictionaries/fr/*.json`

3. Il sistema genera automaticamente:
   - `/sitemap-fr.xml`
   - Aggiorna hreflang in tutti i sitemap
   - Aggiorna sitemap-index.xml

**Nessuna modifica al codice sitemap richiesta!**

## 📤 Submission a Google

1. **Google Search Console:**
   - Vai a Sitemaps
   - Submit: `https://toolslab.dev/sitemap-index.xml`
   - Google scoprirà automaticamente tutti i sitemap delle lingue

2. **Verifica Indexing:**
   - Controlla Coverage report
   - Verifica International Targeting
   - Monitora hreflang errors

## 🧪 Testing e Validazione

### Checklist Pre-Deploy

- [ ] `npm run sitemap:validate` passa senza errori
- [ ] Tutti i sitemap sono accessibili
- [ ] XML è well-formed
- [ ] URL sono assoluti
- [ ] Hreflang è bidirezionale
- [ ] X-default punta a inglese
- [ ] robots.txt punta a sitemap-index.xml

### Validatori Online

- [Google Search Console - Sitemap Report](https://search.google.com/search-console)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## 📁 File Structure

```
lib/sitemap/
├── README.md              # Questa documentazione
└── sitemap-utils.ts       # Utility per generazione sitemap

app/
├── sitemap-index.xml/
│   └── route.ts          # Route handler sitemap index
└── sitemap-[locale].xml/
    └── route.ts          # Route handler sitemap per lingua

scripts/
└── validate-sitemap.ts   # Script validazione

public/
└── robots.txt            # Configurazione robots con sitemap
```

## 🔍 Troubleshooting

### Sitemap non si aggiorna

```bash
# Forza rebuild
npm run build

# In development, potrebbe essere cachato
# Riavvia il server dev
```

### Errori di validazione

```bash
# Esegui validazione dettagliata
npm run sitemap:validate

# Controlla log per dettagli
```

### Hreflang errors in GSC

- Verifica che tutti gli URL siano accessibili
- Controlla che le pagine esistano in tutte le lingue
- Usa lo script di validazione per trovare inconsistenze

## 📚 Risorse

- [Google Sitemaps Protocol](https://www.sitemaps.org/protocol.html)
- [Google Hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Next.js Sitemap Generation](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)

## 🎯 Metriche

**Current Stats:**

- 2 locali (en, it)
- 39 pagine per locale
- 78 URL totali
- 117 annotazioni hreflang per sitemap
- ~37 KB totali

**Scalabilità:**

- Supporta migliaia di URL
- Performance ottimizzata con caching
- Generazione dinamica efficiente

---

**Ultimo aggiornamento:** Gennaio 2025
**Versione:** 1.0.0
