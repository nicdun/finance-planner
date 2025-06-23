import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Clock,
  PiggyBank,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React, { useState } from "react";

// Import education features
import { ChapterContent } from "@/features/education/ChapterContent";
import { LearningPathCard } from "@/features/education/LearningPathCard";
import { QuizComponent } from "@/features/education/QuizComponent";
import { DashboardHeader } from "../-components/DashboardHeader";

// Import database functions and utilities

export const Route = createFileRoute("/dashboard/education/")({
  component: RouteComponent,
});

// Types for education data
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  chapters: Chapter[];
  completionPercentage: number;
  icon: React.ReactNode;
  color: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  quiz: Quiz;
  completed: boolean;
  duration: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Mock data for learning paths
const mockLearningPaths: LearningPath[] = [
  {
    id: "budgeting-basics",
    title: "Budgetierung Grundlagen",
    description:
      "Lernen Sie die Grundlagen der persönlichen Budgetplanung und Ausgabenkontrolle",
    difficulty: "beginner",
    duration: "45 min",
    completionPercentage: 25,
    icon: <PiggyBank className="h-6 w-6" />,
    color: "bg-green-500",
    chapters: [
      {
        id: "budget-intro",
        title: "Was ist ein Budget?",
        description: "Grundlagen der Budgetierung verstehen",
        duration: "10 min",
        completed: true,
        content: `
          Ein Budget ist ein Finanzplan, der Ihre Einnahmen und Ausgaben über einen bestimmten Zeitraum aufzeigt. 
          Es hilft Ihnen dabei:
          
          • Ihre Finanzen zu kontrollieren
          • Sparziele zu erreichen
          • Schulden zu vermeiden
          • Bewusste Ausgabenentscheidungen zu treffen
          
          Ein gutes Budget folgt der 50/30/20-Regel:
          - 50% für Bedürfnisse (Miete, Lebensmittel, Transport)
          - 30% für Wünsche (Entertainment, Hobbys)
          - 20% für Sparen und Schuldenabbau
        `,
        quiz: {
          id: "budget-intro-quiz",
          questions: [
            {
              id: "q1",
              question: "Was ist die 50/30/20-Regel?",
              options: [
                "50% Sparen, 30% Bedürfnisse, 20% Wünsche",
                "50% Bedürfnisse, 30% Wünsche, 20% Sparen",
                "50% Wünsche, 30% Sparen, 20% Bedürfnisse",
                "50% Ausgaben, 30% Sparen, 20% Investieren",
              ],
              correctAnswer: 1,
              explanation:
                "Die 50/30/20-Regel besagt: 50% für Bedürfnisse, 30% für Wünsche und 20% für Sparen und Schuldenabbau.",
            },
          ],
        },
      },
      {
        id: "creating-budget",
        title: "Budget erstellen",
        description: "Schritt-für-Schritt Anleitung zur Budgeterstellung",
        duration: "15 min",
        completed: false,
        content: `
          So erstellen Sie Ihr erstes Budget:
          
          **Schritt 1: Einnahmen berechnen**
          - Gehalt nach Steuern
          - Zusätzliche Einnahmen
          - Unregelmäßige Einnahmen
          
          **Schritt 2: Ausgaben kategorisieren**
          - Fixe Kosten (Miete, Versicherungen)
          - Variable Kosten (Lebensmittel, Transport)
          - Diskretionäre Ausgaben (Entertainment)
          
          **Schritt 3: Budget aufstellen**
          - Prioritäten setzen
          - Sparziele definieren
          - Puffer einbauen
          
          **Schritt 4: Überwachen und anpassen**
          - Monatliche Überprüfung
          - Anpassungen vornehmen
          - Ziele verfolgen
        `,
        quiz: {
          id: "creating-budget-quiz",
          questions: [
            {
              id: "q1",
              question:
                "Was sollten Sie bei der Budgeterstellung als erstes tun?",
              options: [
                "Ausgaben kategorisieren",
                "Einnahmen berechnen",
                "Sparziele setzen",
                "Puffer einbauen",
              ],
              correctAnswer: 1,
              explanation:
                "Der erste Schritt ist die Berechnung Ihrer Einnahmen, um zu wissen, wie viel Geld Ihnen zur Verfügung steht.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "saving-strategies",
    title: "Strategisches Sparen",
    description: "Effektive Sparstrategien und den Aufbau eines Notgroschens",
    difficulty: "intermediate",
    duration: "60 min",
    completionPercentage: 0,
    icon: <Target className="h-6 w-6" />,
    color: "bg-blue-500",
    chapters: [
      {
        id: "emergency-fund",
        title: "Notgroschen aufbauen",
        description: "Wie Sie einen Notfallfonds aufbauen",
        duration: "20 min",
        completed: false,
        content: `
          Ein Notgroschen ist essentiell für Ihre finanzielle Sicherheit:
          
          **Warum einen Notgroschen?**
          - Schutz vor unerwarteten Ausgaben
          - Vermeidung von Schulden
          - Finanzielle Ruhe und Sicherheit
          
          **Wie viel sparen?**
          - Anfänger: 1.000€ als Startziel
          - Fortgeschrittene: 3-6 Monate Lebenshaltungskosten
          - Selbstständige: 6-12 Monate
          
          **Wo den Notgroschen anlegen?**
          - Tagesgeldkonto
          - Kurzfristig verfügbar
          - Sichere Anlage
          - Getrennt vom Girokonto
        `,
        quiz: {
          id: "emergency-fund-quiz",
          questions: [
            {
              id: "q1",
              question: "Wie hoch sollte ein Notgroschen mindestens sein?",
              options: ["500€", "1.000€", "5.000€", "10.000€"],
              correctAnswer: 1,
              explanation:
                "Für Anfänger ist 1.000€ ein gutes Startziel für den Notgroschen.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "investment-basics",
    title: "Investieren für Anfänger",
    description: "Grundlagen des Investierens und Vermögensaufbau",
    difficulty: "advanced",
    duration: "90 min",
    completionPercentage: 0,
    icon: <TrendingUp className="h-6 w-6" />,
    color: "bg-purple-500",
    chapters: [
      {
        id: "investment-intro",
        title: "Was ist Investieren?",
        description: "Grundlagen und Prinzipien des Investierens",
        duration: "25 min",
        completed: false,
        content: `
          Investieren bedeutet, Geld anzulegen, um es zu vermehren:
          
          **Grundprinzipien:**
          - Zeit im Markt schlägt Market Timing
          - Diversifikation reduziert Risiko
          - Langfristig denken
          - Kosten minimieren
          
          **Anlageklassen:**
          - Aktien (höhere Rendite, höheres Risiko)
          - Anleihen (niedrigere Rendite, niedrigeres Risiko)
          - Immobilien (Inflationsschutz)
          - Rohstoffe (Diversifikation)
          
          **Risiko vs. Rendite:**
          Je höher die erwartete Rendite, desto höher das Risiko.
          Verstehen Sie Ihre Risikobereitschaft!
        `,
        quiz: {
          id: "investment-intro-quiz",
          questions: [
            {
              id: "q1",
              question: "Was ist das wichtigste Prinzip beim Investieren?",
              options: [
                "Schnelle Gewinne erzielen",
                "Zeit im Markt schlägt Market Timing",
                "Nur in eine Aktie investieren",
                "Täglich handeln",
              ],
              correctAnswer: 1,
              explanation:
                "Zeit im Markt ist wichtiger als der perfekte Einstiegszeitpunkt. Langfristiges Investieren führt meist zu besseren Ergebnissen.",
            },
          ],
        },
      },
    ],
  },
];

function RouteComponent() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [learningPaths, setLearningPaths] =
    useState<LearningPath[]>(mockLearningPaths);

  const handleStartPath = (path: LearningPath) => {
    setSelectedPath(path);
    setCurrentChapter(path.chapters[0]);
  };

  const handleNextChapter = () => {
    if (!selectedPath || !currentChapter) return;

    const currentIndex = selectedPath.chapters.findIndex(
      (ch) => ch.id === currentChapter.id
    );
    if (currentIndex < selectedPath.chapters.length - 1) {
      setCurrentChapter(selectedPath.chapters[currentIndex + 1]);
      setShowQuiz(false);
    }
  };

  const handlePrevChapter = () => {
    if (!selectedPath || !currentChapter) return;

    const currentIndex = selectedPath.chapters.findIndex(
      (ch) => ch.id === currentChapter.id
    );
    if (currentIndex > 0) {
      setCurrentChapter(selectedPath.chapters[currentIndex - 1]);
      setShowQuiz(false);
    }
  };

  const handleCompleteChapter = () => {
    if (!selectedPath || !currentChapter) return;

    // Mark chapter as completed
    const updatedPaths = learningPaths.map((path) => {
      if (path.id === selectedPath.id) {
        const updatedChapters = path.chapters.map((ch) =>
          ch.id === currentChapter.id ? { ...ch, completed: true } : ch
        );
        const completedCount = updatedChapters.filter(
          (ch) => ch.completed
        ).length;
        const completionPercentage = Math.round(
          (completedCount / updatedChapters.length) * 100
        );

        return { ...path, chapters: updatedChapters, completionPercentage };
      }
      return path;
    });

    setLearningPaths(updatedPaths);
    setSelectedPath(updatedPaths.find((p) => p.id === selectedPath.id) || null);
  };

  const handleBackToOverview = () => {
    setSelectedPath(null);
    setCurrentChapter(null);
    setShowQuiz(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {!selectedPath ? (
                // Learning Paths Overview
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Finanzielle Bildung
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Erweitern Sie Ihr Finanzwissen mit interaktiven Lernpfaden
                      und praktischen Übungen
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {
                                  learningPaths.filter(
                                    (p) => p.completionPercentage > 0
                                  ).length
                                }
                              </p>
                              <p className="text-sm text-gray-600">
                                Gestartete Kurse
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {learningPaths.reduce((total, path) => {
                                  const completedChapters =
                                    path.chapters.filter(
                                      (ch) => ch.completed
                                    ).length;
                                  return total + completedChapters * 15; // Annahme: 15 Min pro Kapitel
                                }, 0)}
                                min
                              </p>
                              <p className="text-sm text-gray-600">Lernzeit</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Award className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {learningPaths.reduce(
                                  (total, path) =>
                                    total +
                                    path.chapters.filter((ch) => ch.completed)
                                      .length,
                                  0
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                Abgeschlossene Kapitel
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Learning Paths */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Lernpfade
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {learningPaths.map((path, index) => (
                        <motion.div
                          key={path.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <LearningPathCard
                            path={path}
                            onStartPath={() => handleStartPath(path)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Chapter View
                <motion.div
                  key="chapter"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Chapter Header */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={handleBackToOverview}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Zurück zur Übersicht
                    </Button>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3" />
                        {selectedPath.difficulty === "beginner" && "Anfänger"}
                        {selectedPath.difficulty === "intermediate" &&
                          "Fortgeschritten"}
                        {selectedPath.difficulty === "advanced" && "Experte"}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {selectedPath.title}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {selectedPath.completionPercentage}% abgeschlossen
                          </span>
                        </div>
                        <Progress
                          value={selectedPath.completionPercentage}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            Kapitel{" "}
                            {selectedPath.chapters.findIndex(
                              (ch) => ch.id === currentChapter?.id
                            ) + 1}{" "}
                            von {selectedPath.chapters.length}
                          </span>
                          <span>{currentChapter?.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chapter Content */}
                  {currentChapter && !showQuiz && (
                    <ChapterContent
                      chapter={currentChapter}
                      onShowQuiz={() => setShowQuiz(true)}
                      onNext={handleNextChapter}
                      onPrevious={handlePrevChapter}
                      hasNext={
                        selectedPath.chapters.findIndex(
                          (ch) => ch.id === currentChapter.id
                        ) <
                        selectedPath.chapters.length - 1
                      }
                      hasPrevious={
                        selectedPath.chapters.findIndex(
                          (ch) => ch.id === currentChapter.id
                        ) > 0
                      }
                    />
                  )}

                  {/* Quiz */}
                  {currentChapter && showQuiz && (
                    <QuizComponent
                      quiz={currentChapter.quiz}
                      onComplete={handleCompleteChapter}
                      onBack={() => setShowQuiz(false)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
