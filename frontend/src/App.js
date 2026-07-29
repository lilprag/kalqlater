import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Test from './pages/Test';
import Result from './pages/Result';
import Types from './pages/Types';
import TypeDetail from './pages/TypeDetail';
import About from './pages/About';
import Privacy from './pages/Privacy';

function App() {
    return (
        <LangProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-brand-bg text-brand-ink">
                    <Header />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/test" element={<Test />} />
                            <Route path="/result/:id" element={<Result />} />
                            <Route path="/types" element={<Types />} />
                            <Route path="/types/:code" element={<TypeDetail />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/privacy" element={<Privacy />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </LangProvider>
    );
}

export default App;
