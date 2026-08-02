export function BrandMark({ className = '' }) {
  return <span aria-hidden="true" className={`brand-mark ${className}`}>
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 16h5m6 0h5M16 8v5m0 6v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m11.4 11.4 3.1 3.1m3 3 3.1 3.1m0-9.2-3.1 3.1m-3 3-3.1 3.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  </span>;
}
