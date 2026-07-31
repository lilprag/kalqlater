import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteMeta from './components/RouteMeta';
import Analytics from './components/Analytics';
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
const Community = lazy(() => import('./pages/community/Community'));
const ProfileSetup = lazy(() => import('./pages/community/ProfileSetup'));
const MemberProfile = lazy(() => import('./pages/community/MemberProfile'));
const Connections = lazy(() => import('./pages/community/Connections'));
const Auth = lazy(() => import('./pages/Auth'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
    return (
        <LangProvider>
            <AuthProvider>
            <BrowserRouter>
                <RouteMeta />
                <Analytics />
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
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/report/:id" element={<PremiumReport />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/compare/:pair" element={<Compare />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/community" element={<Community />} />
                            <Route path="/community/profile" element={<ProfileSetup />} />
                            <Route path="/community/member/:username" element={<MemberProfile />} />
                            <Route path="/community/connections" element={<Connections />} />
                            <Route path="/login" element={<Auth mode="login" />} /><Route path="/signup" element={<Auth mode="signup" />} /><Route path="/forgot-password" element={<Auth mode="forgot" />} /><Route path="/reset-password" element={<Auth mode="reset" />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
            </AuthProvider>
        </LangProvider>
    );
}

export default App;
