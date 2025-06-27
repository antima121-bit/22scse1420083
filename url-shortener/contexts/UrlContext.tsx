"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import { useLogging, LogLevel } from "./LoggingContext"

export interface ClickData {
  timestamp: string
  referrer: string
  geoLocation?: {
    country?: string
    city?: string
    ip?: string
  }
}

export interface ShortenedUrl {
  id: string
  originalUrl: string
  shortcode: string
  createdAt: string
  expiresAt: string
  validityMinutes: number
  clickCount: number
  clicks: ClickData[]
  isExpired: boolean
}

interface UrlContextType {
  urls: ShortenedUrl[]
  shortenUrl: (originalUrl: string, validityMinutes?: number, customShortcode?: string) => Promise<ShortenedUrl>
  getUrlByShortcode: (shortcode: string) => ShortenedUrl | undefined
  recordClick: (shortcode: string, referrer: string) => Promise<void>
  deleteUrl: (id: string) => void
  clearAllUrls: () => void
}

const UrlContext = createContext<UrlContextType | undefined>(undefined)

export const useUrl = () => {
  const context = useContext(UrlContext)
  if (!context) {
    throw new Error("useUrl must be used within a UrlProvider")
  }
  return context
}

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [urls, setUrls] = React.useState<ShortenedUrl[]>([])
  const { log } = useLogging()

  // Load URLs from localStorage on mount
  React.useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem("url-shortener-urls") || "[]")
    setUrls(
      storedUrls.map((url: ShortenedUrl) => ({
        ...url,
        isExpired: new Date() > new Date(url.expiresAt),
      })),
    )
    log(LogLevel.INFO, "Loaded URLs from localStorage", { count: storedUrls.length })
  }, [log])

  // Save URLs to localStorage whenever urls change
  React.useEffect(() => {
    localStorage.setItem("url-shortener-urls", JSON.stringify(urls))
  }, [urls])

  const generateShortcode = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const isShortcodeUnique = (shortcode: string): boolean => {
    return !urls.some((url) => url.shortcode === shortcode)
  }

  const shortenUrl = async (
    originalUrl: string,
    validityMinutes = 30,
    customShortcode?: string,
  ): Promise<ShortenedUrl> => {
    log(LogLevel.INFO, "Attempting to shorten URL", { originalUrl, validityMinutes, customShortcode })

    // Check if we already have 5 active URLs
    const activeUrls = urls.filter((url) => !url.isExpired)
    if (activeUrls.length >= 5) {
      log(LogLevel.ERROR, "Maximum of 5 URLs reached")
      throw new Error("Maximum of 5 URLs can be shortened concurrently")
    }

    // Generate or validate shortcode
    let shortcode = customShortcode
    if (shortcode) {
      if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
        log(LogLevel.ERROR, "Invalid shortcode format", { shortcode })
        throw new Error("Shortcode must be alphanumeric")
      }
      if (!isShortcodeUnique(shortcode)) {
        log(LogLevel.ERROR, "Shortcode already exists", { shortcode })
        throw new Error("Shortcode already exists")
      }
    } else {
      do {
        shortcode = generateShortcode()
      } while (!isShortcodeUnique(shortcode))
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000)

    const newUrl: ShortenedUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortcode,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      validityMinutes,
      clickCount: 0,
      clicks: [],
      isExpired: false,
    }

    setUrls((prev) => [...prev, newUrl])
    log(LogLevel.INFO, "URL shortened successfully", { shortcode, originalUrl })

    return newUrl
  }

  const getUrlByShortcode = (shortcode: string): ShortenedUrl | undefined => {
    const url = urls.find((u) => u.shortcode === shortcode)
    if (url) {
      url.isExpired = new Date() > new Date(url.expiresAt)
    }
    return url
  }

  const getGeoLocation = async (): Promise<any> => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      return await response.json()
    } catch (error) {
      log(LogLevel.WARN, "Failed to get geo location", { error })
      return null
    }
  }

  const recordClick = async (shortcode: string, referrer: string): Promise<void> => {
    log(LogLevel.INFO, "Recording click", { shortcode, referrer })

    const geoLocation = await getGeoLocation()

    setUrls((prev) =>
      prev.map((url) => {
        if (url.shortcode === shortcode) {
          const clickData: ClickData = {
            timestamp: new Date().toISOString(),
            referrer,
            geoLocation,
          }
          return {
            ...url,
            clickCount: url.clickCount + 1,
            clicks: [...url.clicks, clickData],
          }
        }
        return url
      }),
    )

    log(LogLevel.INFO, "Click recorded successfully", { shortcode })
  }

  const deleteUrl = (id: string): void => {
    setUrls((prev) => prev.filter((url) => url.id !== id))
    log(LogLevel.INFO, "URL deleted", { id })
  }

  const clearAllUrls = (): void => {
    setUrls([])
    localStorage.removeItem("url-shortener-urls")
    log(LogLevel.INFO, "All URLs cleared")
  }

  return (
    <UrlContext.Provider
      value={{
        urls,
        shortenUrl,
        getUrlByShortcode,
        recordClick,
        deleteUrl,
        clearAllUrls,
      }}
    >
      {children}
    </UrlContext.Provider>
  )
}
