import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary
        'primary':                    '#00694d',
        'primary-dim':                '#005b43',
        'primary-container':          '#9ef4d0',
        'primary-fixed':              '#9ef4d0',
        'primary-fixed-dim':          '#91e5c2',
        'on-primary':                 '#c7ffe5',
        'on-primary-container':       '#005e44',
        'on-primary-fixed':           '#004935',
        'on-primary-fixed-variant':   '#00694d',
        'inverse-primary':            '#9ef4d0',
        // Secondary
        'secondary':                  '#00647e',
        'secondary-dim':              '#00576e',
        'secondary-container':        '#94dffe',
        'secondary-fixed':            '#94dffe',
        'secondary-fixed-dim':        '#86d0ef',
        'on-secondary':               '#e3f6ff',
        'on-secondary-container':     '#005065',
        'on-secondary-fixed':         '#003b4c',
        'on-secondary-fixed-variant': '#005a72',
        // Tertiary
        'tertiary':                   '#a23802',
        'tertiary-dim':               '#8f3000',
        'tertiary-container':         '#ff946b',
        'tertiary-fixed':             '#ff946b',
        'tertiary-fixed-dim':         '#ff7e4a',
        'on-tertiary':                '#ffefeb',
        'on-tertiary-container':      '#5b1b00',
        'on-tertiary-fixed':          '#310b00',
        'on-tertiary-fixed-variant':  '#6a2100',
        // Surface
        'surface':                    '#d7fff3',
        'surface-bright':             '#d7fff3',
        'surface-dim':                '#8de5cf',
        'surface-variant':            '#9aecd7',
        'surface-tint':               '#00694d',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#bdfeec',
        'surface-container':          '#b0f6e3',
        'surface-container-high':     '#a5f1dd',
        'surface-container-highest':  '#9aecd7',
        'on-surface':                 '#00362c',
        'on-surface-variant':         '#2d6558',
        'inverse-surface':            '#00110d',
        'inverse-on-surface':         '#70a899',
        // Outline
        'outline':                    '#4a8173',
        'outline-variant':            '#80b8a9',
        // Error
        'error':                      '#b31b25',
        'error-dim':                  '#9f0519',
        'error-container':            '#fb5151',
        'on-error':                   '#ffefee',
        'on-error-container':         '#570008',
        // Background (alias to surface)
        'background':                 '#d7fff3',
        'on-background':              '#00362c',
      },
      fontFamily: {
        jakarta:  ['"Plus Jakarta Sans"', 'sans-serif'],
        inter:    ['Inter', 'sans-serif'],
        // Stitch HTML aliases
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg:      '2rem',
        xl:      '3rem',
        full:    '9999px',
      },
    },
  },
  plugins: [forms],
}
