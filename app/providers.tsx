'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/lib/toast';
import { GoogleMapsProvider } from '@/lib/google-maps-loader';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleMapsProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </GoogleMapsProvider>
  );
}

