"use client"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UrlProvider } from "@/contexts/UrlContext"
import { LoggingProvider } from "@/contexts/LoggingContext"
import Layout from "@/components/Layout"
import UrlShortenerPage from "@/components/pages/UrlShortenerPage"
import StatisticsPage from "@/components/pages/StatisticsPage"
import RedirectHandler from "@/components/RedirectHandler"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoggingProvider>
        <UrlProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<UrlShortenerPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/:shortcode" element={<RedirectHandler />} />
              </Routes>
            </Layout>
          </Router>
        </UrlProvider>
      </LoggingProvider>
    </ThemeProvider>
  )
}
