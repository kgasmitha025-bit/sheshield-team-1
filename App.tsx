import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileSearch,
  MessageSquareWarning,
  FolderLock,
  PhoneCall,
  HeartHandshake,
  ExternalLink,
  Lock,
  Scale,
  Sparkles,
} from 'lucide-react';
import { Header } from './components/Header';
import { BreathingWidget } from './components/BreathingWidget';
import { DeepfakeScanner } from './components/DeepfakeScanner';
import { MessageScanner } from './components/MessageScanner';
import { EvidenceVault } from './components/EvidenceVault';
import { HelplineGuide } from './components/HelplineGuide';
import { EvidenceItem, Language } from './types';
import { supabase } from './lib/supabase';
import { AuthPanel } from './components/AuthPanel';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'deepfake' | 'messages' | 'vault' | 'helpline'>('deepfake');
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => {
    try {
      const saved = localStorage.getItem('sheshield_evidence');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sheshield_evidence', JSON.stringify(evidence));
    } catch (e) {
      console.warn('Failed to save evidence to localStorage:', e);
    }
  }, [evidence]);

  const handleAddToVault = (item: Omit<EvidenceItem, 'id' | 'timestamp'>) => {
    const newItem: EvidenceItem = {
      ...item,
      id: 'EV-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
    };
    setEvidence((prev) => [newItem, ...prev]);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllEvidence = () => {
    if (window.confirm(lang === 'ta' ? 'à®…à®©à¯ˆà®¤à¯à®¤à¯ à®†à®¤à®¾à®°à®™à¯à®•à®³à¯ˆà®¯à¯à®®à¯ à®¨à¯€à®•à¯à®•à®µà®¾?' : 'Clear all saved evidence from vault?')) {
      setEvidence([]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Instant Panic / Quick Exit to neutral page
  const handlePanicExit = () => {
    window.location.replace('https://www.google.com/search?q=today+weather+forecast');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onOpenPanicExit={handlePanicExit}
        onToggleBreathing={() => setIsBreathingActive((prev) => !prev)}
        isBreathingActive={isBreathingActive}
        session={session}
        onOpenAuth={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      {!session && !showAuth && (<button onClick={() => setShowAuth(true)} className="fixed top-4 right-4 z-[9999] bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-purple-700">Sign In</button>)}

      {showAuth && !session && (
        <AuthPanel onClose={() => setShowAuth(false)} />
      )}

      {/* Calming Breathing Assistant Banner */}
      {isBreathingActive && (
        <BreathingWidget
          lang={lang}
          onClose={() => setIsBreathingActive(false)}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Navigation Tabs (Desktop & Mobile) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-200/70 backdrop-blur-xs rounded-2xl max-w-2xl mx-auto border border-slate-300/40">
          <button
            onClick={() => setActiveTab('deepfake')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'deepfake'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>{lang === 'ta' ? 'à®Ÿà¯€à®ªà¯à®ƒà®ªà¯‡à®•à¯ à®†à®¯à¯à®µà¯' : 'Deepfake Forensics'}</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'messages'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>{lang === 'ta' ? 'à®…à®šà¯à®šà¯à®±à¯à®¤à¯à®¤à®²à¯ à®†à®¯à¯à®µà¯' : 'Threat Scanner'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shrink-0 relative ${
              activeTab === 'vault'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>{lang === 'ta' ? 'à®†à®¤à®¾à®° à®ªà¯†à®Ÿà¯à®Ÿà®•à®®à¯' : 'FIR Vault'}</span>
            {evidence.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {evidence.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('helpline')}
            className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'helpline'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{lang === 'ta' ? 'à®‰à®¤à®µà®¿ à®Žà®£à¯à®•à®³à¯ & à®šà®Ÿà¯à®Ÿà®®à¯' : 'Helpline & Law'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'deepfake' && (
          <DeepfakeScanner
            lang={lang}
            onAddToVault={handleAddToVault}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'messages' && (
          <MessageScanner
            lang={lang}
            onAddToVault={handleAddToVault}
            onNavigateToVault={() => setActiveTab('vault')}
          />
        )}

        {activeTab === 'vault' && (
          <EvidenceVault
            evidence={evidence}
            onRemoveEvidence={handleRemoveEvidence}
            onClearAll={handleClearAllEvidence}
            lang={lang}
            onNavigateToScan={() => setActiveTab('deepfake')}
          />
        )}

        {activeTab === 'helpline' && <HelplineGuide lang={lang} />}
      </main>

      {/* Calming & Trust Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/70 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-slate-800">SheShield</span>
              <span>â€¢</span>
              <span className="text-purple-600 font-semibold">
                Team ZeAI_MIH_093 | #MadeInIndia Hackathon 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'ta'
                ? 'à®¤à®©à®¿à®®à®©à®¿à®¤ à®¤à®©à®¿à®¯à¯à®°à®¿à®®à¯ˆ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà¯: à®‰à®™à¯à®•à®³à¯ à®ªà®Ÿà®™à¯à®•à®³à¯ à®šà®°à¯à®µà®°à®¿à®²à¯ à®šà¯‡à®®à®¿à®•à¯à®•à®ªà¯à®ªà®Ÿà®¾à®¤à¯. à®‰à®Ÿà®©à®Ÿà®¿ à®¤à®Ÿà¯ˆà®¯à®µà®¿à®¯à®²à¯ à®†à®¯à¯à®µà¯ à®®à®Ÿà¯à®Ÿà¯à®®à¯‡.'
                : 'Zero-Trace Privacy: Images processed in-memory for instant forensic review. No persistent media storage.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>â€¢</span>
            <a href="tel:1930" className="text-rose-600 hover:text-rose-800 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>National Helpline: 1930</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
