
import { cn } from "@/lib/utils";

export type ProjectColor = "blue" | "pink" | "orange" | "green" | "purple";

export interface ProjectColorConfig {
  text: string;
  bg: string;
  border: string;
  hoverBg: string;
}

/**
 * Get color classes for project elements based on the project color
 */
export const getProjectColorClasses = (
  color: ProjectColor | string, 
  variant: "text" | "bg" | "border" | "all" = "text"
): string => {
  const colorMap: Record<ProjectColor, ProjectColorConfig> = {
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/30",
      hoverBg: "hover:bg-blue-400/20",
    },
    pink: {
      text: "text-pink-400",
      bg: "bg-pink-400/10",
      border: "border-pink-400/30",
      hoverBg: "hover:bg-pink-400/20",
    },
    orange: {
      text: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/30",
      hoverBg: "hover:bg-orange-400/20",
    },
    green: {
      text: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/30",
      hoverBg: "hover:bg-green-400/20",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/30",
      hoverBg: "hover:bg-purple-400/20",
    },
  };

  // Default to orange if color is not recognized
  const safeColor = (color && colorMap[color as ProjectColor]) ? color as ProjectColor : "orange";
  const colorConfig = colorMap[safeColor];

  switch (variant) {
    case "text":
      return colorConfig.text;
    case "bg":
      return colorConfig.bg;
    case "border":
      return colorConfig.border;
    case "all":
      return cn(colorConfig.text, colorConfig.bg, colorConfig.border);
    default:
      return colorConfig.text;
  }
};

/**
 * Project color options for dropdown/selection
 */
export const projectColorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
];
