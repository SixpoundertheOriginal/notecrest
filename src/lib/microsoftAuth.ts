
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';

// Microsoft Graph API permissions we need
export const msalScopes = [
  'User.Read',
  'Calendars.Read',
  'Calendars.ReadWrite',
];

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: '3faf588e-4222-4c82-bc50-82580e2a19e8', // This is a placeholder - replace with your registered app ID
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Login function
export const signInWithMicrosoft = async (): Promise<AuthenticationResult | null> => {
  try {
    // Try login with popup
    const response = await msalInstance.loginPopup({
      scopes: msalScopes,
      prompt: 'select_account',
    });
    
    console.log('Microsoft login successful', response);
    return response;
  } catch (error) {
    console.error('Error during Microsoft login:', error);
    return null;
  }
};

// Logout function
export const signOutFromMicrosoft = async (): Promise<void> => {
  const logoutRequest = {
    account: msalInstance.getActiveAccount() as AccountInfo,
  };
  
  try {
    await msalInstance.logout(logoutRequest);
  } catch (error) {
    console.error('Error during Microsoft logout:', error);
  }
};

// Get active account
export const getActiveAccount = (): AccountInfo | null => {
  return msalInstance.getActiveAccount();
};

// Acquire token silently (for API calls)
export const acquireTokenSilent = async (): Promise<string | null> => {
  try {
    const account = getActiveAccount();
    
    if (!account) {
      console.error('No active account! Please sign in before acquiring token.');
      return null;
    }
    
    const response = await msalInstance.acquireTokenSilent({
      scopes: msalScopes,
      account,
    });
    
    return response.accessToken;
  } catch (error) {
    console.error('Silent token acquisition failed', error);
    
    // Fallback to interactive method if silent fails
    try {
      const response = await msalInstance.acquireTokenPopup({
        scopes: msalScopes,
      });
      return response.accessToken;
    } catch (interactiveError) {
      console.error('Interactive token acquisition failed', interactiveError);
      return null;
    }
  }
};
