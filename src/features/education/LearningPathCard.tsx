import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { LearningPath } from "@/routes/dashboard/education";

interface LearningPathCardProps {
  path: LearningPath;
  onStartPath: () => void;
}

export function LearningPathCard({ path, onStartPath }: LearningPathCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Anfänger";
      case "intermediate":
        return "Fortgeschritten";
      case "advanced":
        return "Experte";
      default:
        return difficulty;
    }
  };

  const completedChapters = path.chapters.filter((ch) => ch.completed).length;
  const totalChapters = path.chapters.length;
  const isStarted = path.completionPercentage > 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Header with icon */}
        <div
          className={`h-20 ${path.color} flex items-center justify-center relative`}
        >
          <div className="text-white">{path.icon}</div>
          {isStarted && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Title and Badge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {path.title}
              </h3>
              <Badge className={getDifficultyColor(path.difficulty)}>
                {getDifficultyText(path.difficulty)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {path.description}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{path.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalChapters} Kapitel</span>
            </div>
          </div>

          {/* Progress */}
          {isStarted && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {completedChapters} von {totalChapters} Kapitel
                </span>
                <span className="font-medium text-blue-600">
                  {path.completionPercentage}%
                </span>
              </div>
              <Progress value={path.completionPercentage} className="h-2" />
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={onStartPath}
            className="w-full flex items-center justify-center gap-2 group"
            variant={isStarted ? "outline" : "default"}
          >
            {isStarted ? (
              <>
                <span>Fortsetzen</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Starten</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
