import { renderHook } from '@testing-library/react';
import { useOneTrust } from './useOneTrust';
import Cookies from 'js-cookie';
import { GoogleAnalyticsConsentValue } from './useGoogleAnalytics';

// Mocking js-cookie
jest.mock('js-cookie', () => ({
    remove: jest.fn()
}));

const mockGtag = jest.fn();
const mockEvent = jest.fn();
const mockGoogleAnalytics = {
    gtag: mockGtag,
    event: mockEvent
};

describe('useOneTrust', () => {
    let mockScript;
    let originalCreateElement;

    beforeEach(() => {
        // Clear previous mocks data
        jest.clearAllMocks();

        // Store the original document.createElement method
        originalCreateElement = document.createElement;

        // Mock script creation
        mockScript = document.createElement('script');
        jest.spyOn(document, 'createElement').mockImplementation(tag => {
            if (tag === 'script') return mockScript;
            return originalCreateElement.call(document, tag);
        });
        document.head.appendChild = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a function from the hook', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        expect(typeof result.current[0]).toBe('function');
    });

    it('should append the OneTrust script to document head', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        const initializeOneTrust = result.current[0];
        initializeOneTrust(mockGoogleAnalytics);
        
        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(mockScript.src).toBe('https://cdn.cookielaw.org/consent/asdf-1234/otSDKStub.js');
        expect(mockScript.nonce).toBe('abcd');
        expect(mockScript.dataset.domainScript).toBe('asdf-1234');
        expect(document.head.appendChild).toHaveBeenCalledWith(mockScript);
    });

    it('should not call gtag if OnetrustActiveGroups is undefined', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        const initializeOneTrust = result.current[0];
        initializeOneTrust(mockGoogleAnalytics);
        
        window.OptanonWrapper();

        expect(mockGtag).not.toBeCalled();
    });

    it('should update gtag consent values based on OnetrustActiveGroups', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        const initializeOneTrust = result.current[0];
        initializeOneTrust(mockGoogleAnalytics);

        // Mocking the OnetrustActiveGroups
        window.OnetrustActiveGroups = 'C0001,C0002,C0003,C0004,C0005';
        
        window.OptanonWrapper();

        expect(mockGtag).toBeCalledWith("consent", "update", { analytics_storage: GoogleAnalyticsConsentValue.Granted });
        expect(mockGtag).toBeCalledWith("consent", "update", { functional_storage: GoogleAnalyticsConsentValue.Granted });
        expect(mockGtag).toBeCalledWith("consent", "update", {
            ad_storage: GoogleAnalyticsConsentValue.Granted,
            ad_user_data: GoogleAnalyticsConsentValue.Granted,
            ad_personalization: GoogleAnalyticsConsentValue.Granted,
            personalization_storage: GoogleAnalyticsConsentValue.Granted
        });
        expect(mockEvent).toBeCalledWith({ action: 'um_consent_updated', category: 'consent' });
    });

    it('should remove GA cookies if Performance or Targeting consent is denied', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        const initializeOneTrust = result.current[0];
        initializeOneTrust(mockGoogleAnalytics);
        
        // No Performance or Targeting consent
        window.OnetrustActiveGroups = 'C0001,C0003,C0005';
        
        window.OptanonWrapper();

        expect(Cookies.remove).toHaveBeenCalledWith("_ga");
        expect(Cookies.remove).toHaveBeenCalledWith("_gat");
        expect(Cookies.remove).toHaveBeenCalledWith("_gid");
    });
});
