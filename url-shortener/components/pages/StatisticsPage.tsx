"use client"

import React from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import { ExpandMore, ExpandLess, Launch, Delete, ContentCopy } from "@mui/icons-material"
import { useUrl } from "@/contexts/UrlContext"
import { useLogging, LogLevel } from "@/contexts/LoggingContext"
import { format } from "date-fns"

const StatisticsPage: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { urls, deleteUrl } = useUrl()
  const { log } = useLogging()
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    log(LogLevel.INFO, "Statistics page loaded")
  }, [log])

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      log(LogLevel.INFO, "Copied to clipboard", { text })
    } catch (error) {
      log(LogLevel.ERROR, "Failed to copy to clipboard", { error })
    }
  }

  const handleDelete = (id: string) => {
    deleteUrl(id)
    log(LogLevel.INFO, "URL deleted from statistics page", { id })
  }

  const testRedirect = (shortcode: string) => {
    const url = `${window.location.origin}/${shortcode}`
    window.open(url, "_blank")
    log(LogLevel.INFO, "Testing redirect", { shortcode })
  }

  if (urls.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h4" gutterBottom>
          No URLs Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create some shortened URLs to see statistics here.
        </Typography>
      </Box>
    )
  }

  if (isMobile) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Statistics
        </Typography>
        <Grid container spacing={2}>
          {urls.map((url) => (
            <Grid item xs={12} key={url.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="div" sx={{ wordBreak: "break-all" }}>
                      /{url.shortcode}
                    </Typography>
                    <Chip
                      label={url.isExpired ? "Expired" : "Active"}
                      color={url.isExpired ? "error" : "success"}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, wordBreak: "break-all" }}>
                    {url.originalUrl}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Created: {format(new Date(url.createdAt), "MMM dd, yyyy HH:mm")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Expires: {format(new Date(url.expiresAt), "MMM dd, yyyy HH:mm")}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    {url.clickCount} clicks
                  </Typography>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(`${window.location.origin}/${url.shortcode}`)}
                      title="Copy short URL"
                    >
                      <ContentCopy />
                    </IconButton>
                    <IconButton size="small" onClick={() => testRedirect(url.shortcode)} title="Test redirect">
                      <Launch />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(url.id)} title="Delete URL" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Statistics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Detailed analytics for all your shortened URLs
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="center">Clicks</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <React.Fragment key={url.id}>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      /{url.shortcode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {url.originalUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={url.isExpired ? "Expired" : "Active"}
                      color={url.isExpired ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{format(new Date(url.createdAt), "MMM dd, HH:mm")}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{format(new Date(url.expiresAt), "MMM dd, HH:mm")}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" color="primary">
                      {url.clickCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(`${window.location.origin}/${url.shortcode}`)}
                        title="Copy short URL"
                      >
                        <ContentCopy />
                      </IconButton>
                      <IconButton size="small" onClick={() => testRedirect(url.shortcode)} title="Test redirect">
                        <Launch />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(url.id)} title="Delete URL" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpansion(url.id)}
                      disabled={url.clicks.length === 0}
                    >
                      {expandedRows.has(url.id) ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedRows.has(url.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Click Details
                        </Typography>
                        {url.clicks.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No clicks recorded yet
                          </Typography>
                        ) : (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Referrer</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks.map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>{format(new Date(click.timestamp), "MMM dd, yyyy HH:mm:ss")}</TableCell>
                                  <TableCell>{click.referrer || "Direct"}</TableCell>
                                  <TableCell>
                                    {click.geoLocation
                                      ? `${click.geoLocation.city || "Unknown"}, ${click.geoLocation.country || "Unknown"}`
                                      : "Unknown"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default StatisticsPage
