import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_TENANT_ID}`,
    redirectUri: "http://localhost:3000/auth/callback",
  },
  cache: {
    cacheLocation: "localStorage",

  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

let msalInitialized = false;
let initializedPromise: Promise<void> | null = null;


export const initializeMsal = async () => {
  if (!msalInitialized) {
    if (!initializedPromise) {
      initializedPromise = msalInstance.initialize().then(() => {
        msalInitialized = true;
        initializedPromise = null;
      });
    }
    return initializedPromise;
  }
};