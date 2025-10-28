/**
 * Tailwind config scoped to the app-shell token set. Regenerate utilities with:
 * npx tailwindcss@3.4.1 -c tailwind.config.js -i ./src/styles/tailwind-input.css -o ./src/styles/tailwind.css --minify
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        surface: '#ffffff',
        muted: '#f1f5f9',
        'muted-foreground': '#64748b',
        border: '#e2e8f0',
        'border-strong': '#cbd5f5',
        input: '#e2e8f0',
        ring: '#1d4ed8',
        accent: '#111827',
        'accent-foreground': '#f8fafc',
        success: '#047857',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(15,23,42,0.06)',
        md: '0 8px 16px rgba(15,23,42,0.08)',
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      spacing: {
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
