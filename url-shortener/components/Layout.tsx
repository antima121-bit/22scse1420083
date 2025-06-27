"use client"

import type React from "react"
import { AppBar, Toolbar, Typography, Container, Box, Button, useTheme, useMediaQuery } from "@mui/material"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { Link, BarChart } from "@mui/icons-material"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Link sx={{ mr: 2, color: "inherit" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<Link />}
              variant={location.pathname === "/" ? "outlined" : "text"}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Shorten" : "URL Shortener"}
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/statistics"
              startIcon={<BarChart />}
              variant={location.pathname === "/statistics" ? "outlined" : "text"}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "Stats" : "Statistics"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
