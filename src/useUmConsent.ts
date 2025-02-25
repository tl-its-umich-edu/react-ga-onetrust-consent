
// Types for um consent manager object

import { useState } from "react";

// Define base cookie type with required name field
interface BaseCookie {
    name: string;  // Required: The name of the cookie
}
// Extended cookie type with optional domain and regex
interface ExtendedCookie extends BaseCookie {
    domain?: string;  // Optional: The domain the cookie is set to
    regex?: string;   // Optional: Regular expression for auto-deletion matching
}
export type UmConsentManager = {
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

export type InitializeConsentManagerParams = {
    developmentMode?: boolean,
    alwaysShow?: boolean,
    privacyUrl?: string,
    onConsentApprove: () => void,
    onConsentReject: () => void,
}

const appendScript = (src: string, nonce?: string) => {
    const script = document.createElement('script');
    script.src = src;
    if (nonce) {
        script.nonce = nonce;
    }
    document.head.appendChild(script);
}

type UmConsentHookReturn = {
    umConsentInitialized: boolean;
    umConsentInitialize: (params: InitializeConsentManagerParams) => void;
};

export function useUmConsent() : UmConsentHookReturn {
    const [consentInitState, setConsentInitState] = useState<boolean>(false)
    console.log("useUmConsent initialized", consentInitState)

    const initializeConsentManager = ({
        developmentMode,  
        alwaysShow, 
        privacyUrl, 
        onConsentApprove, 
        onConsentReject
    } : InitializeConsentManagerParams) => {
        console.log("useUmConsent initializeConsentManager run");
        if (consentInitState) {
            console.log("useUmConsent initializeConsentManager already initialized");
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
        const src = 'https://umich.edu/apis/umconsentmanager/consentmanager.js'
        appendScript(src)
        console.log("useUmConsent initializeConsentManager complete (initialized).");
        setConsentInitState(true)
    }

    return {
        umConsentInitialized: consentInitState,
        umConsentInitialize: initializeConsentManager
    };
}