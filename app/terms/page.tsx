import { Metadata } from 'next';
import {
  FileText,
  Heart,
  Shield,
  Zap,
  Coffee,
  Github,
  AlertTriangle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - ToolsLab | Free Developer Tools',
  description:
    'Terms of service for ToolsLab - 100% free developer tools with no registration required. Simple, fair terms for our community.',
  keywords: [
    'terms of service',
    'developer tools',
    'free tools',
    'conditions',
    'toolslab',
  ],
  openGraph: {
    title: 'Terms of Service - ToolsLab',
    description:
      'Simple and fair terms for using ToolsLab&apos;s free developer tools.',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                Simple rules for our free developer tools
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
            <div className="mb-3 flex items-center gap-3">
              <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                TL;DR - The Essentials
              </h2>
            </div>
            <p className="text-indigo-800 dark:text-indigo-200">
              <strong>ToolsLab è gratuito, per sempre.</strong> Usa i nostri
              tool responsabilmente, non fare cose illegali, e ricorda che non
              offriamo garanzie. Siamo developer che aiutano altri developer.
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

            {/* Free Service */}
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Servizio 100% Gratuito
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>
                    ToolsLab è e rimarrà sempre completamente gratuito:
                  </strong>
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    ✅ <strong>Nessun costo:</strong> Tutti i tool sono
                    gratuiti, per sempre
                  </li>
                  <li>
                    ✅ <strong>Nessun account richiesto:</strong> Mai, per
                    nessun motivo
                  </li>
                  <li>
                    ✅ <strong>Nessun freemium:</strong> Non esistono versioni
                    &ldquo;Pro&rdquo; o premium
                  </li>
                  <li>
                    ✅ <strong>Nessun limite artificiale:</strong> Usa i tool
                    quanto vuoi
                  </li>
                  <li>
                    ✅ <strong>Open source:</strong> Il codice è disponibile su
                    GitHub
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-red-800 dark:text-red-200">
                    <strong>💝 La nostra promessa:</strong> ToolsLab nasce dalla
                    passione di developer per developer. Non diventerà mai a
                    pagamento.
                  </p>
                </div>
              </div>
            </section>

            {/* No Warranties */}
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Limitazione di Garanzie
                </h2>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-900/20">
                  <p className="mb-4 font-semibold text-orange-800 dark:text-orange-200">
                    ⚠️ DISCLAIMER IMPORTANTE
                  </p>
                  <p className="text-orange-700 dark:text-orange-300">
                    I tool di ToolsLab sono forniti{' '}
                    <strong>&ldquo;AS IS&rdquo; (così come sono)</strong>, senza
                    garanzie di alcun tipo.
                  </p>
                </div>
                <p>Questo significa:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    🔧 <strong>Funzionamento:</strong> Non garantiamo che i tool
                    siano sempre perfetti
                  </li>
                  <li>
                    📊 <strong>Accuratezza:</strong> Verifica sempre i
                    risultati, specialmente per usi critici
                  </li>
                  <li>
                    🐛 <strong>Bug:</strong> Potrebbero esserci errori o
                    comportamenti imprevisti
                  </li>
                  <li>
                    💾 <strong>Perdita dati:</strong> I dati processati
                    potrebbero andare persi
                  </li>
                  <li>
                    🔒 <strong>Sicurezza:</strong> Non inserire dati sensibili
                    (anche se restano locali)
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Domande sui Termini?
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Se hai dubbi o domande su questi termini di servizio:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  📧 Email:{' '}
                  <a
                    href="mailto:legal@toolslab.dev"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    legal@toolslab.dev
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
                <p className="text-gray-700 dark:text-gray-300">
                  💬 Community:{' '}
                  <a
                    href="https://github.com/toolslab/discussions"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Discussions
                  </a>
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Siamo developer come te, parliamo la stessa lingua! 🤓
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
