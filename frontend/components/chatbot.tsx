"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, BarChart3, FileText, TrendingUp, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import DashboardRenderer from "./dashboard-renderer"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  intent?: string
  timestamp: Date
  dashboardConfig?: any
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Tôi là AI Assistant của hệ thống ERP-MCP. Tôi có thể giúp bạn:\n\n• Truy vấn doanh thu và báo cáo tài chính\n• Dự báo doanh thu với AI\n• Tạo dashboard tùy chỉnh\n• Phân tích dữ liệu ERP\n• Tìm kiếm thông tin trong tài liệu\n\nHãy hỏi tôi bất cứ điều gì!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case "revenue_query":
        return <BarChart3 className="h-4 w-4" />
      case "forecast":
        return <TrendingUp className="h-4 w-4" />
      case "document_qa":
        return <FileText className="h-4 w-4" />
      case "create_dashboard":
      case "analytics":
        return <LayoutDashboard className="h-4 w-4" />
      default:
        return null
    }
  }

  const getIntentLabel = (intent?: string) => {
    switch (intent) {
      case "revenue_query":
        return "Truy vấn doanh thu"
      case "forecast":
        return "Dự báo AI"
      case "document_qa":
        return "Tìm kiếm tài liệu"
      case "create_dashboard":
        return "Tạo dashboard"
      case "analytics":
        return "Phân tích dữ liệu"
      default:
        return null
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversation_history: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        intent: data.intent,
        timestamp: new Date(),
        dashboardConfig: data.dashboard_config,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-[700px] flex flex-col shadow-lg border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          AI Assistant - MCP Orchestrator
        </CardTitle>
        <CardDescription className="text-base">
          Hỏi đáp thông minh trên dữ liệu ERP với AI • Tạo dashboard tự động • Phân tích xu hướng
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-6 scrollbar-thin" ref={scrollRef}>
          <div className="space-y-6">{messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`flex flex-col gap-2 max-w-[85%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                        : "bg-card border-2"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Render Dashboard if config exists */}
                  {message.dashboardConfig && (
                    <div className="w-full mt-4">
                      <DashboardRenderer config={message.dashboardConfig} />
                    </div>
                  )}
                  
                  {message.intent && (
                    <Badge variant="secondary" className="text-xs">
                      {getIntentIcon(message.intent)}
                      <span className="ml-1">{getIntentLabel(message.intent)}</span>
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString("vi-VN")}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-xl bg-muted/50 border px-4 py-2 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-6 bg-muted/30">
          <div className="flex gap-3">
            <Input
              placeholder="Hỏi về doanh thu, dự báo, tạo dashboard..."
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Thử:</span>
            {["Doanh thu tháng 9?", "Dự báo Q4", "Tạo dashboard"].map((example) => (
              <button
                key={example}
                onClick={() => setInput(example)}
                className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
