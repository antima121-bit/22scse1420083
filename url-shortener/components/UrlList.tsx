"use client"

import type React from "react"
import { Box, List, ListItem, IconButton, Typography, Chip, Tooltip, Alert, Paper } from "@mui/material"
import { ContentCopy, Launch, Delete, Schedule, BarChart } from "@mui/icons-material"
import { useUrl } from "@/contexts/UrlContext"
import { useLogging, LogLevel } from "@/contexts/LoggingContext"
import { formatDistanceToNow } from "date-fns"

const UrlList: React.FC = () => {
  const { urls, deleteUrl } = useUrl()
  const { log } = useLogging()

  const activeUrls = urls.filter((url) => !url.isExpired)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      log(LogLevel.INFO, "Copied short URL to clipboard", { text })
    } catch (error) {
      log(LogLevel.ERROR, "Failed to copy to clipboard", { error })
    }
  }

  const testRedirect = (shortcode: string) => {
    const url = `${window.location.origin}/${shortcode}`
    window.open(url, "_blank")
    log(LogLevel.INFO, "Testing redirect from URL list", { shortcode })
  }

  const handleDelete = (id: string, shortcode: string) => {
    deleteUrl(id)
    log(LogLevel.INFO, "URL deleted from URL list", { id, shortcode })
  }

  if (activeUrls.length === 0) {
    return <Alert severity="info">No active shortened URLs. Create one using the form on the left.</Alert>
  }

  return (
    <Box>
      <List>
        {activeUrls.map((url) => (
          <ListItem
            key={url.id}
            component={Paper}
            elevation={1}
            sx={{ mb: 2, flexDirection: "column", alignItems: "stretch", p: 2 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
              <Box flex={1} minWidth={0}>
                <Typography variant="h6" component="div" sx={{ fontFamily: "monospace", mb: 1 }}>
                  /{url.shortcode}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    mb: 1,
                  }}
                  title={url.originalUrl}
                >
                  {url.originalUrl}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                  <Chip
                    icon={<Schedule />}
                    label={`Expires ${formatDistanceToNow(new Date(url.expiresAt), { addSuffix: true })}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<BarChart />}
                    label={`${url.clickCount} clicks`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={0.5} ml={1}>
                <Tooltip title="Copy short URL">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(`${window.location.origin}/${url.shortcode}`)}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Test redirect">
                  <IconButton size="small" onClick={() => testRedirect(url.shortcode)}>
                    <Launch />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete URL">
                  <IconButton size="small" onClick={() => handleDelete(url.id, url.shortcode)} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default UrlList
