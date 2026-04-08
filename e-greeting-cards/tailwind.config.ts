import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        headline: ['Cormorant Garamond', 'Playfair Display', 'Montserrat', 'serif'],
        body: ['Inter', 'Open Sans', 'Lato', 'sans-serif'],
        signature: ['Dancing Script', 'Pacifico', 'Great Vibes', 'cursive'],
      },
      fontWeight: {
        light: '300',
      },
      colors: {
        // Birthday theme
        birthday: {
          primary: '#FF6B9D',
          secondary: '#FFE66D',
          background: '#FFF5F7',
          accent: '#4ECDC4',
          text: '#2C3E50',
        },
        // Anniversary theme
        anniversary: {
          primary: '#C84B6E',
          secondary: '#FFB6C1',
          background: '#FFF0F3',
          accent: '#D4AF37',
          text: '#4A4A4A',
        },
        // Graduation theme
        graduation: {
          primary: '#2E5090',
          secondary: '#FFD700',
          background: '#F0F4F8',
          accent: '#00A8E8',
          text: '#1A1A1A',
        },
        // Thank You theme
        thankYou: {
          primary: '#6B8E23',
          secondary: '#F0E68C',
          background: '#FAFAF5',
          accent: '#FF6F61',
          text: '#333333',
        },
        // Congratulations theme
        congratulations: {
          primary: '#FF4500',
          secondary: '#FFD700',
          background: '#FFF8E7',
          accent: '#9370DB',
          text: '#2F4F4F',
        },
      },
      borderRadius: {
        card: '2rem',
        'card-lg': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.36, 0, 0.66, -0.56)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        '.preserve-3d': { 'transform-style': 'preserve-3d' },
        '.backface-hidden': { 'backface-visibility': 'hidden' },
        '.perspective-2000': { perspective: '2000px' },
      });
    },
  ],
};

export default config;
