import { useEffect, useState } from 'react';
import * as api from '../services/api';

/**
 * Hook that dynamically applies SEO meta tags from backend settings.
 * Reads seo_* keys from the Settings API and injects/updates
 * document.title, meta description, keywords, OG tags, robots,
 * canonical link, Google Analytics, and Google verification.
 */
export function useDynamicSeo(lang: string = 'en') {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const applySeo = async () => {
      try {
        const data = await api.settingsApi.getAll();
        const settings: Record<string, any> = {};
        if (Array.isArray(data)) {
          data.forEach(s => settings[s.key] = s);
        }

        const getVal = (key: string): string => {
          const s = settings[key];
          if (!s) return '';
          return s[`value_${lang}`] || s.value_en || '';
        };

        // Page Title
        const title = getVal('seo_title');
        if (title) document.title = title;

        // Helper: set or create meta tag
        const setMeta = (attr: string, attrValue: string, content: string) => {
          if (!content) return;
          let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement;
          if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, attrValue);
            document.head.appendChild(el);
          }
          el.setAttribute('content', content);
        };

        // Meta Description
        setMeta('name', 'description', getVal('seo_description'));

        // Meta Keywords
        setMeta('name', 'keywords', getVal('seo_keywords'));

        // Robots
        setMeta('name', 'robots', getVal('seo_robots'));

        // Google Verification
        const gVerify = getVal('seo_google_verification');
        if (gVerify) {
          setMeta('name', 'google-site-verification', gVerify);
        }

        // Open Graph
        setMeta('property', 'og:title', getVal('seo_og_title'));
        setMeta('property', 'og:description', getVal('seo_og_description'));
        setMeta('property', 'og:type', 'website');

        const ogImage = getVal('seo_og_image');
        if (ogImage) {
          setMeta('property', 'og:image', ogImage);
        }

        setMeta('property', 'og:locale', lang === 'ru' ? 'ru_RU' : 'uz_UZ');

        // Canonical URL
        const canonical = getVal('seo_canonical');
        if (canonical) {
          let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
          if (!linkEl) {
            linkEl = document.createElement('link');
            linkEl.setAttribute('rel', 'canonical');
            document.head.appendChild(linkEl);
          }
          linkEl.setAttribute('href', canonical);

          setMeta('property', 'og:url', canonical);
        }

        // Google Analytics
        const gaId = getVal('seo_ga_id');
        if (gaId && !document.querySelector(`script[src*="${gaId}"]`)) {
          const gaScript = document.createElement('script');
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
          document.head.appendChild(gaScript);

          const gaConfig = document.createElement('script');
          gaConfig.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `;
          document.head.appendChild(gaConfig);
        }

        setLoaded(true);
      } catch (err) {
        console.error('Failed to load SEO settings:', err);
      }
    };

    applySeo();
  }, [lang]);

  return { loaded };
}
