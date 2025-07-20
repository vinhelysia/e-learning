"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Trophy, RotateCcw } from "lucide-react"
import QuizComponent from "./components/QuizComponent"
import { lessons } from "./data/lessons"
import type { Lesson } from "./data/lessons"

export default function HomePage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const handleStartQuiz = (lessonId: number) => {
    setSelectedLesson(lessonId)
    setShowQuiz(true)
  }

  const handleBackToHome = () => {
    setShowQuiz(false)
    setSelectedLesson(null)
  }

  // Placeholder lesson for the “Quiz Tổng Hợp”
  const allLessonsPlaceholder: Lesson = {
    id: -1,
    title: "Quiz Tổng Hợp",
    description: "Câu hỏi ngẫu nhiên từ tất cả các bài học",
    topics: [],
    questions: [],
  }

  const lessonToPass = selectedLesson === -1 ? allLessonsPlaceholder : lessons[selectedLesson]

  if (showQuiz && selectedLesson !== null) {
    return <QuizComponent lesson={lessonToPass} onBack={handleBackToHome} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Kỹ Thuật Lập Trình</h1>
          <p className="text-lg text-gray-600 mb-4">Kiểm tra kiến thức của bạn với các câu hỏi ngẫu nhiên</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>Giảng viên: Thanh Việt</span>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    Bài {lesson.id}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {lesson.questions.length} câu hỏi
                  </Badge>
                </div>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                <CardDescription className="text-sm">{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <strong>Chủ đề chính:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {lesson.topics.slice(0, 3).map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                      {lesson.topics.length > 3 && (
                        <li className="text-gray-400">...và {lesson.topics.length - 3} chủ đề khác</li>
                      )}
                    </ul>
                  </div>
                  <Button onClick={() => handleStartQuiz(index)} className="w-full" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Bắt đầu Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Random Quiz Option */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Quiz Tổng Hợp
              </CardTitle>
              <CardDescription className="text-purple-100">Câu hỏi ngẫu nhiên từ tất cả các bài học</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleStartQuiz(-1)} variant="secondary" className="w-full">
                <Trophy className="w-4 h-4 mr-2" />
                Thử thách tổng hợp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
