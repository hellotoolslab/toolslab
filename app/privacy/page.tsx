import { Metadata } from 'next';
import { Shield, Heart, Lock, Monitor, Globe, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - ToolsLab | Your Data Stays Yours',
  description:
    'ToolsLab respects your privacy. No tracking, no accounts, no data collection. All processing happens locally in your browser.',
  keywords: [
    'privacy policy',
    'data protection',
    'no tracking',
    'developer tools',
    'privacy first',
  ],
  openGraph: {
    title: 'Privacy Policy - ToolsLab',
    description:
      'Your privacy is sacred. We don&apos;t track, profile, or even know who you are.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                Your data stays yours. Always.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="mb-3 flex items-center gap-3">
              <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                TL;DR - The Simple Truth
              </h2>
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              <strong>La tua privacy è sacra.</strong> Non ti tracciamo, non ti
              profiliamo, non sappiamo nemmeno chi sei. ToolsLab è come un tool
              desktop che gira nel tuo browser - tutto rimane sul tuo
              dispositivo.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
            {/* Last Updated */}
            <div className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Ultimo aggiornamento:</strong>{' '}
                {new Date().toLocaleDateString('it-IT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Zero Data Collection */}
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Zero Raccolta Dati Personali
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>
                    Non raccogliamo, non memorizziamo, non processiamo nessun
                    dato personale.
                  </strong>
                  Questo include:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>❌ Nessuna email o informazione di contatto</li>
                  <li>
                    ❌ Nessun nome, indirizzo o informazione identificativa
                  </li>
                  <li>❌ Nessun account, registrazione o profilo utente</li>
                  <li>
                    ❌ Nessun cookie di tracking o identificativi persistenti
                  </li>
                  <li>
                    ❌ Nessun dato sensibile come IP dettagliati o
                    fingerprinting
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <p className="text-green-800 dark:text-green-200">
                    <strong>💡 In parole semplici:</strong> Non sappiamo chi
                    sei, da dove vieni, o cosa fai sui nostri tool. E ci piace
                    così.
                  </p>
                </div>
              </div>
            </section>

            {/* Local Processing */}
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tutto Avviene nel Tuo Browser
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Tutti i nostri developer tool funzionano completamente{' '}
                  <strong>client-side</strong>:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>✅ Il JSON che formatti non lascia mai il tuo browser</li>
                  <li>✅ Il Base64 che converti viene processato localmente</li>
                  <li>
                    ✅ Gli UUID che generi sono creati sul tuo dispositivo
                  </li>
                  <li>✅ Nessun dato viene inviato ai nostri server</li>
                  <li>
                    ✅ Funziona anche offline (una volta caricata la pagina)
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                  <p className="text-purple-800 dark:text-purple-200">
                    <strong>🔧 Analogia:</strong> È come usare un tool desktop,
                    ma nel browser. Noi forniamo solo il &ldquo;software&rdquo;,
                    i tuoi dati non ci raggiungono mai.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Domande sulla Privacy?
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Se hai dubbi o domande su questa Privacy Policy, puoi
                contattarci:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  📧 Email:{' '}
                  <a
                    href="mailto:privacy@toolslab.dev"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    privacy@toolslab.dev
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  🐙 GitHub:{' '}
                  <a
                    href="https://github.com/toolslab/issues"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apri una issue
                  </a>
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Risponderemo il prima possibile, ma ricorda: se non raccogliamo
                dati su di te, probabilmente la risposta è &ldquo;non abbiamo
                nessun dato su di te!&rdquo; 😊
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
