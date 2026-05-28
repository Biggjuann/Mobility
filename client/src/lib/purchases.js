import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

// RevenueCat public iOS SDK key (safe to ship; not a secret). Injected at build
// time. Without it, or on web, purchases are unavailable and the app stays free.
const RC_API_KEY = import.meta.env.VITE_REVENUECAT_IOS_KEY || '';
const ENTITLEMENT = 'pro';

// Local UI testing: set VITE_FORCE_PRO=true to unlock everything in the browser.
const FORCE_PRO = import.meta.env.VITE_FORCE_PRO === 'true';

export const purchasesAvailable = () =>
  Capacitor.isNativePlatform() && !!RC_API_KEY;

let configured = false;

export async function initPurchases() {
  if (!purchasesAvailable() || configured) return;
  await Purchases.configure({ apiKey: RC_API_KEY });
  configured = true;
}

function hasPro(customerInfo) {
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT];
}

export async function checkPro() {
  if (FORCE_PRO) return true;
  if (!purchasesAvailable()) return false;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return hasPro(customerInfo);
  } catch {
    return false;
  }
}

// Returns the current offering's packages, or [] when unavailable (web/dev).
export async function getPackages() {
  if (!purchasesAvailable()) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings?.current?.availablePackages || [];
  } catch {
    return [];
  }
}

export async function purchase(pkg) {
  const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  return hasPro(customerInfo);
}

export async function restore() {
  if (!purchasesAvailable()) return false;
  const { customerInfo } = await Purchases.restorePurchases();
  return hasPro(customerInfo);
}
