import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useGoogleAnalytics, GoogleAnalyticsConsentValue } from './useGoogleAnalytics';
import GoogleAnalytics from 'react-ga4';
import Cookies from 'js-cookie';

jest.mock('react-ga4');
jest.mock('js-cookie');

describe('useGoogleAnalytics', () => {
  const googleAnalyticsId = 'UA-XXXXXX-X';
  const debug = true;
  const nonce = 'test-nonce';

  beforeEach(() => {
    (GoogleAnalytics.initialize as jest.Mock).mockClear();
    (GoogleAnalytics.gtag as jest.Mock).mockClear();
    (GoogleAnalytics.send as jest.Mock).mockClear();
    (Cookies.remove as jest.Mock).mockClear();
  });

  it('initializes Google Analytics with correct options', () => {
    renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce }), {
      wrapper: MemoryRouter,
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'default', {
      ad_storage: GoogleAnalyticsConsentValue.Denied,
      analytics_storage: GoogleAnalyticsConsentValue.Denied,
      functional_storage: GoogleAnalyticsConsentValue.Denied,
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
    const { result, rerender } = renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce }), {
      wrapper: MemoryRouter,
    });

    rerender();

    expect(GoogleAnalytics.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/' });
  });

  it('handles consent approval correctly', () => {
    const { result } = renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce }), {
      wrapper: MemoryRouter,
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'default', {
      analytics_storage: GoogleAnalyticsConsentValue.Denied,
      functional_storage: GoogleAnalyticsConsentValue.Denied,
      ad_storage: GoogleAnalyticsConsentValue.Denied,
      ad_user_data: GoogleAnalyticsConsentValue.Denied,
      ad_personalization: GoogleAnalyticsConsentValue.Denied,
      personalization_storage: GoogleAnalyticsConsentValue.Denied,
      wait_for_update: 500,
    });

    act(() => {
      result.current.gaHandlers.onConsentApprove?.();
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: GoogleAnalyticsConsentValue.Granted,
      functional_storage: GoogleAnalyticsConsentValue.Granted,
      ad_storage: GoogleAnalyticsConsentValue.Granted,
      ad_user_data: GoogleAnalyticsConsentValue.Granted,
      ad_personalization: GoogleAnalyticsConsentValue.Granted,
      personalization_storage: GoogleAnalyticsConsentValue.Granted,
    });

    expect(GoogleAnalytics.event).toHaveBeenCalledWith({ action: 'um_consent_updated', category: 'consent' });
  });

  it('handles consent rejection correctly', () => {
    const { result } = renderHook(() => useGoogleAnalytics({ googleAnalyticsId, debug, nonce }), {
      wrapper: MemoryRouter,
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'default', {
      analytics_storage: GoogleAnalyticsConsentValue.Denied,
      functional_storage: GoogleAnalyticsConsentValue.Denied,
      ad_storage: GoogleAnalyticsConsentValue.Denied,
      ad_user_data: GoogleAnalyticsConsentValue.Denied,
      ad_personalization: GoogleAnalyticsConsentValue.Denied,
      personalization_storage: GoogleAnalyticsConsentValue.Denied,
      wait_for_update: 500,
    });

    act(() => {
      result.current.gaHandlers.onConsentReject?.();
    });

    expect(GoogleAnalytics.gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: GoogleAnalyticsConsentValue.Granted,
      functional_storage: GoogleAnalyticsConsentValue.Granted,
    });
    
    expect(Cookies.remove).toHaveBeenCalledWith('_ga');
    expect(Cookies.remove).toHaveBeenCalledWith('_gat');
    expect(Cookies.remove).toHaveBeenCalledWith('_gid');

    expect(GoogleAnalytics.event).toHaveBeenCalledWith({ action: 'um_consent_updated', category: 'consent' });
  });
});
