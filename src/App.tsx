/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PORTFOLIO_DATA,
  ProjectItem,
  LanguageCode,
  LANGUAGE_OPTIONS
} from '../portfolio-data/data';
import { haptics } from './utils/haptics';
import { StaggerText, FocusBlock } from './components/StaggerText';
import { SlotScrambleText } from './components/SlotScrambleText';

type FilterMode = 'all' | 'automation' | 'document';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [lang, setLang] = useState<LanguageCode>('id');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('portofolio');

  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const ui = PORTFOLIO_DATA.ui[lang];
  const proseStaggerMode: 'word' | 'char' = lang === 'jp' || lang === 'zh' ? 'char' : 'word';
  const currentLangOption =
    LANGUAGE_OPTIONS.find((item) => item.code === lang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang;
  }, [lang]);

  // Close header dropdown when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) {
          haptics.trigger('tap');
          setIsMenuOpen(false);
          return;
        }
        if (selectedProject) {
          haptics.trigger('tap');
          setSelectedProject(null);
          return;
        }
      }
      if (
        !selectedProject &&
        !isMenuOpen &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        if (e.key === '1' && PORTFOLIO_DATA.projects[0]) {
          haptics.trigger('confirm');
          window.open(PORTFOLIO_DATA.projects[0].url, '_blank', 'noopener,noreferrer');
        } else if (e.key === '2' && PORTFOLIO_DATA.projects[1]) {
          haptics.trigger('confirm');
          window.open(PORTFOLIO_DATA.projects[1].url, '_blank', 'noopener,noreferrer');
        } else if (e.key === '3' && PORTFOLIO_DATA.projects[2]) {
          haptics.trigger('confirm');
          window.open(PORTFOLIO_DATA.projects[2].url, '_blank', 'noopener,noreferrer');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isMenuOpen]);

  useEffect(() => {
    const sections = ['portofolio', 'pengalaman', 'kualifikasi', 'kontak'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -60% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleCopy = async (text: string, key: string) => {
    haptics.trigger('confirm');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    } catch {
      // Fallback copy
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    haptics.trigger('tap');
    setActiveSection(targetId);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const setThemeMode = (targetDark: boolean) => {
    if (targetDark === darkMode) return;
    haptics.trigger('confirm');
    const root = document.documentElement;

    const applyThemeChange = () => {
      setDarkMode(targetDark);
      if (targetDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    const docWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (
      typeof docWithTransition.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      docWithTransition.startViewTransition(() => {
        applyThemeChange();
      });
    } else {
      root.classList.add('is-theme-switching');
      applyThemeChange();
      window.setTimeout(() => {
        root.classList.remove('is-theme-switching');
      }, 400);
    }
  };

  const handleLanguageChange = (nextLang: LanguageCode) => {
    if (nextLang === lang) return;
    haptics.trigger('confirm');
    setLang(nextLang);
  };

  const filteredProjects = PORTFOLIO_DATA.projects.filter((project) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'automation') {
      return (
        project.id === 'automation-pricing-tools' ||
        project.id === 'excel-erp-data-converter'
      );
    }
    if (activeFilter === 'document') {
      return project.id === 'secure-pdf-converter';
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAFAFA] text-[#111111] dark:bg-[#0A0A0A] dark:text-[#EDEDED]">
      {/* Fixed Frosted Glass Top Bar Contract: Always stays pinned at top when scrolling down */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full bg-[#FAFAFA]/75 dark:bg-[#0A0A0A]/75 backdrop-blur-md backdrop-saturate-150 border-b border-neutral-900/10 dark:border-white/10">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: KELVIN'S PORTFOLIO with Slot/Gacha Letter-by-Letter Loop (5s pause) */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              haptics.trigger('tap');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[11px] sm:text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
          >
            <SlotScrambleText text="KELVIN'S PORTFOLIO" pauseDurationMs={5000} />
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-500 dark:text-neutral-400"
          >
            {[
              { id: 'portofolio', label: ui.nav.portfolio },
              { id: 'pengalaman', label: ui.nav.experience },
              { id: 'kualifikasi', label: ui.nav.qualifications },
              { id: 'kontak', label: ui.nav.contact }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                onMouseEnter={() => haptics.trigger('tick')}
                className={`py-1 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 ${
                  activeSection === item.id
                    ? 'text-neutral-900 dark:text-neutral-100 underline decoration-neutral-900 dark:decoration-neutral-100'
                    : 'hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Language & Theme Frosted Dropdown + Primary Download CV Action */}
          <div className="flex items-center gap-2 shrink-0">
            <div ref={menuContainerRef} className="relative">
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-haspopup="dialog"
                aria-label={`${ui.langLabel} & ${ui.themeLabel}`}
                onClick={() => {
                  haptics.trigger('tap');
                  setIsMenuOpen((prev) => !prev);
                }}
                onMouseEnter={() => haptics.trigger('tick')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-200 bg-neutral-900/5 dark:bg-white/5 hover:bg-neutral-900/10 dark:hover:bg-white/10 border border-neutral-900/10 dark:border-white/15 rounded active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
              >
                <span>{currentLangOption.shortLabel}</span>
                {/* Minimalist functional chevron affordance */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${
                    isMenuOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Frosted Glass Dropdown Menu with Smooth Popup Animation */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    role="dialog"
                    aria-label={`${ui.langLabel} & ${ui.themeLabel}`}
                    className="absolute right-0 mt-2 w-52 p-3 rounded bg-[#FAFAFA]/85 dark:bg-[#111111]/85 backdrop-blur-md backdrop-saturate-150 border border-neutral-900/10 dark:border-white/15 shadow-lg origin-top-right z-50"
                  >
                    {/* Language Selection */}
                    <div>
                      <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 px-1">
                        {ui.langLabel}
                      </p>
                      <div className="space-y-0.5">
                        {LANGUAGE_OPTIONS.map((option) => {
                          const active = lang === option.code;
                          return (
                            <button
                              key={option.code}
                              type="button"
                              onClick={() => {
                                handleLanguageChange(option.code);
                                setIsMenuOpen(false);
                              }}
                              onMouseEnter={() => haptics.trigger('tick')}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-sm transition-colors duration-150 ${
                                active
                                  ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900/5 dark:hover:bg-white/10'
                              }`}
                            >
                              <span>{option.fullName}</span>
                              <span className="font-mono text-[11px] opacity-75">
                                {option.shortLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-900/10 dark:border-white/10">
                      <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-1.5 px-1">
                        {ui.themeLabel}
                      </p>
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-neutral-900/5 dark:bg-white/5 rounded-sm">
                        <button
                          type="button"
                          onClick={() => {
                            setThemeMode(false);
                          }}
                          onMouseEnter={() => haptics.trigger('tick')}
                          className={`py-1.5 text-xs font-mono rounded-xs transition-colors duration-150 text-center ${
                            !darkMode
                              ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                          }`}
                        >
                          {ui.themeLight}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setThemeMode(true);
                          }}
                          onMouseEnter={() => haptics.trigger('tick')}
                          className={`py-1.5 text-xs font-mono rounded-xs transition-colors duration-150 text-center ${
                            darkMode
                              ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                          }`}
                        >
                          {ui.themeDark}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href={PORTFOLIO_DATA.cvPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptics.trigger('confirm')}
              onMouseEnter={() => haptics.trigger('tick')}
              className="px-2.5 sm:px-3.5 py-1.5 text-xs font-medium bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
            >
              {ui.downloadCv}
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="max-w-[1080px] w-full mx-auto px-5 sm:px-6 pt-24 pb-20 md:pt-28 md:pb-32">
        {/* Hero / Identity & Executive Summary */}
        <section className="pb-10 md:pb-16 border-b border-neutral-200 dark:border-neutral-800">
          <FocusBlock>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div className="min-w-0">
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2 leading-relaxed">
                  <StaggerText
                    key={`role-${lang}`}
                    text={`${PORTFOLIO_DATA.roleTitle[lang]} · ${PORTFOLIO_DATA.location}`}
                    mode={proseStaggerMode}
                    stagger={proseStaggerMode === 'char' ? 0.012 : 0.025}
                  />
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  <StaggerText
                    text={PORTFOLIO_DATA.name}
                    mode="char"
                    delay={0.04}
                    stagger={0.028}
                  />
                </h1>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleCopy(PORTFOLIO_DATA.email, 'hero-email')}
                  onMouseEnter={() => haptics.trigger('tick')}
                  className="px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 active:scale-[0.98] transition-all duration-150 truncate max-w-full"
                >
                  {copiedKey === 'hero-email' ? ui.emailCopied : PORTFOLIO_DATA.email}
                </button>
              </div>
            </div>

            <div className="text-[15px] sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-3xl font-normal">
              <StaggerText
                key={`summary-${lang}`}
                text={PORTFOLIO_DATA.summary[lang]}
                mode={proseStaggerMode}
                delay={0.05}
                stagger={proseStaggerMode === 'char' ? 0.008 : 0.014}
              />
            </div>

            {/* Clean Contact Metadata: Important data preserved across languages */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-y-2 sm:gap-x-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-20 shrink-0">
                    {ui.contactLabels.location}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">
                    {PORTFOLIO_DATA.location}
                  </span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-20 shrink-0">
                    {ui.contactLabels.phone}
                  </span>
                  <a
                    href={PORTFOLIO_DATA.phoneLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors truncate"
                  >
                    {PORTFOLIO_DATA.phone}
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-20 shrink-0">
                    {ui.contactLabels.email}
                  </span>
                  <a
                    href={`mailto:${PORTFOLIO_DATA.email}`}
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors truncate"
                  >
                    {PORTFOLIO_DATA.email}
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-20 shrink-0">
                    {ui.contactLabels.linkedin}
                  </span>
                  <a
                    href={PORTFOLIO_DATA.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors truncate"
                  >
                    {PORTFOLIO_DATA.linkedin}
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-20 shrink-0">
                    {ui.contactLabels.github}
                  </span>
                  <a
                    href={PORTFOLIO_DATA.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors truncate"
                  >
                    {PORTFOLIO_DATA.github}
                  </a>
                </div>
              </div>
            </div>
          </FocusBlock>
        </section>

        {/* Section 01: PORTOFOLIO (Primary Redirect Directory) */}
        <section
          id="portofolio"
          className="py-12 md:py-20 border-b border-neutral-200 dark:border-neutral-800 scroll-mt-14"
        >
          <FocusBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                <StaggerText
                  key={`s1-title-${lang}`}
                  text={ui.section01.title}
                  mode="char"
                  stagger={0.012}
                />
              </h2>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                <StaggerText
                  key={`s1-sub-${lang}`}
                  text={ui.section01.subtitle}
                  mode={proseStaggerMode}
                  delay={0.05}
                  stagger={proseStaggerMode === 'char' ? 0.01 : 0.014}
                />
              </p>
            </div>

            {/* Functional Segmented Filter Controls */}
            <div
              role="tablist"
              aria-label="Filter Kategori Portofolio"
              className="grid grid-cols-3 sm:inline-flex items-center w-full sm:w-auto p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded shrink-0"
            >
              {[
                { key: 'all', label: ui.section01.filterAll },
                { key: 'automation', label: ui.section01.filterAutomation },
                { key: 'document', label: ui.section01.filterDocument }
              ].map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeFilter === tab.key}
                  onClick={() => {
                    haptics.trigger('tap');
                    setActiveFilter(tab.key as FilterMode);
                  }}
                  onMouseEnter={() => haptics.trigger('tick')}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs font-medium text-center rounded-sm transition-colors duration-150 whitespace-nowrap truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 ${
                    activeFilter === tab.key
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-2xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </FocusBlock>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, projectIdx) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => haptics.trigger('tick')}
                  className="group py-8 sm:py-10 transition-colors duration-150 gpu-layer"
                >
                  <FocusBlock>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                      {/* Index & Title Column */}
                      <div className="lg:col-span-5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono tabular-nums text-neutral-400 dark:text-neutral-500">
                            {project.index}
                          </span>
                          <span aria-hidden="true" className="text-xs text-neutral-300 dark:text-neutral-700">
                            —
                          </span>
                          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 break-words">
                            {project.impactMetric[lang]}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:underline underline-offset-4">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => haptics.trigger('confirm')}
                            className="focus-visible:outline-none focus-visible:underline"
                          >
                            <StaggerText
                              text={project.title}
                              mode="char"
                              delay={projectIdx * 0.03}
                              stagger={0.012}
                            />
                          </a>
                        </h3>

                        <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                          {project.displayUrl}
                        </p>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 break-words">
                          {project.category[lang]}
                        </p>
                      </div>

                      {/* Description & Clean Highlights List Column */}
                      <div className="lg:col-span-5 min-w-0">
                        <div className="text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                          <StaggerText
                            key={`${project.id}-desc-${lang}`}
                            text={project.description[lang]}
                            mode={proseStaggerMode}
                            delay={0.03}
                            stagger={proseStaggerMode === 'char' ? 0.008 : 0.013}
                          />
                        </div>

                        {/* Clean vertical/inline list without dangling trailing slashes */}
                        <ul className="mt-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                          {project.highlights[lang].map((item) => (
                            <li key={item} className="flex items-start gap-2 min-w-0">
                              <span
                                aria-hidden="true"
                                className="text-neutral-400 dark:text-neutral-600 select-none shrink-0"
                              >
                                —
                              </span>
                              <span className="break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Column: Direct Redirect + Copy/Inspect */}
                      <div className="lg:col-span-2 flex flex-row lg:flex-col items-center lg:items-stretch justify-start lg:justify-end gap-2 pt-2 lg:pt-0 w-full">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => haptics.trigger('confirm')}
                          onMouseEnter={() => haptics.trigger('tick')}
                          className="flex-1 lg:flex-initial px-4 py-2 text-xs font-medium text-center bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
                        >
                          {ui.openApp}
                        </a>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(project.url, project.id)}
                            onMouseEnter={() => haptics.trigger('tick')}
                            className="flex-1 px-2.5 py-2 lg:py-1.5 text-xs font-mono text-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
                          >
                            {copiedKey === project.id ? ui.urlCopied : ui.copyUrl}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              haptics.trigger('tap');
                              setSelectedProject(project);
                            }}
                            onMouseEnter={() => haptics.trigger('tick')}
                            className="flex-1 px-2.5 py-2 lg:py-1.5 text-xs font-mono text-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
                          >
                            {ui.detail}
                          </button>
                        </div>
                      </div>
                    </div>
                  </FocusBlock>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Section 02: PENGALAMAN KERJA */}
        <section
          id="pengalaman"
          className="py-12 md:py-20 border-b border-neutral-200 dark:border-neutral-800 scroll-mt-14"
        >
          <FocusBlock className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
              <StaggerText
                key={`s2-title-${lang}`}
                text={ui.section02.title}
                mode="char"
                stagger={0.013}
              />
            </h2>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
              <StaggerText
                key={`s2-sub-${lang}`}
                text={ui.section02.subtitle}
                mode={proseStaggerMode}
                delay={0.04}
                stagger={proseStaggerMode === 'char' ? 0.01 : 0.015}
              />
            </p>
          </FocusBlock>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
            {PORTFOLIO_DATA.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                onMouseEnter={() => haptics.trigger('tick')}
                className="py-8"
              >
                <FocusBlock className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                  {/* Left Role Column */}
                  <div className="md:col-span-5 pr-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono tabular-nums text-neutral-400 dark:text-neutral-500">
                        0{idx + 1}
                      </span>
                      <span aria-hidden="true" className="text-xs text-neutral-300 dark:text-neutral-700">
                        —
                      </span>
                      <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                        {exp.period[lang]}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                      <StaggerText
                        key={`${exp.id}-role-${lang}`}
                        text={exp.role[lang]}
                        mode={proseStaggerMode}
                        stagger={proseStaggerMode === 'char' ? 0.012 : 0.022}
                      />
                    </h3>

                    {/* Nama perusahaan tetap dipertahankan sebagai data penting */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      <StaggerText
                        text={exp.company}
                        mode="word"
                        delay={0.04}
                        stagger={0.018}
                      />
                    </p>
                  </div>

                  {/* Right Points Column */}
                  <div className="md:col-span-7 min-w-0">
                    <ul className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {exp.points[lang].map((point, pIdx) => (
                        <li key={point} className="flex items-start gap-3 min-w-0">
                          <span
                            aria-hidden="true"
                            className="font-mono text-xs text-neutral-400 dark:text-neutral-500 mt-1 select-none shrink-0"
                          >
                            —
                          </span>
                          <span className="min-w-0 flex-1">
                            <StaggerText
                              key={`${exp.id}-pt-${pIdx}-${lang}`}
                              text={point}
                              mode={proseStaggerMode}
                              delay={pIdx * 0.025}
                              stagger={proseStaggerMode === 'char' ? 0.008 : 0.012}
                            />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FocusBlock>
              </div>
            ))}
          </div>
        </section>

        {/* Section 03: PENDIDIKAN & INFORMASI TAMBAHAN */}
        <section
          id="kualifikasi"
          className="py-12 md:py-20 border-b border-neutral-200 dark:border-neutral-800 scroll-mt-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Pendidikan */}
            <FocusBlock className="lg:col-span-5 min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6 leading-snug">
                <StaggerText
                  key={`s3-title-${lang}`}
                  text={ui.section03.title}
                  mode="char"
                  stagger={0.014}
                />
              </h2>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                {PORTFOLIO_DATA.education.map((edu) => (
                  <div key={edu.institution}>
                    <p className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400 mb-1">
                      {edu.period}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                      <StaggerText
                        key={`edu-major-${lang}`}
                        text={edu.major[lang]}
                        mode={proseStaggerMode}
                        stagger={proseStaggerMode === 'char' ? 0.012 : 0.02}
                      />
                    </h3>
                    {/* Nama institusi sekolah tetap dipertahankan */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      <StaggerText text={edu.institution} mode="word" delay={0.03} />
                    </p>

                    <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
                        {ui.section03.finalProjectLabel}
                      </p>
                      <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                        {edu.finalProjects[lang].map((fp, fpIdx) => (
                          <li key={fp} className="flex items-start gap-2.5 min-w-0">
                            <span
                              aria-hidden="true"
                              className="font-mono text-xs text-neutral-400 mt-0.5 shrink-0"
                            >
                              —
                            </span>
                            <span className="min-w-0 flex-1">
                              <StaggerText
                                key={`fp-${fpIdx}-${lang}`}
                                text={fp}
                                mode={proseStaggerMode}
                                delay={0.03 + fpIdx * 0.03}
                                stagger={proseStaggerMode === 'char' ? 0.01 : 0.014}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </FocusBlock>

            {/* Informasi Tambahan & Kompetensi */}
            <FocusBlock className="lg:col-span-7 min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6 leading-snug">
                <StaggerText
                  key={`s4-title-${lang}`}
                  text={ui.section04.title}
                  mode="char"
                  stagger={0.013}
                />
              </h2>

              <dl className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800 text-sm">
                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {ui.section04.technicalSkills}
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed min-w-0">
                    <StaggerText
                      key={`tech-${lang}`}
                      text={PORTFOLIO_DATA.additionalInfo.technicalSkills[lang].join(' · ')}
                      mode={proseStaggerMode}
                      stagger={proseStaggerMode === 'char' ? 0.008 : 0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {ui.section04.interpersonalSkills}
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed min-w-0">
                    <StaggerText
                      key={`inter-${lang}`}
                      text={PORTFOLIO_DATA.additionalInfo.interpersonalSkills[lang].join(' · ')}
                      mode={proseStaggerMode}
                      stagger={proseStaggerMode === 'char' ? 0.008 : 0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {ui.section04.languages}
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed min-w-0">
                    <StaggerText
                      key={`langs-${lang}`}
                      text={PORTFOLIO_DATA.additionalInfo.languages[lang]}
                      mode={proseStaggerMode}
                      stagger={proseStaggerMode === 'char' ? 0.008 : 0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {ui.section04.certifications}
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed min-w-0">
                    <StaggerText
                      text={PORTFOLIO_DATA.additionalInfo.certifications.join(' · ')}
                      mode="word"
                      stagger={0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {ui.section04.sideActivities}
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 space-y-2 leading-relaxed min-w-0">
                    {PORTFOLIO_DATA.additionalInfo.sideActivities[lang].map((act, aIdx) => (
                      <p key={act}>
                        <StaggerText
                          key={`act-${aIdx}-${lang}`}
                          text={act}
                          mode={proseStaggerMode}
                          delay={aIdx * 0.03}
                          stagger={proseStaggerMode === 'char' ? 0.008 : 0.013}
                        />
                      </p>
                    ))}
                  </dd>
                </div>
              </dl>
            </FocusBlock>
          </div>
        </section>

        {/* Section 05: KONTAK & DOKUMEN LAMARAN */}
        <section id="kontak" className="pt-12 md:pt-20 scroll-mt-14">
          <FocusBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="max-w-xl min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                <StaggerText
                  key={`s5-title-${lang}`}
                  text={ui.section05.title}
                  mode="char"
                  stagger={0.014}
                />
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                <StaggerText
                  key={`s5-sub-${lang}`}
                  text={ui.section05.subtitle}
                  mode={proseStaggerMode}
                  delay={0.04}
                  stagger={proseStaggerMode === 'char' ? 0.009 : 0.014}
                />
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 w-full md:w-auto">
              <a
                href={`mailto:${PORTFOLIO_DATA.email}`}
                onClick={() => haptics.trigger('confirm')}
                onMouseEnter={() => haptics.trigger('tick')}
                className="px-4 py-2.5 sm:py-2 text-xs font-medium text-center bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                {ui.section05.sendEmail}
              </a>
              <a
                href={PORTFOLIO_DATA.phoneLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.trigger('confirm')}
                onMouseEnter={() => haptics.trigger('tick')}
                className="px-4 py-2.5 sm:py-2 text-xs font-medium text-center border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded hover:border-neutral-900 dark:hover:border-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                {ui.section05.whatsapp}
              </a>
              <a
                href={PORTFOLIO_DATA.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.trigger('tap')}
                onMouseEnter={() => haptics.trigger('tick')}
                className="px-4 py-2.5 sm:py-2 text-xs font-medium text-center border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                LinkedIn
              </a>
              <a
                href={PORTFOLIO_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.trigger('tap')}
                onMouseEnter={() => haptics.trigger('tick')}
                className="px-4 py-2.5 sm:py-2 text-xs font-medium text-center border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                GitHub
              </a>
            </div>
          </FocusBlock>
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <div>
            <span>{PORTFOLIO_DATA.name}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>{PORTFOLIO_DATA.location}</span>
          </div>
        </div>
      </footer>

      {/* Project Detail & Direct Redirect Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              haptics.trigger('tap');
              setSelectedProject(null);
            }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
              className="w-full max-w-lg bg-[#FAFAFA] dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded p-6 sm:p-8 shadow-sm gpu-layer"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {ui.modal.projectPrefix} {selectedProject.index} · {selectedProject.impactMetric[lang]}
                  </p>
                  <h3
                    id="modal-project-title"
                    className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1"
                  >
                    <StaggerText
                      text={selectedProject.title}
                      mode="char"
                      stagger={0.012}
                      autoTrigger
                    />
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    haptics.trigger('tap');
                    setSelectedProject(null);
                  }}
                  aria-label={ui.modal.closeAria}
                  className="px-2.5 py-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded shrink-0"
                >
                  ESC
                </button>
              </div>

              <div className="py-6 space-y-5">
                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                    {ui.modal.implementationDesc}
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <StaggerText
                      key={`modal-desc-${lang}`}
                      text={selectedProject.description[lang]}
                      mode={proseStaggerMode}
                      delay={0.04}
                      stagger={proseStaggerMode === 'char' ? 0.008 : 0.013}
                      autoTrigger
                    />
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                    {ui.modal.scopeAndSpecs}
                  </p>
                  <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                    {selectedProject.highlights[lang].map((h, hIdx) => (
                      <li key={h} className="flex items-start gap-2.5 min-w-0">
                        <span aria-hidden="true" className="font-mono text-xs text-neutral-400 mt-0.5 shrink-0">
                          —
                        </span>
                        <span className="min-w-0 flex-1">
                          <StaggerText
                            key={`modal-hl-${hIdx}-${lang}`}
                            text={h}
                            mode={proseStaggerMode}
                            delay={0.08 + hIdx * 0.04}
                            stagger={proseStaggerMode === 'char' ? 0.009 : 0.014}
                            autoTrigger
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                    {ui.modal.redirectUrlLabel}
                  </p>
                  <p className="text-xs font-mono text-neutral-800 dark:text-neutral-200 break-all select-all py-2 px-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
                    {selectedProject.url}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedProject.url, `modal-${selectedProject.id}`)}
                  className="px-3.5 py-2 text-xs font-mono border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedKey === `modal-${selectedProject.id}` ? ui.urlCopied : ui.copyUrl}
                </button>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => haptics.trigger('confirm')}
                  className="px-4 py-2 text-xs font-medium bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors whitespace-nowrap shrink-0"
                >
                  {ui.openAppNow}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
