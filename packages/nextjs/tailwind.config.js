/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui"), require("tailwindcss-animate")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']", "class"],
  daisyui: {
    themes: [
      {
       light: {
         primary: "#93BBFB",
         "primary-content": "#212638",
         secondary: "#DAE8FF",
         "secondary-content": "#212638",
         accent: "#93BBFB",
         "accent-content": "#212638",
         neutral: "#212638",
         "neutral-content": "#ffffff",
         "base-100": "#ffffff",
         "base-200": "#f4f8ff",
         "base-300": "#DAE8FF",
         "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      {
        dark: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
           info: "#93BBFB",
           success: "#34EEB6",
           warning: "#FFCF72",
           error: "#FF8863",
           "--rounded-btn": "9999rem",
           ".tooltip": { "--tooltip-tail": "6px" },
           ".link": { textUnderlineOffset: "2px" },
           ".link:hover": { opacity: "80%" },
         },
        // dark: {
        //   primary: "rgb(7, 18, 41)",
        //   "primary-content": "#F9FBFF",
        //   secondary: "#323f61",
        //   "secondary-content": "#F9FBFF",
        //   accent: "#4969A6",
        //   "accent-content": "#F9FBFF",
        //   neutral: "#F9FBFF",
        //   "neutral-content": "#385183",
        //   "base-100": "#385183",
        //   "base-200": "#2A3655",
        //   "base-300": "#212638",
        //   "base-content": "#F9FBFF",
        //   info: "#385183",
        //   success: "#34EEB6",
        //   warning: "#FFCF72",
        //   error: "#FF8863",
        //   "--rounded-btn": "9999rem",
        //   ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
        //   ".link": { textUnderlineOffset: "2px" },
        //   ".link:hover": { opacity: "80%" },
        // },
      },
     {
        exampleUi: {
          primary: "#000000",
         "primary-content": "#ffffff",
          secondary: "#FF6644",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
           neutral: "#f3f3f3",
          "neutral-content": "#212638",
           "base-100": "#ffffff",
           "base-200": "#f1f1f1",
           "base-300": "#d0d0d0",
           "base-content": "#212638",
           info: "#93BBFB",
           success: "#34EEB6",
           warning: "#FFCF72",
           error: "#FF8863",
           "--rounded-btn": "9999rem",
           ".tooltip": {
           "--tooltip-tail": "6px",
           },
         },
       },
     ],
  },
  theme: {
  	extend: {
  		boxShadow: {
  			center: '0 0 12px -2px rgb(0 0 0 / 0.05)'
  		},
  		animation: {
  			'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
// //import type { Config } from 'tailwindcss';


// //const config: Config = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       gridTemplateColumns: {
//         '13': 'repeat(13, minmax(0, 1fr))',
//       },
//       colors: {
//         blue: {
//           400: '#2589FE',
//           500: '#0070F3',
//           600: '#2F6FEB',
//         },
//       },
//     },
//     keyframes: {
//       shimmer: {
//         '100%': {
//           transform: 'translateX(100%)',
//         },
//       },
//     },
//   },
//   plugins: [require('tailwindcss/forms')],
// };
// // export default config;
