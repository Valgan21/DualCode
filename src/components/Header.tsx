import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { DiscordCta, PageLink } from './ui';
import { useI18n, storeLang } from '../lib/i18n';
import { LANGS, MOBILE_EXTRA_KEYS, NAV_KEYS, pageKeyFromSlug, pagePath, type Lang } from '../config/routes';
import { isImplemented } from '../config/implemented';

function useAlternatePath(): (target: Lang) => string {
  const { pathname } = useLocation();
  const { lang } = useI18n();
  return (target) => {
    const slug = pathname.replace(new RegExp(`^/${lang}/?`), '').replace(/\/$/, '');
    const key = pageKeyFromSlug(lang, slug);
    return key ? pagePath(target, key) : pagePath(target, 'home');
  };
}

export function LanguageSwitch() {
  const { lang, t } = useI18n();
  const alt = useAlternatePath();
  return (
    <div className="lang-switch" role="group" aria-label={t('a11y.language')}>
      {LANGS.map((l) => (
        <Link
          key={l}
          to={alt(l)}
          hrefLang={l}
          lang={l}
          className={l === lang ? 'is-current' : undefined}
          aria-current={l === lang ? 'true' : undefined}
          aria-label={t(l === 'en' ? 'a11y.switchToEn' : 'a11y.switchToEs')}
          onClick={() => storeLang(l)}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export function Header() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const items = NAV_KEYS.filter((k) => isImplemented(k));
  const mobileItems = [...NAV_KEYS, ...MOBILE_EXTRA_KEYS].filter((k) => isImplemented(k));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="container header-row">
        <Link to={pagePath(lang, 'home')} className="brand" aria-label={t('a11y.home')}>
          <Logo />
        </Link>

        <nav className="nav-desktop" aria-label={t('a11y.mainNav')}>
          {items.map((k) => (
            <NavLink key={k} to={pagePath(lang, k)}>
              {t(`nav.${k}`)}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitch />
          <DiscordCta className="btn btn-discord btn-sm header-discord" label={t('discord.short')} />
          <PageLink to="preview" className="btn btn-primary btn-sm header-cta">
            {t('header.cta')}
          </PageLink>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="container" aria-label={t('a11y.mobileNav')}>
          {mobileItems.map((k) => (
            <NavLink key={k} to={pagePath(lang, k)}>
              {t(`nav.${k}`)}
            </NavLink>
          ))}
          <div className="mobile-menu-foot">
            <LanguageSwitch />
            <DiscordCta className="btn btn-discord" />
          </div>
        </nav>
      </div>
    </header>
  );
}
