import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Chapter } from "@/routes/dashboard/education";

interface ChapterContentProps {
  chapter: Chapter;
  onShowQuiz: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function ChapterContent({
  chapter,
  onShowQuiz,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: ChapterContentProps) {
  // Function to parse and format the content
  const formatContent = (content: string) => {
    const lines = content.trim().split("\n");
    const formattedContent: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine === "") {
        formattedContent.push(<br key={`br-${index}`} />);
      } else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        // Bold headers
        const text = trimmedLine.slice(2, -2);
        formattedContent.push(
          <h4
            key={index}
            className="text-lg font-semibold text-gray-900 mt-4 mb-2"
          >
            {text}
          </h4>
        );
      } else if (trimmedLine.startsWith("- ")) {
        // Bullet points
        const text = trimmedLine.slice(2);
        formattedContent.push(
          <li key={index} className="text-gray-700 leading-relaxed">
            {text}
          </li>
        );
      } else if (trimmedLine.startsWith("• ")) {
        // Bullet points with bullet symbol
        const text = trimmedLine.slice(2);
        formattedContent.push(
          <li
            key={index}
            className="text-gray-700 leading-relaxed list-disc ml-4"
          >
            {text}
          </li>
        );
      } else if (trimmedLine.length > 0) {
        // Regular paragraphs
        formattedContent.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-3">
            {trimmedLine}
          </p>
        );
      }
    });

    return formattedContent;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Chapter Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                {chapter.title}
              </CardTitle>
              <p className="text-gray-600">{chapter.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {chapter.completed && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Abgeschlossen
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {chapter.duration}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chapter Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-gray max-w-none">
            <div className="space-y-2">{formatContent(chapter.content)}</div>
          </div>

          {/* Call to action */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Wissen testen</h4>
                <p className="text-sm text-gray-600">
                  Überprüfen Sie Ihr Verständnis mit einem kurzen Quiz
                </p>
              </div>
            </div>
            <Button onClick={onShowQuiz} className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Quiz starten
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {hasPrevious && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Vorheriges Kapitel
            </Button>
          )}
        </div>
        <div>
          {hasNext && (
            <Button onClick={onNext} className="flex items-center gap-2">
              Nächstes Kapitel
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
