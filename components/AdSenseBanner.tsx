import React, { useEffect } from 'react';

interface AdSenseBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  layout?: string; // e.g., "in-article"
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ slot, format = 'auto', className = '', layout }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  // In development, we might not see ads, so we show a placeholder
  const isDev = false; // Set to true to see placeholders during dev

  return (
    <div className={`my-8 overflow-hidden rounded-lg bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest w-full text-center py-1 bg-black/20">Advertisement</span>
      <div className="w-full flex justify-center p-2 min-h-[100px]">
        {isDev ? (
          <div className="w-full h-24 bg-slate-700 animate-pulse flex items-center justify-center text-slate-500 text-xs">
            Google AdSense Slot: {slot}
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
            data-ad-layout={layout}
          ></ins>
        )}
      </div>
    </div>
  );
};