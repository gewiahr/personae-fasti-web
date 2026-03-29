module.exports = {
  theme: {
    fontFamily: {
      sans: ['Stetica', 'system-ui', 'sans-serif'],
      mono: ['"Courier New"', 'monospace'],
      serif: ['Georgia', 'serif'],
    },
    extend: {
      colors: {
        // primary: 'var(--color-primary)',
        // secondary: 'var(--color-secondary)',
        // background: 'var(--color-background)',
        // surface: 'var(--color-surface)',
        // text: {
        //   DEFAULT: 'var(--color-text)',
        //   secondary: 'var(--color-text-secondary)',
        // },
        // border: 'var(--color-border)',
        fontFamily: {
          stetica: ['var(--font-stetica)'],
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