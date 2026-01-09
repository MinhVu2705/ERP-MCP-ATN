"use client"

import { useState } from "react"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DataUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string; recordsImported?: number } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await fetch("http://localhost:8080/api/data/upload-csv", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Upload successful",
          recordsImported: data.recordsImported,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Upload failed",
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Network error",
      })
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu?")) return

    try {
      const response = await fetch("http://localhost:8080/api/data/clear", {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Đã xóa toàn bộ dữ liệu",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Xóa dữ liệu thất bại",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Lỗi kết nối",
      })
    }
  }

  return (
    <Card className="border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/10 dark:via-blue-950/10 dark:to-cyan-950/10 opacity-50" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          Import Dữ liệu ERP
        </CardTitle>
        <CardDescription className="text-base">
          Upload file CSV để nhập dữ liệu giao dịch, doanh thu, chi phí vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div className="group border-2 border-dashed rounded-2xl p-6 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold">
                      {file ? file.name : "Chọn file CSV hoặc kéo thả vào đây"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {file ? `${(file.size / 1024).toFixed(2)} KB` : "Hỗ trợ file CSV với định dạng: Date, Customer, Revenue, Cost..."}
                    </p>
                  </div>
                </div>
              </div>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="min-w-[140px] h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload
              </>
            )}
          </Button>
        </div>

        {progress > 0 && (
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <Progress value={progress} className="h-3" />
            <p className="text-sm font-semibold text-center text-primary">{progress}% - Đang xử lý dữ liệu...</p>
          </div>
        )}

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message}
              {result.recordsImported && ` - ${result.recordsImported} bản ghi đã được nhập`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang upload...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Import
              </>
            )}
          </Button>
          
          <Button
            onClick={handleClearData}
            variant="destructive"
            disabled={uploading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa dữ liệu
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
