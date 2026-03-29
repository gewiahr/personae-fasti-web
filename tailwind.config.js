module.exports = {
  // ...
  theme: {
    fontFamily: {
      sans: ['Stetica', 'system-ui', 'sans-serif'], // Default font
      mono: ['"Courier New"', 'monospace'],
      serif: ['Georgia', 'serif'],
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
        // blue: {
        //   100: '#dbeafe',
        //   200: '#bfdbfe',
        //   600: '#2563eb',
        //   800: '#1e40af',
        // },
        // green: {
        //   100: '#dcfce7',
        //   200: '#bbf7d0',
        //   600: '#16a34a',
        //   800: '#166534',
        // },
        fontFamily: {
          stetica: ['var(--font-stetica)'], // Optional: add as custom utility
        },
      },
      height: {
        'safe-area-top': 'env(safe-area-inset-top, 0px)',
        'safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      minHeight: {
        'safe-area-top': 'env(safe-area-inset-top, 0px)',
        'safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
      spacing: {
        'safe-area-top': 'env(safe-area-inset-top, 0px)',
        'safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
      },
    }
  }
}