import React from 'react';
import { Search } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { EditorPage } from './pages/EditorPage';
import { RecipientsPage } from './pages/RecipientsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { CardViewerPage } from './pages/CardViewerPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { BlogPage } from './pages/BlogPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

/** Pages that don't show the Navbar/Footer (full-bleed card viewer) */
const BARE_ROUTES = ['/card/'];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBare = BARE_ROUTES.some(r => window.location.pathname.startsWith(r));
  if (isBare) return <>{children}</>;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/editor/:slug" element={<EditorPage />} />
        <Route path="/checkout/recipients" element={<RecipientsPage />} />
        <Route path="/checkout/payment" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/card/:token" element={<CardViewerPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Catch-all */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4 pt-24">
            <div className="w-14 h-14 rounded-2xl bg-vellum-base border border-ink-espresso/15 flex items-center justify-center mx-auto">
              <Search size={28} className="text-ink-espresso/60" />
            </div>
            <h1 className="text-2xl font-serif text-ink-espresso">Page not found</h1>
            <a href="/" className="text-pop-violet text-sm font-semibold hover:text-pop-rose">Go home</a>
          </div>
        } />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
