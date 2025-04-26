export const environment = {
  production: true,
  api: {
    server: 'https://fynaloo-backend.onrender.com/',
    healthUrl: 'https://fynaloo-backend.onrender.com/api/health',
    nbpApi: "https://api.nbp.pl/api/exchangerates/rates/a/",
    mapKey: '',
    googleAuthClientId: '',
    webSocketUrl: '',
  },
  features: {
    demoMode: false,
    demoRestrictedMessage: 'This feature is restricted in demo mode.',
  },
};
