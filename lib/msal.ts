import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
} from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
    redirectUri: "http://localhost:3000/auth/callback",
    postLogoutRedirectUri: "http://localhost:3000/",
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

let msalInitialized = false;
let initPromise: Promise<void> | null = null;

export const initializeMsal = async (): Promise<void> => {
  if (msalInitialized) {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = msalInstance.initialize().then(async () => {
      try {
        await msalInstance.handleRedirectPromise();
      } catch (error) {
        console.error("Error handling redirect:", error);
      }
      msalInitialized = true;
    });
  }
  return initPromise;
};
