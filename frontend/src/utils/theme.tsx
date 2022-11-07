import { createTheme } from "@mui/material";

export const customTheme = createTheme({
    palette: {
        primary: {
            light: '#707A74',
            main: '#4D5952',
            dark: '#353E39'
        },
        secondary: {
            light: '#C96F73',
            main: '#BC4B51',
            dark: '#833438'
        }
    },
    typography: {
        fontFamily: [
            "'Public Sans', sans-serif"
        ].join(','),
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 300,
            fontSize: "6.188rem",
            lineHeight: "6.438rem",
            letterSpacing: "-0.094rem"
        },
        h2: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 300,
            fontSize: "3.875rem",
            lineHeight: "4rem",
            letterSpacing: "-8rem"
        },
        h3: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "3.063rem",
            lineHeight: "3.313rem",
            letterSpacing: "0rem"
        },
        h4: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "2.188rem",
            lineHeight: "2.438rem",
            letterSpacing: "0.016rem"
        },
        h5: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "1.563rem",
            lineHeight: "1.813rem",
            letterSpacing: "0rem"
        },
        h6: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 500,
            fontSize: "1.313rem",
            lineHeight: "1.563rem",
            letterSpacing: "0.009rem"
        },
        subtitle1: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: "1.25rem",
            letterSpacing: "0.009rem"
        },
        subtitle2: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
            letterSpacing: "0.006rem"
        },
        body1: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 20,
            letterSpacing: "0.031rem"
        },
        body2: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
            letterSpacing: "0.016rem"
        },
        button: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
            letterSpacing: "0.078rem"
        },
        caption: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: "1rem",
            letterSpacing: "0.025rem"
        },
        overline: {
            fontFamily: "'Public Sans', sans-serif",
            fontWeight: 400,
            fontSize: "0.625rem",
            lineHeight: "0.875rem",
            letterSpacing: "0.094rem"
        },
    }
});