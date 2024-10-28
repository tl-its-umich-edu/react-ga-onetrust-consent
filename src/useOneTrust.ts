import { GA4 } from 'react-ga4/types/ga4';
import Cookies from "js-cookie";
import { GoogleAnalyticsConsentValue } from './useGoogleAnalytics';

declare global {
    interface Window {
      OnetrustActiveGroups?: string;
      OptanonWrapper?: () => void;
    }
  };

// Cookies defined according to the UofM OneTrust cookies disclosure: https://vpcomm.umich.edu/resources/cookie-disclosure/
// For more info on cookie management, see OneTrust's documentation: https://my.onetrust.com/s/article/UUID-2dc719a8-4be5-8d16-1dc8-c7b4147b88e0?language=en_US 
const OneTrustCookieCategory = {
    StrictlyNecessary: "C0001",
    Performance: "C0002",
    Functionality: "C0003",
    Targeting: "C0004",
    SocialMedia: "C0005",
};
  
interface UseOneTrustParams {
    oneTrustScriptDomain?: string;
    nonce?: string | undefined;
  };

export const useOneTrust = ({ oneTrustScriptDomain, nonce }: UseOneTrustParams): [(googleAnalytics:GA4) => void] | [] => 
  {
    // Loads the script for OneTrust consent banner implementation, & handles Google Analytics event tracking
    // Instructions for UofM implementation: https://vpcomm.umich.edu/resources/cookie-disclosure/#3rd-party-google-analytics
    const initializeOneTrust = (googleAnalytics: GA4) => {
        // Callback to update Google Analytics consent tags and remove cookies based on OneTrust active groups
        // OneTrust documentation: https://developer.onetrust.com/onetrust/docs/using-google-consent-mode
        const updateGtagCallback = () => {
          if (!window.OnetrustActiveGroups) {
              return;
          }
          // "Strictly Necessary Cookies" are always granted. C0001 (StrictlyNecessary), C0003 (Functionality)
          if (window.OnetrustActiveGroups.includes(OneTrustCookieCategory.Performance)) {
            googleAnalytics.gtag("consent", "update", { analytics_storage: GoogleAnalyticsConsentValue.Granted });
          }
          if (window.OnetrustActiveGroups.includes(OneTrustCookieCategory.Functionality)) {
            googleAnalytics.gtag("consent", "update", { functional_storage: GoogleAnalyticsConsentValue.Granted });
          }
          // "Analytics & Advertising Cookies" are optional for EU users. C0002 (Performance)
          if (window.OnetrustActiveGroups.includes(OneTrustCookieCategory.Targeting)) {
            googleAnalytics.gtag("consent", "update", {
              ad_storage: GoogleAnalyticsConsentValue.Granted,
              ad_user_data: GoogleAnalyticsConsentValue.Granted,
              ad_personalization: GoogleAnalyticsConsentValue.Granted,
              personalization_storage: GoogleAnalyticsConsentValue.Granted
            });
          } else {
            // Remove Google Analytics cookies if tracking is declined by EU users
            // Uses same library as this GA4 implementation: https://dev.to/ramonak/react-enable-google-analytics-after-a-user-grants-consent-5bg3
            Cookies.remove("_ga");
            Cookies.remove("_gat");
            Cookies.remove("_gid");
          }
          googleAnalytics.event({ action: 'um_consent_updated', category: 'consent' });
          }
        window.OptanonWrapper = updateGtagCallback;

        const src =`https://cdn.cookielaw.org/consent/${oneTrustScriptDomain}/otSDKStub.js`
        
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.dataset.domainScript = oneTrustScriptDomain;
        if (nonce) {
            script.nonce = nonce;
        }
        document.head.appendChild(script);
    }

    return [ initializeOneTrust ];
};

