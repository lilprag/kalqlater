import React from 'react';

// Decorative organic blobs used on page backgrounds.
export default function Blobs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="blob animate-float-slow" style={{ background: '#E87A5D', top: '-8rem', left: '-6rem', width: '28rem', height: '28rem' }} />
            <div className="blob animate-float" style={{ background: '#1F6C7D', top: '10rem', right: '-8rem', width: '22rem', height: '22rem' }} />
            <div className="blob animate-float-slow" style={{ background: '#DAB49D', bottom: '-8rem', left: '20%', width: '20rem', height: '20rem', opacity: 0.5 }} />
        </div>
    );
}
