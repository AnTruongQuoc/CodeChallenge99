import { type NextRequest, NextResponse } from 'next/server';

import { env } from './shared/libs/env';

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());

  const envAllowedAppDomains = env.NEXT_PUBLIC_CSP_ALLOWED_APP_DOMAINS;
  const allowedAppDomains = [`${envAllowedAppDomains}`, env.isDev ? 'http://localhost:3000' : ''];

  const allowedAppDomainsString = allowedAppDomains.join(' ').trim();

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';
    script-src-elem 'self' 'nonce-${nonce}' ${allowedAppDomainsString} https://*.jup.ag https://*.temporal.xyz https://quicksol.merkle.io https://*.astralane.io https://*.arbitrum.io/rpc https://*.hyperliquid.xyz wss://*.hyperliquid.xyz https://*.intercom.io https://*.intercomcdn.com https://*.jito.wtf https://*.helius-rpc.com wss://*.helius-rpc.com https://*.turnkey.com https://*.relay.link https://*.google.com https://www.tiktok.com https://*.truthsocial.com https://*.googleapis.com https://accounts.google.com http://*.google-analytics.com https://googletagmanager.com https://*.instagram.com https://*.twitch.tv https://*.tiktokcdn-us.com https://*.torque.so;
    style-src 'self' ${allowedAppDomainsString} https://*.jup.ag https://*.temporal.xyz https://quicksol.merkle.io https://*.astralane.io https://*.arbitrum.io/rpc https://*.hyperliquid.xyz wss://*.hyperliquid.xyz https://*.jito.wtf https://*.helius-rpc.com wss://*.helius-rpc.com https://*.turnkey.com https://*.relay.link https://*.google.com https://www.tiktok.com https://*.truthsocial.com https://*.googleapis.com https://accounts.google.com http://*.google-analytics.com https://*.instagram.com https://*.twitch.tv https://*.tiktokcdn-us.com https://*.torque.so 'unsafe-inline';
    style-src-elem 'self' ${allowedAppDomainsString} https://*.jup.ag https://*.temporal.xyz https://quicksol.merkle.io https://*.astralane.io https://*.arbitrum.io/rpc https://*.hyperliquid.xyz wss://*.hyperliquid.xyz https://*.jito.wtf https://*.helius-rpc.com wss://*.helius-rpc.com https://*.turnkey.com https://*.relay.link https://*.google.com https://www.tiktok.com https://*.truthsocial.com https://*.googleapis.com https://accounts.google.com http://*.google-analytics.com https://*.instagram.com https://*.twitch.tv https://*.tiktokcdn-us.com https://*.torque.so 'unsafe-inline';
    img-src * ${allowedAppDomainsString} https: data: blob:;
    media-src 'self' https: data: blob:;
    font-src 'self' ${allowedAppDomainsString} data: https:;
    object-src 'none'; 
    child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' ${allowedAppDomainsString} https://*.jup.ag https://*.temporal.xyz https://quicksol.merkle.io https://*.astralane.io https://*.arbitrum.io/rpc https://*.hyperliquid.xyz wss://*.hyperliquid.xyz https://*.jito.wtf https://*.helius-rpc.com wss://*.helius-rpc.com https://*.turnkey.com https://*.relay.link https://*.google.com https://www.tiktok.com https://*.truthsocial.com https://*.googleapis.com https://accounts.google.com http://*.google-analytics.com https://*.instagram.com https://*.twitch.tv https://*.tiktokcdn-us.com https://*.torque.so https://*.cabalspy.xyz:* https://*.bubblemaps.io https://*.insightx.network https://*.youtube.com https://truthsocial.com https://*.truthsocial.com https://*.pinterest.com https://instagram.com https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://*.twitter.com blob:;
    connect-src 'self' ${allowedAppDomainsString} https://*.jup.ag https://*.jito.wtf https://*.helius-rpc.com wss://*.helius-rpc.com https://*.turnkey.com https://*.relay.link https://*.google.com https://www.tiktok.com https://*.truthsocial.com https://*.googleapis.com https://accounts.google.com http://*.google-analytics.com https://*.instagram.com https://*.twitch.tv https://*.tiktokcdn-us.com https://*.torque.so https://auth.privy.io https://*.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://api.web3modal.org https://*.web3modal.org;
    worker-src 'self' blob:; 
    manifest-src 'self';
  `;
  // upgrade-insecure-requests;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|error-monitoring).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
