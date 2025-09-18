import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Lil.Shunshine.Thrift brand colors - retro theme với vàng + đỏ đô
        vintage: {
          cream: '#FFFBF0',      // nền trắng/kem
          beige: '#F5F1E8',
          yellow: '#F4D03F',      // vàng nhạt chính
          gold: '#D4AF37',        // vàng đậm
          burgundy: '#8B0000',    // đỏ đô chính  
          darkBurgundy: '#660000', // đỏ đô đậm
          brown: '#8B4513',       // nâu cho dark mode
          darkBrown: '#654321',   // nâu đen
        },
        primary: {
          50: '#FFFBF0',   // cream lightest
          100: '#FFF8E1',  // cream light
          200: '#F5F1E8',  // cream
          300: '#E8DCC0',  // beige
          400: '#D4C2A0',  // light brown
          500: '#8B4513',  // main brown
          600: '#654321',  // dark brown
          700: '#4A3429',  // darker brown
          800: '#3C2A1F',  // darkest brown
          900: '#2D1F15',  // near black brown
        },
        accent: {
          50: '#FFFCF0',   // yellow lightest
          100: '#FFF8DC',  // yellow light
          200: '#F4D03F',  // main yellow
          300: '#D4AF37',  // gold
          400: '#B8860B',  // dark gold
          500: '#8B0000',  // main burgundy
          600: '#660000',  // dark burgundy
          700: '#4B0000',  // darker burgundy
          800: '#330000',  // darkest burgundy
          900: '#1A0000',  // near black burgundy
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'vintage-texture': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A0826D' fill-opacity='0.05'%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3Ccircle cx='45' cy='45' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      boxShadow: {
        'vintage': '0 4px 20px -2px rgba(160, 130, 109, 0.3)',
        'accent': '0 4px 20px -2px rgba(146, 43, 33, 0.3)',
        'inner-vintage': 'inset 0 2px 4px 0 rgba(160, 130, 109, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
