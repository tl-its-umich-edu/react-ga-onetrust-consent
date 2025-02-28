import { useState } from "react";

// Types necessary for the U-M consent manager object
// See https://vpcomm.umich.edu/resources/cookie-disclosure/ under Banner Integration 
// Define base cookie type with required name field
interface BaseCookie {
    name: string;  // Required: The name of the cookie
}
// Extended cookie type with optional domain and regex
interface ExtendedCookie extends BaseCookie {
    domain?: string;  // Optional: The domain the cookie is set to
    regex?: string;   // Optional: Regular expression for auto-deletion matching
}
type UmConsentManager = {
    mode: 'prod' | 'dev',
    customManager: {
        enabled: boolean,
        alwaysShow: boolean,
        rootDomain: boolean | string,
        preferencePanel: {
            beforeCategories: boolean | string,
            afterCategories: boolean | string
        }
    },
    privacyUrl: string,
    onConsentChange: ({ cookie }: { cookie: string }) => void,
    cookies: {
        necessary: (BaseCookie | ExtendedCookie)[],
        analytics: (BaseCookie | ExtendedCookie)[]
    }
}
declare global {
    interface Window {
      umConsentManager: UmConsentManager
    }
};

// Utility function to append script to document head
const appendScript = (srcUrl: string, nonce?: string) => {
    const scriptElement = document.createElement('script');
    scriptElement.src = srcUrl;
    if (nonce) {
        scriptElement.nonce = nonce;
    }
    document.head.appendChild(scriptElement);
}

// Parameters needed for returned umConsentInitialize function
export type InitializeConsentManagerParams = {
    developmentMode?: boolean,
    alwaysShow?: boolean,
    privacyUrl?: string,
    onConsentApprove: () => void,
    onConsentReject: () => void,
}

type UmConsentHookReturn = {
    umConsentInitialized: boolean;
    umConsentInitialize: (params: InitializeConsentManagerParams) => void;
};

export function useUmConsent() : UmConsentHookReturn {
    const [consentInitState, setConsentInitState] = useState<boolean>(false)
    const umConsentSrcUrl = 'https://umich.edu/apis/umconsentmanager/consentmanager.js'

    const initializeConsentManager = ({
        developmentMode,  
        alwaysShow, 
        privacyUrl, 
        onConsentApprove, 
        onConsentReject
    } : InitializeConsentManagerParams) => {
        if (consentInitState) {
            return;
        }
        const onConsentChange = ({ cookie }: { cookie: any }) => {
            if (cookie.categories.includes('analytics') ) {
                onConsentApprove()
            } else {
                onConsentReject()
            }
        }
        window.umConsentManager = {
            mode: developmentMode ? 'dev' : 'prod',
            customManager: {
                enabled: true,
                alwaysShow: alwaysShow || false,
                rootDomain: true,
                preferencePanel: {
                    beforeCategories: true,
                    afterCategories: true
                }
            },
            privacyUrl: privacyUrl || '',
            onConsentChange,
            cookies: {
                necessary: [],
                analytics: []
            }
        }
        appendScript(umConsentSrcUrl)
        setConsentInitState(true)
    }

    return {
        umConsentInitialized: consentInitState,
        umConsentInitialize: initializeConsentManager
    };
}