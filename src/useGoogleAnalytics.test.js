import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { useGoogleAnalytics, GoogleAnalyticsConsentValue } from './useGoogleAnalytics';
import GoogleAnalytics from 'react-ga4';
import { useOneTrust } from './useOneTrust';

jest.mock('react-ga4');
jest.mock('./useOneTrust');

describe('useGoogleAnalytics', () => {
  const googleAnalyticsId = 'UA-XXXXXX-X';
  const debug = true;
  const nonce = 'test-nonce';
  const oneTrustScriptDomain = 'test-domain';

  beforeEach(() => {
    GoogleAnalytics.initialize.mockClear();
    GoogleAnalytics.gtag.mockClear();
    GoogleAnalytics.send.mockClear();
    useOneTrust.mockReturnValue([jest.fn()]);
  });

  it('initializes Google Analytics with correct options', () => {
    renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce, oneTrustScriptDomain }), {
      wrapper: MemoryRouter,
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'default', {
      ad_storage: GoogleAnalyticsConsentValue.Denied,
      analytics_storage: GoogleAnalyticsConsentValue.Denied,
      functionality_storage: GoogleAnalyticsConsentValue.Denied,
      personalization_storage: GoogleAnalyticsConsentValue.Denied,
      ad_user_data: GoogleAnalyticsConsentValue.Denied,
      ad_personalization: GoogleAnalyticsConsentValue.Denied,
      wait_for_update: 500,
    });

    expect(GoogleAnalytics.initialize).toHaveBeenCalledWith([{
      trackingId: googleAnalyticsId,
      gaOptions: {
        cookieFlags: 'SameSite=None; Secure',
        testMode: true,
        nonce: nonce,
      },
    }]);
  });

  it('tracks page views on location change', () => {
    const { result, rerender } = renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce, oneTrustScriptDomain }), {
      wrapper: MemoryRouter,
    });

    rerender();

    expect(GoogleAnalytics.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/' });
  });

  it('calls initializeOneTrust with GoogleAnalytics', () => {
    const initializeOneTrust = jest.fn();
    useOneTrust.mockReturnValue([initializeOneTrust]);

    renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce, oneTrustScriptDomain }), {
      wrapper: MemoryRouter,
    });

    expect(initializeOneTrust).toHaveBeenCalledWith(GoogleAnalytics);
  });
});