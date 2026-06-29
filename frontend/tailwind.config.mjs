/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-hanken-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-martian-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-big-shoulders)', 'var(--font-hanken-grotesk)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'display-tight': '-0.02em',
        'label': '0.08em',
        'label-wide': '0.14em',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--foreground)',
              '--tw-prose-headings': 'var(--foreground)',
              'code, pre': {
                fontFamily: 'var(--font-martian-mono), monospace',
              },
              h1: {
                fontFamily: 'var(--font-big-shoulders), system-ui, sans-serif',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                marginBottom: '0.25em',
              },
              h2: {
                fontFamily: 'var(--font-big-shoulders), system-ui, sans-serif',
                fontWeight: '600',
                letterSpacing: '-0.01em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
