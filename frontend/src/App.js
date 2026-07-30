import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import Header from './components/Header';
import Footer from './components/Footer';
const Landing = lazy(() => import('./pages/Landing'));
const Test = lazy(() => import('./pages/Test'));
const Result = lazy(() => import('./pages/Result'));
const Types = lazy(() => import('./pages/Types'));
const TypeDetail = lazy(() => import('./pages/TypeDetail'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const PremiumReport = lazy(() => import('./pages/PremiumReport'));
const Compare = lazy(() => import('./pages/Compare'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
    return (
        <LangProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-brand-bg text-brand-ink">
                    <Header />
                    <main id="main-content" className="flex-1" tabIndex="-1">
                        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-32 text-center text-brand-subtle">Loading…</div>}>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/test" element={<Test />} />
                            <Route path="/result/:id" element={<Result />} />
                            <Route path="/types" element={<Types />} />
                            <Route path="/types/:code" element={<TypeDetail />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/report/:id" element={<PremiumReport />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </LangProvider>
    );
}

export default App;
