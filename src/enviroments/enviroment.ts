export const environment = {
  production: true,
  api: {
    //server: 'http://localhost:8080/',
    server: 'https://fynaloo-backend.onrender.com/',
    healthUrl: 'https://fynaloo-backend.onrender.com/api/health',


    //Additional features
    mapKey: '',
    googleAuthClientId: '',
    webSocketUrl: '',
  },


  features: {
    demoMode: false,
    demoRestrictedMessage: 'This feature is restricted in demo mode.',
  },
};

