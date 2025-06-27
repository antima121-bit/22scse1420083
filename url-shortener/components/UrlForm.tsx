"use client"

import React from "react"
import { Box, TextField, Button, Alert, CircularProgress, InputAdornment, FormHelperText } from "@mui/material"
import { Add } from "@mui/icons-material"
import { useUrl } from "@/contexts/UrlContext"
import { useLogging, LogLevel } from "@/contexts/LoggingContext"

const UrlForm: React.FC = () => {
  const [originalUrl, setOriginalUrl] = React.useState("")
  const [validityMinutes, setValidityMinutes] = React.useState("30")
  const [customShortcode, setCustomShortcode] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  const { shortenUrl, urls } = useUrl()
  const { log } = useLogging()

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateShortcode = (shortcode: string): string | null => {
    if (!shortcode) return null
    if (shortcode.length < 3 || shortcode.length > 20) {
      return "Shortcode must be between 3 and 20 characters"
    }
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return "Shortcode must contain only letters and numbers"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!originalUrl.trim()) {
      setError("Please enter a URL")
      return
    }

    if (!validateUrl(originalUrl)) {
      setError("Please enter a valid URL (include http:// or https://)")
      return
    }

    const validity = Number.parseInt(validityMinutes)
    if (isNaN(validity) || validity < 1 || validity > 10080) {
      // Max 1 week
      setError("Validity must be between 1 and 10080 minutes (1 week)")
      return
    }

    const shortcodeError = validateShortcode(customShortcode)
    if (shortcodeError) {
      setError(shortcodeError)
      return
    }

    // Check if we already have 5 active URLs
    const activeUrls = urls.filter((url) => !url.isExpired)
    if (activeUrls.length >= 5) {
      setError("Maximum of 5 URLs can be shortened concurrently")
      return
    }

    setLoading(true)
    log(LogLevel.INFO, "Submitting URL form", { originalUrl, validityMinutes: validity, customShortcode })

    try {
      const result = await shortenUrl(originalUrl, validity, customShortcode || undefined)
      setSuccess(`URL shortened successfully! Short code: ${result.shortcode}`)

      // Reset form
      setOriginalUrl("")
      setValidityMinutes("30")
      setCustomShortcode("")

      log(LogLevel.INFO, "URL form submitted successfully", { shortcode: result.shortcode })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      log(LogLevel.ERROR, "URL form submission failed", { error: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="https://example.com/very/long/url"
        fullWidth
        required
        error={!!error && error.includes("URL")}
        InputProps={{
          startAdornment: <InputAdornment position="start">🔗</InputAdornment>,
        }}
      />

      <TextField
        label="Validity (minutes)"
        type="number"
        value={validityMinutes}
        onChange={(e) => setValidityMinutes(e.target.value)}
        fullWidth
        inputProps={{ min: 1, max: 10080 }}
        helperText="How long the short URL should remain active (1-10080 minutes)"
      />

      <TextField
        label="Custom Shortcode (optional)"
        value={customShortcode}
        onChange={(e) => setCustomShortcode(e.target.value)}
        placeholder="mylink123"
        fullWidth
        error={!!error && error.includes("Shortcode")}
        helperText="3-20 characters, letters and numbers only"
      />

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading || urls.filter((url) => !url.isExpired).length >= 5}
        startIcon={loading ? <CircularProgress size={20} /> : <Add />}
        sx={{ mt: 1 }}
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </Button>

      <FormHelperText>Active URLs: {urls.filter((url) => !url.isExpired).length}/5</FormHelperText>
    </Box>
  )
}

export default UrlForm
