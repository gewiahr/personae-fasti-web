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
          blue: {
            100: '#dbeafe',
            200: '#bfdbfe',
            600: '#2563eb',
            800: '#1e40af',
          },
          green: {
            100: '#dcfce7',
            200: '#bbf7d0',
            600: '#16a34a',
            800: '#166534',
          }, 
          fontFamily: {
            stetica: ['var(--font-stetica)'], // Optional: add as custom utility
          },       
        }
      }
    }
  }