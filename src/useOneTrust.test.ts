import { act, renderHook } from '@testing-library/react';
import { useOneTrust } from './useOneTrust';
import Cookies from 'js-cookie';
import { GA4 } from 'react-ga4/types/ga4';

// Mocking js-cookie
jest.mock('js-cookie', () => ({
    remove: jest.fn()
}));


describe('useOneTrust', () => {
    let googleAnalyticsMock: jest.Mocked<GA4>;

    beforeEach(() => {
        googleAnalyticsMock = {
            gtag: jest.fn(),
            event: jest.fn(),
          } as unknown as jest.Mocked<GA4>;
          window.OnetrustActiveGroups = undefined;
          document.head.innerHTML = '';      
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a function from the hook', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'asdf-1234', nonce: 'abcd' }));
        expect(typeof result.current[0]).toBe('function');
    });

    it('should append the OneTrust script to document head', () => {
        const { result } = renderHook(() => useOneTrust({ oneTrustScriptDomain: 'test-domain' }));
        const initializeOneTrust = result.current[0];
        act(() => {
            if (initializeOneTrust) {
                initializeOneTrust(googleAnalyticsMock);
            }
        });

        const script = document.querySelector('script[data-domain-script="test-domain"]') as HTMLScriptElement;
        expect(script).not.toBeNull();
        expect(script?.src).toBe('https://cdn.cookielaw.org/consent/test-domain/otSDKStub.js');

    });

    it('should not call gtag if OnetrustActiveGroups is undefined', () => {
        const { result } = renderHook(() => useOneTrust({}));
        const initializeOneTrust = result.current[0];
        act(() => {
            if (initializeOneTrust) {
                initializeOneTrust(googleAnalyticsMock);
            }
        });
        
        window.OptanonWrapper?.();
        expect(googleAnalyticsMock.gtag).not.toHaveBeenCalled();
    });

    it('should update gtag consent values based on OnetrustActiveGroups', () => {
        window.OnetrustActiveGroups = 'C0002 C0003 C0004';
        const { result } = renderHook(() => useOneTrust({}));
        const initializeOneTrust = result.current[0];
        act(() => {
            if (initializeOneTrust) {
                initializeOneTrust(googleAnalyticsMock);
            }
        });

        window.OptanonWrapper?.();
        expect(googleAnalyticsMock.gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'granted' });
        expect(googleAnalyticsMock.gtag).toHaveBeenCalledWith('consent', 'update', { functional_storage: 'granted' });
        expect(googleAnalyticsMock.gtag).toHaveBeenCalledWith('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        personalization_storage: 'granted',
        });

    });

    it('should remove GA cookies if Performance or Targeting consent is denied', () => {
        window.OnetrustActiveGroups = 'C0001';
        const { result } = renderHook(() => useOneTrust({}));

        act(() => {
            if (result.current[0]) {
                result.current[0](googleAnalyticsMock);
            }
        });

        window.OptanonWrapper?.();

        expect(Cookies.remove).toHaveBeenCalledWith('_ga');
        expect(Cookies.remove).toHaveBeenCalledWith('_gat');
        expect(Cookies.remove).toHaveBeenCalledWith('_gid');

    });
});