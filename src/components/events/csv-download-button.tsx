'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface CSVDownloadButtonProps {
  eventId: string
}

export function CSVDownloadButton({ eventId }: CSVDownloadButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  async function handleDownload() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}/export`)
      if (!response.ok) throw new Error("Failed to download CSV")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `event-${eventId}-rsvps.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "RSVPs have been downloaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download RSVPs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Downloading..." : "Download CSV"}
    </Button>
  )
} 