import { renderHook, act } from '@testing-library/react';
import { useUmConsent, InitializeConsentManagerParams } from './useUmConsent';

describe('useUmConsent', () => {
  let appendScriptMock: jest.SpyInstance;

  beforeEach(() => {
    appendScriptMock = jest.spyOn(document.head, 'appendChild');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes consent manager and appends script to document head', () => {
    const { result } = renderHook(() => useUmConsent());

    const params: InitializeConsentManagerParams = {
      developmentMode: true,
      alwaysShow: true,
      privacyUrl: 'https://example.com/privacy',
      onConsentApprove: jest.fn(),
      onConsentReject: jest.fn(),
    };

    act(() => {
      result.current.umConsentInitialize(params);
    });

    expect(appendScriptMock).toHaveBeenCalledTimes(1);
    const script = document.querySelector('script[src="https://umich.edu/apis/umconsentmanager/consentmanager.js"]');
    expect(script).not.toBeNull();
  });

  it('does not reinitialize consent manager if already initialized', () => {
    const { result } = renderHook(() => useUmConsent());

    const params: InitializeConsentManagerParams = {
      developmentMode: true,
      alwaysShow: true,
      onConsentApprove: jest.fn(),
      onConsentReject: jest.fn(),
    };

    act(() => {
      result.current.umConsentInitialize(params);
    });

    expect(appendScriptMock).toHaveBeenCalledTimes(1);

    act(() => {
        result.current.umConsentInitialize(params);
    });

    expect(appendScriptMock).toHaveBeenCalledTimes(1); // Should still be 1, as it should not reinitialize
  });
});