import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  HelpCircle as QuizIcon,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  Lightbulb,
} from "lucide-react";
import { Quiz, Question } from "@/routes/dashboard/education";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: () => void;
  onBack: () => void;
}

export function QuizComponent({
  quiz,
  onComplete,
  onBack,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowResult(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowResult(selectedAnswers[currentQuestionIndex - 1] !== undefined);
      setShowExplanation(
        selectedAnswers[currentQuestionIndex - 1] !== undefined
      );
    }
  };

  const getScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: quiz.questions.length };
  };

  const isCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    return answerIndex === quiz.questions[questionIndex].correctAnswer;
  };

  const getAnswerClass = (answerIndex: number) => {
    if (!showResult) {
      return "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
    }

    const isSelected = selectedAnswers[currentQuestionIndex] === answerIndex;
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isSelected && isCorrect) {
      return "border-green-500 bg-green-50 text-green-900";
    } else if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50 text-red-900";
    } else if (isCorrect) {
      return "border-green-500 bg-green-50 text-green-900";
    } else {
      return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  if (quizCompleted) {
    const score = getScore();
    const percentage = Math.round((score.correct / score.total) * 100);
    const passed = percentage >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                {passed ? (
                  <Trophy className="h-10 w-10 text-green-600" />
                ) : (
                  <Target className="h-10 w-10 text-yellow-600" />
                )}
              </div>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {passed ? "Herzlichen Glückwunsch!" : "Gut gemacht!"}
              </h3>
              <p className="text-gray-600">
                {passed
                  ? "Sie haben das Quiz erfolgreich bestanden!"
                  : "Sie können das Quiz jederzeit wiederholen."}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {score.correct}
                </div>
                <div className="text-sm text-gray-600">Richtig</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">
                  {score.total - score.correct}
                </div>
                <div className="text-sm text-gray-600">Falsch</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    passed ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Ergebnis</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Kapitel
              </Button>
              {passed && (
                <Button onClick={onComplete}>
                  Kapitel abschließen
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <QuizIcon className="h-5 w-5 text-purple-600" />
              </div>
              Quiz
            </CardTitle>
            <Badge variant="outline">
              Frage {currentQuestionIndex + 1} von {quiz.questions.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  <div
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${getAnswerClass(
                      index
                    )}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && (
                        <div className="flex items-center">
                          {selectedAnswers[currentQuestionIndex] === index && (
                            <div className="w-6 h-6 rounded-full bg-current opacity-20 mr-2" />
                          )}
                          {index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {selectedAnswers[currentQuestionIndex] === index &&
                            index !== currentQuestion.correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-blue-50 border-blue-200">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Erklärung:</strong> {currentQuestion.explanation}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Vorherige Frage
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Zurück zum Kapitel
          </Button>
          {hasAnswered && (
            <Button
              onClick={handleNextQuestion}
              className="flex items-center gap-2"
            >
              {isLastQuestion ? "Quiz beenden" : "Nächste Frage"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
