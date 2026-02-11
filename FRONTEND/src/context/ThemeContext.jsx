import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({
    toggleColorMode: () => { },
    mode: "light",
});

export const useColorMode = () => useContext(ColorModeContext);

const ThemeProvider = ({ children }) => {
    // Check local storage for saved theme preference
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem("themeMode");
        return savedMode ? savedMode : "light";
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === "light" ? "dark" : "light";
                    localStorage.setItem("themeMode", newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === "dark" ? "#009688" : "#10B981", // Emerald for light, Teal for dark
                    },
                    secondary: {
                        main: "#ff7043", // Coral
                    },
                    ...(mode === "dark" && {
                        background: {
                            default: "#121212",
                            paper: "#1e1e1e",
                        },
                    }),
                },
                typography: {
                    fontFamily: "Roboto, sans-serif",
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default ThemeProvider;
