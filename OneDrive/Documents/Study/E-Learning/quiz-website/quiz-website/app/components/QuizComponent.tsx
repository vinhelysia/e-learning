"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react"
import type { Lesson, Question } from "../data/lessons"
import { lessons } from "../data/lessons"

interface QuizComponentProps {
  lesson: Lesson
  onBack: () => void
}

interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  selectedAnswer: number | null
  showResult: boolean
  score: number
  answers: (number | null)[]
  isCompleted: boolean
}

export default function QuizComponent({ lesson, onBack }: QuizComponentProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    showResult: false,
    score: 0,
    answers: [],
    isCompleted: false,
  })

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize quiz
  useEffect(() => {
    let questionsToUse: Question[] = []

    if (lesson.id === -1) {
      // Random quiz from all lessons
      const allQuestions = lessons.flatMap((l) => l.questions)
      questionsToUse = shuffleArray(allQuestions).slice(0, 15)
    } else {
      // Specific lesson quiz
      questionsToUse = shuffleArray([...lesson.questions]).slice(0, 10)
    }

    // Shuffle answers for each question
    const questionsWithShuffledAnswers = questionsToUse.map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }))

    setQuizState({
      questions: questionsWithShuffledAnswers,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResult: false,
      score: 0,
      answers: new Array(questionsWithShuffledAnswers.length).fill(null),
      isCompleted: false,
    })
  }, [lesson])

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex]

  const handleAnswerSelect = (answerIndex: number) => {
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (quizState.selectedAnswer === null) return

    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestionIndex] = quizState.selectedAnswer

    const isCorrect = currentQuestion.options[quizState.selectedAnswer] === currentQuestion.correctAnswer
    const newScore = quizState.score + (isCorrect ? 1 : 0)

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null,
        score: newScore,
        answers: newAnswers,
      }))
    } else {
      setQuizState((prev) => ({
        ...prev,
        score: newScore,
        answers: newAnswers,
        isCompleted: true,
        showResult: true,
      }))
    }
  }

  const handleShowResult = () => {
    setQuizState((prev) => ({ ...prev, showResult: !prev.showResult }))
  }

  const handleRestart = () => {
    const questionsWithShuffledAnswers = quizState.questions.map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }))

    setQuizState({
      questions: shuffleArray(questionsWithShuffledAnswers),
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResult: false,
      score: 0,
      answers: new Array(questionsWithShuffledAnswers.length).fill(null),
      isCompleted: false,
    })
  }

  if (quizState.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  const progressPercentage =
    ((quizState.currentQuestionIndex + (quizState.isCompleted ? 1 : 0)) / quizState.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{lesson.id === -1 ? "Quiz Tổng Hợp" : lesson.title}</h1>
            <p className="text-sm text-gray-600">
              Câu {quizState.currentQuestionIndex + 1} / {quizState.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            {quizState.isCompleted && (
              <Button variant="outline" size="sm" onClick={handleShowResult}>
                <Trophy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Tiến độ: {Math.round(progressPercentage)}%</span>
            <span>
              Điểm: {quizState.score}/{quizState.questions.length}
            </span>
          </div>
        </div>

        {/* Quiz Content */}
        {!quizState.showResult ? (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Câu hỏi {quizState.currentQuestionIndex + 1}</Badge>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
              </div>
              <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={quizState.selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleNextQuestion} disabled={quizState.selectedAnswer === null}>
                  {quizState.currentQuestionIndex < quizState.questions.length - 1 ? "Câu tiếp theo" : "Hoàn thành"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Results */
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Kết quả Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">
                  {quizState.score}/{quizState.questions.length}
                </div>
                <div className="text-lg mb-4">
                  Điểm số: {Math.round((quizState.score / quizState.questions.length) * 100)}%
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleRestart}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Làm lại
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Về trang chủ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Chi tiết kết quả:</h3>
              {quizState.questions.map((question, index) => {
                const userAnswer = quizState.answers[index]
                const isCorrect = userAnswer !== null && question.options[userAnswer] === question.correctAnswer

                return (
                  <Card key={index} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            Câu {index + 1}: {question.question}
                          </p>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Đáp án của bạn:</span>{" "}
                              <span
                                className={
                                  userAnswer !== null
                                    ? isCorrect
                                      ? "text-green-600"
                                      : "text-red-600"
                                    : "text-gray-500"
                                }
                              >
                                {userAnswer !== null ? question.options[userAnswer] : "Không trả lời"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="font-medium">Đáp án đúng:</span>{" "}
                                <span className="text-green-600">{question.correctAnswer}</span>
                              </p>
                            )}
                            {question.explanation && (
                              <p className="text-gray-600 mt-2">
                                <span className="font-medium">Giải thích:</span> {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
