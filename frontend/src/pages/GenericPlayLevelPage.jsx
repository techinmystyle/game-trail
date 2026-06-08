import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { levelsRegistry } from "../config/levelsRegistry";

// Import course-specific editor templates
import LevelTemplate from "../components/levels/LevelTemplate"; // html
import CSSLevelTemplate from "../components/levels/CSSLevelTemplate"; // css
import JSLevelTemplate from "../components/levels/JSLevelTemplate"; // javascript
import PythonLevelTemplate from "../components/levels/PythonLevelTemplate"; // python
import JavaLevelTemplate from "../components/levels/JavaLevelTemplate"; // java

const TEMPLATE_MAP = {
  html: LevelTemplate,
  css: CSSLevelTemplate,
  javascript: JSLevelTemplate,
  python: PythonLevelTemplate,
  java: JavaLevelTemplate,
};

export const GenericPlayLevelPage = () => {
  const { courseId, phaseId, levelId } = useParams();

  // Extract numbers from strings like "phase1" and "level5"
  const phaseNum = Number(phaseId?.replace("phase", "") || "1");
  const levelNum = Number(levelId?.replace("level", "") || "1");

  // Fetch challenge object
  const courseLevels = levelsRegistry[courseId];
  const phaseLevels = courseLevels ? courseLevels[phaseNum] : null;
  const challenge = phaseLevels ? phaseLevels[levelNum] : null;

  // Fallback / redirect if route parameters are invalid
  if (!challenge) {
    console.error(`Invalid level configuration: ${courseId} Phase ${phaseNum} Level ${levelNum}`);
    return <Navigate to="/dashboard" replace />;
  }

  // Get matching template component for the language
  const TemplateComponent = TEMPLATE_MAP[courseId] || LevelTemplate;

  return (
    <TemplateComponent
      challenge={challenge}
      course={courseId}
      phase={phaseNum}
      levelNumber={levelNum}
    />
  );
};

export default GenericPlayLevelPage;
