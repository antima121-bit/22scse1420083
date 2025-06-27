"use client"

import React from "react"
import { Box, Typography, Paper, Grid, useTheme, useMediaQuery, Alert } from "@mui/material"
import UrlForm from "@/components/UrlForm"
import UrlList from "@/components/UrlList"
import { useUrl } from "@/contexts/UrlContext"
import { useLogging, LogLevel } from "@/contexts/LoggingContext"

const UrlShortenerPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { urls } = useUrl()
  const { log } = useLogging()

  React.useEffect(() => {
    log(LogLevel.INFO, "URL Shortener page loaded")
  }, [log])

  const activeUrls = urls.filter((url) => !url.isExpired)

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Shorten up to 5 URLs with custom expiry and analytics tracking
      </Typography>

      {activeUrls.length >= 5 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have reached the maximum of 5 concurrent shortened URLs. Delete or wait for some to expire before creating
          new ones.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Short URL
            </Typography>
            <UrlForm />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Shortened URLs ({activeUrls.length}/5)
            </Typography>
            <UrlList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UrlShortenerPage
