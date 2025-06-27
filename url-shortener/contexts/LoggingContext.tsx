"use client"

import React, { createContext, useContext, type ReactNode } from "react"

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

interface LoggingContextType {
  log: (level: LogLevel, message: string, data?: any) => void
  getLogs: () => LogEntry[]
  clearLogs: () => void
}

const LoggingContext = createContext<LoggingContextType | undefined>(undefined)

export const useLogging = () => {
  const context = useContext(LoggingContext)
  if (!context) {
    throw new Error("useLogging must be used within a LoggingProvider")
  }
  return context
}

export const LoggingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = React.useState<LogEntry[]>([])

  const log = React.useCallback((level: LogLevel, message: string, data?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    setLogs((prev) => [...prev, entry])

    // Also store in localStorage for persistence
    const storedLogs = JSON.parse(localStorage.getItem("url-shortener-logs") || "[]")
    storedLogs.push(entry)
    // Keep only last 1000 logs
    if (storedLogs.length > 1000) {
      storedLogs.splice(0, storedLogs.length - 1000)
    }
    localStorage.setItem("url-shortener-logs", JSON.stringify(storedLogs))
  }, [])

  const getLogs = React.useCallback(() => {
    return logs
  }, [logs])

  const clearLogs = React.useCallback(() => {
    setLogs([])
    localStorage.removeItem("url-shortener-logs")
  }, [])

  // Load logs from localStorage on mount
  React.useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("url-shortener-logs") || "[]")
    setLogs(storedLogs)
  }, [])

  return <LoggingContext.Provider value={{ log, getLogs, clearLogs }}>{children}</LoggingContext.Provider>
}
