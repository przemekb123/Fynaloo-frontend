export const environment = {
  production: false,
  api: {
    server: 'http://localhost:8080/',
    healthUrl: 'http://localhost:8080/api/health',
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
