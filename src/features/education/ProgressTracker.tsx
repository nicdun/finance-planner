import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Clock,
  Target,
  Award,
  CheckCircle,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react";
import { LearningPath } from "@/routes/dashboard/education";

interface ProgressTrackerProps {
  learningPaths: LearningPath[];
}

export function ProgressTracker({ learningPaths }: ProgressTrackerProps) {
  const totalChapters = learningPaths.reduce(
    (sum, path) => sum + path.chapters.length,
    0
  );
  const completedChapters = learningPaths.reduce(
    (sum, path) => sum + path.chapters.filter((ch) => ch.completed).length,
    0
  );
  const totalLearningTime = learningPaths.reduce((sum, path) => {
    const completedTime = path.chapters
      .filter((ch) => ch.completed)
      .reduce((time, ch) => time + parseInt(ch.duration), 0);
    return sum + completedTime;
  }, 0);

  const overallProgress =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;
  const startedPaths = learningPaths.filter(
    (path) => path.completionPercentage > 0
  );
  const completedPaths = learningPaths.filter(
    (path) => path.completionPercentage === 100
  );

  const achievements = [
    {
      id: "first-start",
      title: "Erste Schritte",
      description: "Ersten Lernpfad gestartet",
      icon: Star,
      unlocked: startedPaths.length > 0,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      id: "chapter-master",
      title: "Kapitel-Meister",
      description: "5 Kapitel abgeschlossen",
      icon: BookOpen,
      unlocked: completedChapters >= 5,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: "time-tracker",
      title: "Zeiterfasser",
      description: "60 Minuten Lernzeit",
      icon: Clock,
      unlocked: totalLearningTime >= 60,
      color: "text-green-600 bg-green-100",
    },
    {
      id: "path-completer",
      title: "Vollender",
      description: "Ersten Lernpfad abgeschlossen",
      icon: Trophy,
      unlocked: completedPaths.length > 0,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lernfortschritt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Gesamtfortschritt
              </span>
              <span className="text-sm font-bold text-blue-600">
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-xs text-gray-500">
              {completedChapters} von {totalChapters} Kapiteln abgeschlossen
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {startedPaths.length}
              </div>
              <div className="text-xs text-gray-600">Gestartete Pfade</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {completedChapters}
              </div>
              <div className="text-xs text-gray-600">
                Abgeschlossene Kapitel
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {totalLearningTime}
              </div>
              <div className="text-xs text-gray-600">Minuten gelernt</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {unlockedAchievements.length}
              </div>
              <div className="text-xs text-gray-600">Erfolge</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Path Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Lernpfad-Fortschritt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${path.color} rounded-lg flex items-center justify-center`}
                    >
                      <div className="text-white text-sm">{path.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {path.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {path.chapters.filter((ch) => ch.completed).length} von{" "}
                        {path.chapters.length} Kapitel
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {path.completionPercentage === 100 && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {path.completionPercentage}%
                    </span>
                  </div>
                </div>
                <Progress value={path.completionPercentage} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Erfolge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      achievement.unlocked
                        ? achievement.color
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        achievement.unlocked ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {achievement.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        achievement.unlocked ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Freigeschaltet
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
