import { useState, useEffect } from 'react';
import GoogleAnalytics from 'react-ga4';
import Cookies from "js-cookie";
import { useLocation } from 'react-router-dom';

export enum GoogleAnalyticsConsentValue {
    Denied = "denied",
    Granted = "granted"
};

export type UseGoogleAnalyticsParams = {
    googleAnalyticsId?: string;
    debug?: boolean;
    nonce?: string;
};

type ConsentHandlers = {
    approve: (() => void) | undefined;
    reject: (() => void) | undefined;
};

type GoogleAnalyticsHookReturn = {
    gaInitialized: boolean;
    gaHandlers: {
        onConsentApprove: (() => void) | undefined;
        onConsentReject: (() => void) | undefined;
    }
};

export function useGoogleAnalytics({
    googleAnalyticsId,
    debug,
    nonce,
}: UseGoogleAnalyticsParams): GoogleAnalyticsHookReturn {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);
    const [previousPage, setPreviousPage] = useState<string>('');
    const [consentHandlers, setConsentHandlers] = useState<ConsentHandlers>({
        approve: undefined,
        reject: undefined
    });
    useEffect(() => {
        if (googleAnalyticsId && !initialized) {
            GoogleAnalytics.gtag("consent", "default", {
                ad_storage: GoogleAnalyticsConsentValue.Denied,
                analytics_storage: GoogleAnalyticsConsentValue.Denied,
                functional_storage: GoogleAnalyticsConsentValue.Denied,
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

            setConsentHandlers({
                approve: () => {
                    GoogleAnalytics.gtag("consent", "update", {
                        analytics_storage: GoogleAnalyticsConsentValue.Granted,
                        functional_storage: GoogleAnalyticsConsentValue.Granted,
                        ad_storage: GoogleAnalyticsConsentValue.Granted,
                        ad_user_data: GoogleAnalyticsConsentValue.Granted,
                        ad_personalization: GoogleAnalyticsConsentValue.Granted,
                        personalization_storage: GoogleAnalyticsConsentValue.Granted
                    });
                    GoogleAnalytics.event({ action: 'um_consent_updated', category: 'consent' });
                },
                reject: () => {
                    GoogleAnalytics.gtag("consent", "update", { 
                        analytics_storage: GoogleAnalyticsConsentValue.Granted,
                        functional_storage: GoogleAnalyticsConsentValue.Granted 
                    });
                    Cookies.remove("_ga");
                    Cookies.remove("_gat");
                    Cookies.remove("_gid");
                    GoogleAnalytics.event({ action: 'um_consent_updated', category: 'consent' });
                }
            });
            setInitialized(true);
        }
    }, [googleAnalyticsId, initialized, debug, nonce]);

    useEffect(() => {
        const page = location.pathname + location.search + location.hash;
        if (googleAnalyticsId && page !== previousPage) {
            setPreviousPage(page);
            GoogleAnalytics.send({ hitType: "pageview", page });
        }
    }, [location, previousPage, googleAnalyticsId]);

    return {
        gaInitialized: initialized,
        gaHandlers: {
            onConsentApprove: consentHandlers.approve,
            onConsentReject: consentHandlers.reject
        }
    };
}
