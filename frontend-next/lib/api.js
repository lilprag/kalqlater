function backendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');
}

export function contactEndpoint() {
  const baseUrl = backendBaseUrl();
  return `${baseUrl}/api/contact`;
}
