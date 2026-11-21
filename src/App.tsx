/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_DATA, ProjectItem } from '../portfolio-data/data';
import { haptics } from './utils/haptics';
import { StaggerText, FocusBlock } from './components/StaggerText';

type FilterMode = 'all' | 'automation' | 'document';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeSection, setActiveSection] = useState<string>('portofolio');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        haptics.trigger('tap');
        setSelectedProject(null);
      }
      if (
        !selectedProject &&
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
  }, [selectedProject]);

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

  const toggleTheme = () => {
    haptics.trigger('tap');
    setDarkMode((prev) => !prev);
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAFAFA] text-[#111111] dark:bg-[#0A0A0A] dark:text-[#EDEDED] transition-colors duration-150">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 w-full bg-[#FAFAFA]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 gpu-layer">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              haptics.trigger('tap');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
          >
            {PORTFOLIO_DATA.name}
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden sm:flex items-center gap-7 text-xs font-medium text-neutral-500 dark:text-neutral-400"
          >
            {[
              { id: 'portofolio', label: 'Portofolio' },
              { id: 'pengalaman', label: 'Pengalaman' },
              { id: 'kualifikasi', label: 'Kualifikasi' },
              { id: 'kontak', label: 'Kontak' }
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

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href={PORTFOLIO_DATA.cvPdfPath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptics.trigger('confirm')}
              onMouseEnter={() => haptics.trigger('tick')}
              className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100"
            >
              Unduh CV (PDF)
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="max-w-[1080px] w-full mx-auto px-5 sm:px-6 pt-10 pb-20 md:pt-16 md:pb-32">
        {/* Hero / Identity & Executive Summary */}
        <section className="pb-10 md:pb-16 border-b border-neutral-200 dark:border-neutral-800">
          <FocusBlock>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
              <div className="min-w-0">
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2 leading-relaxed">
                  <StaggerText
                    text={`${PORTFOLIO_DATA.roleTitle} · ${PORTFOLIO_DATA.location}`}
                    mode="word"
                    stagger={0.025}
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

              {/* Clean Workspace Mode / Theme Switcher & Quick Links */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  onMouseEnter={() => haptics.trigger('tick')}
                  className="px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
                >
                  Tema: {darkMode ? 'Gelap' : 'Terang'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(PORTFOLIO_DATA.email, 'hero-email')}
                  onMouseEnter={() => haptics.trigger('tick')}
                  className="px-3 py-1.5 text-xs font-mono border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 rounded hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 active:scale-[0.98] transition-all duration-150 truncate max-w-full"
                >
                  {copiedKey === 'hero-email' ? 'Email Tersalin' : PORTFOLIO_DATA.email}
                </button>
              </div>
            </div>

            <div className="text-[15px] sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-3xl font-normal">
              <StaggerText
                text={PORTFOLIO_DATA.summary}
                mode="word"
                delay={0.06}
                stagger={0.014}
              />
            </div>

            {/* Clean Contact Metadata: Stacked 2-column grid on mobile, inline row on desktop */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-y-2 sm:gap-x-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-16 shrink-0">Lokasi</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{PORTFOLIO_DATA.location}</span>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-16 shrink-0">Telepon</span>
                  <a
                    href={PORTFOLIO_DATA.phoneLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors"
                  >
                    {PORTFOLIO_DATA.phone}
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-16 shrink-0">Email</span>
                  <a
                    href={`mailto:${PORTFOLIO_DATA.email}`}
                    onClick={() => haptics.trigger('tap')}
                    className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline-offset-4 hover:underline transition-colors truncate"
                  >
                    {PORTFOLIO_DATA.email}
                  </a>
                </div>
                <span aria-hidden="true" className="hidden sm:inline">·</span>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-16 shrink-0">LinkedIn</span>
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

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 sm:hidden w-16 shrink-0">GitHub</span>
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
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                <StaggerText
                  text="01. Portofolio & Sistem Otomasi"
                  mode="char"
                  stagger={0.012}
                />
              </h2>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                <StaggerText
                  text="Klik baris aplikasi atau tekan tombol angka (1–3) untuk membuka tautan langsung"
                  mode="word"
                  delay={0.05}
                  stagger={0.014}
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
                { key: 'all', label: 'Semua (3)' },
                { key: 'automation', label: 'Otomasi (2)' },
                { key: 'document', label: 'Dokumen (1)' }
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
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono tabular-nums text-neutral-400 dark:text-neutral-500">
                            {project.index}
                          </span>
                          <span aria-hidden="true" className="text-xs text-neutral-300 dark:text-neutral-700">
                            —
                          </span>
                          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                            {project.impactMetric}
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

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                          {project.category}
                        </p>
                      </div>

                      {/* Description & Clean Highlights List Column */}
                      <div className="lg:col-span-5 min-w-0">
                        <div className="text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                          <StaggerText
                            text={project.description}
                            mode="word"
                            delay={0.03}
                            stagger={0.013}
                          />
                        </div>

                        {/* Clean vertical/inline list without dangling trailing slashes */}
                        <ul className="mt-3.5 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                          {project.highlights.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="text-neutral-400 dark:text-neutral-600 select-none shrink-0"
                              >
                                —
                              </span>
                              <span>{item}</span>
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
                          Buka Aplikasi
                        </a>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopy(project.url, project.id)}
                            onMouseEnter={() => haptics.trigger('tick')}
                            className="flex-1 px-2.5 py-2 lg:py-1.5 text-xs font-mono text-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded hover:border-neutral-400 dark:hover:border-neutral-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
                          >
                            {copiedKey === project.id ? 'Tersalin' : 'Salin URL'}
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
                            Detail
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
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              <StaggerText text="02. Pengalaman Kerja" mode="char" stagger={0.013} />
            </h2>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1.5">
              <StaggerText
                text="Rekam jejak profesional di industri manufaktur & operasional B2B"
                mode="word"
                delay={0.04}
                stagger={0.015}
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
                  {/* Left Role Column: Generous width and top-aligned period so long titles never split awkwardly */}
                  <div className="md:col-span-5 pr-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono tabular-nums text-neutral-400 dark:text-neutral-500">
                        0{idx + 1}
                      </span>
                      <span aria-hidden="true" className="text-xs text-neutral-300 dark:text-neutral-700">
                        —
                      </span>
                      <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                        {exp.period}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                      <StaggerText text={exp.role} mode="word" stagger={0.022} />
                    </h3>

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
                  <div className="md:col-span-7">
                    <ul className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {exp.points.map((point, pIdx) => (
                        <li key={point} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="font-mono text-xs text-neutral-400 dark:text-neutral-500 mt-1 select-none shrink-0"
                          >
                            —
                          </span>
                          <span className="min-w-0">
                            <StaggerText
                              text={point}
                              mode="word"
                              delay={pIdx * 0.025}
                              stagger={0.012}
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
            <FocusBlock className="lg:col-span-5">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
                <StaggerText text="03. Pendidikan" mode="char" stagger={0.014} />
              </h2>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                {PORTFOLIO_DATA.education.map((edu) => (
                  <div key={edu.institution}>
                    <p className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400 mb-1">
                      {edu.period}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                      <StaggerText text={edu.major} mode="word" stagger={0.02} />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      <StaggerText text={edu.institution} mode="word" delay={0.03} />
                    </p>

                    <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                      <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2.5">
                        Tugas Akhir:
                      </p>
                      <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                        {edu.finalProjects.map((fp, fpIdx) => (
                          <li key={fp} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="font-mono text-xs text-neutral-400 mt-0.5 shrink-0"
                            >
                              —
                            </span>
                            <span>
                              <StaggerText
                                text={fp}
                                mode="word"
                                delay={0.03 + fpIdx * 0.03}
                                stagger={0.014}
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
            <FocusBlock className="lg:col-span-7">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
                <StaggerText
                  text="04. Keahlian & Informasi Tambahan"
                  mode="char"
                  stagger={0.013}
                />
              </h2>

              <dl className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800 text-sm">
                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Keahlian Teknis
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <StaggerText
                      text={PORTFOLIO_DATA.additionalInfo.technicalSkills.join(' · ')}
                      mode="word"
                      stagger={0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Interpersonal
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <StaggerText
                      text={PORTFOLIO_DATA.additionalInfo.interpersonalSkills.join(' · ')}
                      mode="word"
                      stagger={0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Bahasa
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <StaggerText
                      text={PORTFOLIO_DATA.additionalInfo.languages}
                      mode="word"
                      stagger={0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Sertifikasi
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <StaggerText
                      text={PORTFOLIO_DATA.additionalInfo.certifications.join(' · ')}
                      mode="word"
                      stagger={0.014}
                    />
                  </dd>
                </div>

                <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-baseline">
                  <dt className="sm:col-span-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    Aktivitas Sampingan
                  </dt>
                  <dd className="sm:col-span-8 text-neutral-800 dark:text-neutral-200 space-y-2 leading-relaxed">
                    {PORTFOLIO_DATA.additionalInfo.sideActivities.map((act, aIdx) => (
                      <p key={act}>
                        <StaggerText
                          text={act}
                          mode="word"
                          delay={aIdx * 0.03}
                          stagger={0.013}
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
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                <StaggerText
                  text="05. Kontak & Tautan Langsung"
                  mode="char"
                  stagger={0.014}
                />
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                <StaggerText
                  text="Tersedia untuk diskusi peluang kerja penuh waktu maupun implementasi sistem otomasi operasional."
                  mode="word"
                  delay={0.04}
                  stagger={0.014}
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
                Kirim Email
              </a>
              <a
                href={PORTFOLIO_DATA.phoneLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.trigger('confirm')}
                onMouseEnter={() => haptics.trigger('tick')}
                className="px-4 py-2.5 sm:py-2 text-xs font-medium text-center border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded hover:border-neutral-900 dark:hover:border-neutral-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0"
              >
                WhatsApp
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
          <div>
            <span>Sumber data portofolio: </span>
            <code className="text-neutral-700 dark:text-neutral-300">/portfolio-data/data.ts</code>
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
                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    PROYEK {selectedProject.index} · {selectedProject.impactMetric}
                  </p>
                  <h3
                    id="modal-project-title"
                    className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1"
                  >
                    <StaggerText
                      text={selectedProject.title}
                      mode="char"
                      stagger={0.012}
                    />
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    haptics.trigger('tap');
                    setSelectedProject(null);
                  }}
                  aria-label="Tutup detail proyek"
                  className="px-2.5 py-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded shrink-0"
                >
                  ESC
                </button>
              </div>

              <div className="py-6 space-y-5">
                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Deskripsi Implementasi
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <StaggerText
                      text={selectedProject.description}
                      mode="word"
                      stagger={0.012}
                    />
                  </p>
                </div>

                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Cakupan & Spesifikasi
                  </p>
                  <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="font-mono text-xs text-neutral-400 mt-0.5">
                          —
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-1">
                    URL Tujuan Redirect
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
                  {copiedKey === `modal-${selectedProject.id}` ? 'URL Tersalin' : 'Salin URL'}
                </button>
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => haptics.trigger('confirm')}
                  className="px-4 py-2 text-xs font-medium bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors whitespace-nowrap shrink-0"
                >
                  Buka Aplikasi Sekarang
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
