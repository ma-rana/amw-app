// Global theme utilities to apply and initialize theme as early as possible

// Apply theme CSS variables to document root
export function applyTheme(themeId) {
  const predefinedThemes = {
    light: {
      preview: {
        primary: '#280a32',
        secondary: '#6b46c1',
        background: '#ffffff',
        surface: '#f8fafc',
      },
    },
    dark: {
      preview: {
        primary: '#a855f7',
        secondary: '#8b5cf6',
        background: '#1a1a1a',
        surface: '#2d2d2d',
      },
    },
  };

  const theme = predefinedThemes[themeId] || predefinedThemes.light;
  const root = document.documentElement;

  if (themeId === 'dark') {
    root.style.setProperty('--brand-primary', theme.preview.primary);
    root.style.setProperty('--brand-secondary', theme.preview.secondary);
    root.style.setProperty('--brand-background', theme.preview.background);
    root.style.setProperty('--brand-surface', theme.preview.surface);
    root.style.setProperty('--brand-white', '#2d2d2d');
    root.style.setProperty('--brand-black', '#ffffff');
    root.style.setProperty('--brand-light-gray', '#3b3b3b');

    root.style.setProperty('--color-background', theme.preview.background);
    root.style.setProperty('--color-surface', theme.preview.surface);
    root.style.setProperty('--color-background-alt', theme.preview.surface);
    root.style.setProperty('--color-surface-hover', '#343434');
    root.style.setProperty('--color-text-primary', '#d1d5db');
    root.style.setProperty('--color-text-secondary', '#cbd5e1');
    root.style.setProperty('--color-text-muted', '#94a3b8');
    root.style.setProperty('--color-border', '#374151');
    root.style.setProperty('--color-border-light', '#4b5563');
    root.style.setProperty('--color-border-clean', 'rgba(255, 255, 255, 0.10)');

    root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(255, 255, 255, 0.06)');
    root.style.setProperty('--shadow', '0 1px 3px 0 rgba(255, 255, 255, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.05)');
    root.style.setProperty('--shadow-md', '0 3px 4px -1px rgba(255, 255, 255, 0.08), 0 2px 3px -1px rgba(255, 255, 255, 0.05)');
    root.style.setProperty('--shadow-lg', '0 6px 10px -3px rgba(255, 255, 255, 0.08), 0 3px 6px -2px rgba(255, 255, 255, 0.05)');
    root.style.setProperty('--shadow-xl', '0 12px 18px -5px rgba(255, 255, 255, 0.06), 0 6px 6px -5px rgba(255, 255, 255, 0.04)');

    root.style.setProperty('--gray-50', '#374151');
    root.style.setProperty('--gray-100', '#4b5563');
    root.style.setProperty('--gray-200', '#6b7280');
    root.style.setProperty('--gray-300', '#9ca3af');
    root.style.setProperty('--gray-600', '#d1d5db');
    root.style.setProperty('--gray-700', '#e5e7eb');
    root.style.setProperty('--gray-800', '#f3f4f6');
    root.style.setProperty('--gray-900', '#f9fafb');

    root.style.setProperty('--bg-primary', theme.preview.surface);
    root.style.setProperty('--bg-secondary', theme.preview.background);
    root.style.setProperty('--bg-muted', '#242424');
    root.style.setProperty('--bg-dark', theme.preview.background);
    root.style.setProperty('--text-primary', '#d1d5db');
    root.style.setProperty('--text-secondary', '#cbd5e1');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--text-inverse', '#ffffff');
    root.style.setProperty('--primary-hover', '#9b4dec');
    root.style.setProperty('--color-active-bg', 'rgba(168, 85, 247, 0.14)');
    root.style.setProperty('--color-active-border', '#8b5cf6');
    root.style.setProperty('--color-active-text', 'var(--color-text-primary)');

    // Icon backgrounds/foregrounds for theme-aware pills/circles
    root.style.setProperty('--color-icon-bg', 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--color-icon-fg', 'var(--color-text-primary)');
  } else {
    root.style.setProperty('--brand-primary', theme.preview.primary);
    root.style.setProperty('--brand-secondary', theme.preview.secondary);
    root.style.setProperty('--brand-background', theme.preview.background);
    root.style.setProperty('--brand-surface', theme.preview.surface);
    root.style.setProperty('--brand-white', '#ffffff');
    root.style.setProperty('--brand-black', '#000000');
    root.style.setProperty('--brand-light-gray', '#e5e7eb');

    root.style.setProperty('--color-background', theme.preview.background);
    root.style.setProperty('--color-surface', theme.preview.surface);
    root.style.setProperty('--color-background-alt', '#ffffff');
    root.style.setProperty('--color-surface-hover', '#f1f5f9');
    root.style.setProperty('--color-text-primary', '#0f172a');
    root.style.setProperty('--color-text-secondary', '#475569');
    root.style.setProperty('--color-text-muted', '#64748b');
    root.style.setProperty('--color-border', '#e2e8f0');
    root.style.setProperty('--color-border-light', '#f1f5f9');
    root.style.setProperty('--color-border-clean', 'rgba(0, 0, 0, 0.06)');

    root.style.setProperty('--gray-50', '#f9fafb');
    root.style.setProperty('--gray-100', '#f3f4f6');
    root.style.setProperty('--gray-200', '#e5e7eb');
    root.style.setProperty('--gray-300', '#d1d5db');
    root.style.setProperty('--gray-600', '#4b5563');
    root.style.setProperty('--gray-700', '#374151');
    root.style.setProperty('--gray-800', '#1f2937');
    root.style.setProperty('--gray-900', '#111827');

    root.style.setProperty('--bg-primary', theme.preview.background);
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-muted', '#f5f5f5');
    root.style.setProperty('--bg-dark', '#171717');
    root.style.setProperty('--text-primary', '#171717');
    root.style.setProperty('--text-secondary', '#404040');
    root.style.setProperty('--text-muted', '#737373');
    root.style.setProperty('--text-inverse', '#ffffff');
    root.style.setProperty('--primary-hover', '#4b1d5f');
    root.style.setProperty('--color-active-bg', 'rgba(40, 10, 50, 0.08)');
    root.style.setProperty('--color-active-border', 'var(--brand-primary)');
    root.style.setProperty('--color-active-text', 'var(--color-text-primary)');

    // Icon backgrounds/foregrounds for theme-aware pills/circles
    root.style.setProperty('--color-icon-bg', 'rgba(0, 0, 0, 0.06)');
    root.style.setProperty('--color-icon-fg', 'var(--color-text-primary)');
  }
}

// Initialize theme at app startup, optionally syncing with system preference
export function initTheme() {
  try {
    const storedOptionsRaw = localStorage.getItem('displayOptions');
    const storedOptions = storedOptionsRaw ? JSON.parse(storedOptionsRaw) : null;
    const selectedTheme = localStorage.getItem('selectedTheme');

    // Manual by default; only use system if explicitly enabled
    const useSystem = storedOptions?.useSystemTheme === true;
    let themeToApply = (selectedTheme === 'dark' || selectedTheme === 'light') ? selectedTheme : 'light';

    if (useSystem) {
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      const chosen = mql && mql.matches ? 'dark' : 'light';
      themeToApply = chosen;

      // Setup listener once for system changes if enabled
      if (mql && !window.__amwSystemThemeListener) {
        const listener = () => {
          const next = mql.matches ? 'dark' : 'light';
          applyTheme(next);
          localStorage.setItem('selectedTheme', next);
        };
        window.__amwSystemThemeMql = mql;
        window.__amwSystemThemeListener = listener;
        mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener);
      }
    }

    applyTheme(themeToApply);
    localStorage.setItem('selectedTheme', themeToApply);

    // Smooth transitions option
    const smoothTransitions = storedOptions?.smoothTransitions ?? true;
    const root = document.documentElement;
    root.style.setProperty('--transition-fast', smoothTransitions ? 'all 0.15s ease' : 'none');
    root.style.setProperty('--transition', smoothTransitions ? 'all 0.3s ease' : 'none');
    root.style.setProperty('--transition-slow', smoothTransitions ? 'all 0.5s ease' : 'none');

    // High contrast option
    if (storedOptions?.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  } catch (err) {
    // Fallback to light theme
    applyTheme('light');
  }
}
