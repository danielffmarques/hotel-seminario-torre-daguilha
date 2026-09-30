/**
 * Hotel Seminário Torre d'Aguilha - Tailwind CSS Configuration
 * Configuração centralizada de temas, cores oficiais e tipografia.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#173A46',
          dark: '#0F242C',
          light: '#214E5D',
        },
        secondary: {
          DEFAULT: '#547985',
          dark: '#43626C',
          light: '#7094A0',
        },
        brand: {
          DEFAULT: '#173A46',
          light: '#547985',
          dark: '#0F242C',
        },
        accent: {
          DEFAULT: '#C5A880',
          dark: '#A88B63',
          light: '#CB856E',
        },
        terracotta: {
          DEFAULT: '#C5A880',
          dark: '#A88B63',
          light: '#CB856E',
        },
        sand: {
          DEFAULT: '#E9E1D2',
          warm: '#E9E1D2',
          50: '#FAF9F6',
          100: '#F4EFE6',
          200: '#E9E1D2',
          300: '#D5C7B0',
        },
        charcoal: '#242A2C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    }
  }
};
