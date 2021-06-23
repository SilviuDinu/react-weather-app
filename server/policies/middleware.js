module.exports = middleware = {
  directives: {
    defaultSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "unpkg.com",
      "cdn.jsdelivr.net",
      "fonts.googleapis.com",
      "use.fontawesome.com",
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'",
      "cdnjs.cloudflare.com",
    ],
    fontSrc: [
      "'self'", // Default policy for specifiying valid sources for fonts loaded using "@font-face": allow all content coming from origin (without subdomains).
      "'unsafe-inline'",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],
    imgSrc: [
      "'self'", // Default policy for valid sources for stylesheets: allow all content coming from origin (without subdomains).
      "'unsafe-inline'",
      "'unsafe-eval'",
      "data: https:", "data: http:",
      "https://fonts.googleapis.com",
      "https://cdnjs.cloudflare.com",
    ],
  },
};
