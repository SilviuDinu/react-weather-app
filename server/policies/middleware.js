module.exports = middleware = {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'use.fontawesome.com'],
    scriptSrc: ["'self'", "'unsafe-eval'", 'cdnjs.cloudflare.com'],
    fontSrc: [
      "'self'", // Default policy for specifiying valid sources for fonts loaded using "@font-face": allow all content coming from origin (without subdomains).
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
    ],
    styleSrc: [
      "'self'", // Default policy for valid sources for stylesheets: allow all content coming from origin (without subdomains).
      'https://fonts.googleapis.com',
      'https://cdnjs.cloudflare.com',
    ],
  },
};
