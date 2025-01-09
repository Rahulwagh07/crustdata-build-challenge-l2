'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"

export function SlackForm({ onClose }: {onClose: () => void}) {
  const [isLoading, setIsLoading] = useState(false)
  const [slackChannelId, setSlackChannelId] = useState("")

  useEffect(() => {
    return () => {
      setSlackChannelId("")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/knowledge/slack`, {
        channel: slackChannelId,
      })
      toast.success("Slack messages imported")
      onClose()
    } catch (error) {
      console.log("Error submitting Slack channel:", error)
      if (error instanceof AxiosError) {
        console.log("Error submitting Slack channel:", error);
        if (error.response?.status === 422) {
          toast.error("Slack channel not found");
          return;
        }
        if (error.response?.status === 409) {
          toast.error("Bot has no access to the channel");
          return;
        }
      }
      toast.error("Error importing Slack messages");
    }
    finally {
      setIsLoading(false)
    }
  }
 
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slack-channel">Slack Channel ID</Label>
          <Input
            id="slack-channel"
            value={slackChannelId}
            required
            minLength={4}
            maxLength={20}
            onChange={(e) => setSlackChannelId(e.target.value)}
          />
        </div>
        <Button type="submit"   variant="secondary" disabled={isLoading} className="w-full   font-medium">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Import Messages"
          )}
        </Button>
      </form>
    </>
  );
}

