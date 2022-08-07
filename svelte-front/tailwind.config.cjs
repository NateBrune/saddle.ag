const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',

  theme: {
    spacing: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
    },
    extend: {
      fontFamily: {
        serif: ['Open Sans', 'sans-serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        'blue': '#004e92',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        //'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
        'black': '#000428',
        'white': '#ffffff',
        'dark-teal': '#264653',
        'light-teal': '#2a9d8f',
        'light-orange': '#e9c46a',
        'orange': '#f4a261',
        'dark-orange': '#e76f51',
        'pinkish': '#de6161',
        'blueish': '#2657eb',
        'royal-black': '#141E30',
        'royal-blue': '#243B55',
        'gray-dark-complement': '#5A300D',

        //moonlit astroid
        'moonlit1': '#0F2027',
        'moonlit2': '#203A43',
        'moonlit3': '#2C5364',
      },
    }
  },
  /*
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {

    }
  },*/

  plugins: []
};

module.exports = config;
