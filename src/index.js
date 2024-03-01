import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Runescape from './fonts/runescape.woff2';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

if(window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
    window.location = window.location.href.replace('http', 'https');
}

const theme = createTheme({
    typography: {
        fontFamily: 'Runescape, Arial',
        fontSize: 17,
        h1 : {
            fontSize: '3rem',
        },
        h2 : {
            fontSize: '2.5rem',
        },
    },
    palette: {
        // mode: 'dark',
        primary: {
            light: '#817664',
            main: '#62543E',
            dark: '#443a2b',
            contrastText: '#fff',
        },
        secondary: {
            light: '#d6c7aa',
            main: '#ccba95',
            dark: '#8e8268',
            contrastText: '#fff',
        },
        background: {
            default: '#d6c7aa',
            paper: '#ccba95',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: 'Runescape';
                    font-style: normal;
                    font-display: swap;
                    src: local('Runescape'), local('Raleway-Regular'), url(${Runescape}) format('woff2');
                    unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
                }
            `,
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#d6c7aa',
                }
            }
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
