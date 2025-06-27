"use client"

import React from "react"
import { useParams, Navigate } from "react-router-dom"
import { Box, Typography, CircularProgress, Alert, Button, Paper } from "@mui/material"
import { Home, Refresh } from "@mui/icons-material"
import { useUrl } from "@/contexts/UrlContext"
import { useLogging, LogLevel } from "@/contexts/LoggingContext"

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>()
  const { getUrlByShortcode, recordClick } = useUrl()
  const { log } = useLogging()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [redirecting, setRedirecting] = React.useState(false)

  React.useEffect(() => {
    const handleRedirect = async () => {
      if (!shortcode) {
        setError("Invalid short code")
        setLoading(false)
        return
      }

      log(LogLevel.INFO, "Attempting to redirect", { shortcode })

      const url = getUrlByShortcode(shortcode)

      if (!url) {
        log(LogLevel.WARN, "Short code not found", { shortcode })
        setError("Short URL not found")
        setLoading(false)
        return
      }

      if (url.isExpired) {
        log(LogLevel.WARN, "Short code expired", { shortcode, expiresAt: url.expiresAt })
        setError("This short URL has expired")
        setLoading(false)
        return
      }

      try {
        // Record the click
        const referrer = document.referrer || "Direct"
        await recordClick(shortcode, referrer)

        log(LogLevel.INFO, "Click recorded, redirecting", { shortcode, originalUrl: url.originalUrl })

        setRedirecting(true)

        // Small delay to show the redirecting message
        setTimeout(() => {
          window.location.href = url.originalUrl
        }, 1000)
      } catch (error) {
        log(LogLevel.ERROR, "Failed to record click", { shortcode, error })
        setError("An error occurred while processing the redirect")
        setLoading(false)
      }
    }

    handleRedirect()
  }, [shortcode, getUrlByShortcode, recordClick, log])

  if (loading && !redirecting) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Processing redirect...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Validating short URL: /{shortcode}
        </Typography>
      </Box>
    )
  }

  if (redirecting) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom color="primary">
          Redirecting...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You will be redirected shortly. If nothing happens, please check if popups are blocked.
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
          <Typography variant="h4" gutterBottom color="error">
            Oops!
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The short URL "/{shortcode}" could not be processed.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button variant="contained" startIcon={<Home />} onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        </Paper>
      </Box>
    )
  }

  return <Navigate to="/" replace />
}

export default RedirectHandler
