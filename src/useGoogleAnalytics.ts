import { useState, useEffect } from 'react';
import GoogleAnalytics from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { useOneTrust } from './useOneTrust';

export enum GoogleAnalyticsConsentValue {
    Denied = "denied",
    Granted = "granted"
}

interface UseGoogleAnalyticsParams {
    googleAnalyticsId?: string;
    debug?: boolean;
    nonce?: string;
    oneTrustScriptDomain?: string;
}

export const useGoogleAnalytics = ({
    googleAnalyticsId,
    debug,
    nonce,
    oneTrustScriptDomain
}: UseGoogleAnalyticsParams) => {
    const location = useLocation();
    const [initializeOneTrust] = useOneTrust({ oneTrustScriptDomain, nonce });

    const [initialized, setInitialized] = useState(false);
    const [previousPage, setPreviousPage] = useState<any>(null);

    if (googleAnalyticsId && !initialized) {
        GoogleAnalytics.gtag("consent", "default", {
            ad_storage: GoogleAnalyticsConsentValue.Denied,
            analytics_storage: GoogleAnalyticsConsentValue.Denied,
            functionality_storage: GoogleAnalyticsConsentValue.Denied,
            personalization_storage: GoogleAnalyticsConsentValue.Denied,
            ad_user_data: GoogleAnalyticsConsentValue.Denied,
            ad_personalization: GoogleAnalyticsConsentValue.Denied,
            wait_for_update: 500
        });
        GoogleAnalytics.initialize([{
            trackingId: googleAnalyticsId,
            gaOptions: {
                cookieFlags: 'SameSite=None; Secure',
                testMode: debug ? true : false,
                ...(nonce && { nonce: nonce }) 
            }
        }]);
        if (initializeOneTrust) {
            initializeOneTrust(GoogleAnalytics);
        }
        setInitialized(true);
    }

    useEffect(() => {
        const page = location.pathname + location.search + location.hash;
        if (googleAnalyticsId && page !== previousPage) {
            setPreviousPage(page);
            GoogleAnalytics.send({ hitType: "pageview", page });
        }
    }, [location, previousPage, googleAnalyticsId]);
};
