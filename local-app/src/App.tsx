
import { Route, Routes } from 'react-router-dom';

import { useGoogleAnalytics, useUmConsent, InitializeConsentManagerParams } from '@tl-its-umich-edu/react-ga-onetrust-consent'; 
import Page2 from './Page2';
import Homepage from './Homepage';


function App(): JSX.Element {
/*
  let window = global as any; // this is a hack to get around the fact that the window object is not defined in node
  require('react-dom');
  window.React2 = require('react');
  console.log(window.React1 === window.React2);
*/
  
  const { gaInitialized, gaHandlers } = useGoogleAnalytics({
    googleAnalyticsId: 'G-3F1K6Y7Q6Q', // your Google Analytics ID
    debug: false,
  });

  const { umConsentInitialize, umConsentInitialized } = useUmConsent();    
  if (!umConsentInitialized && gaInitialized && gaHandlers.onConsentApprove && gaHandlers.onConsentReject) {
      const consentParams: InitializeConsentManagerParams = {
          developmentMode: false,
          alwaysShow: true,
          onConsentApprove: gaHandlers.onConsentApprove,
          onConsentReject: gaHandlers.onConsentReject,
      }
      umConsentInitialize(consentParams);
  }
      
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/page2" element={<Page2 />} />
    </Routes>
  );
}

export default App;
