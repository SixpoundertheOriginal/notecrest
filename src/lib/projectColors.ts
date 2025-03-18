
import { cn } from "@/lib/utils";

export type ProjectColor = 
  | "blue" 
  | "pink" 
  | "orange" 
  | "green" 
  | "purple" 
  | "red"
  | "yellow"
  | "teal"
  | "indigo"
  | "gray";

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
  variant: "text" | "bg" | "border" | "hoverBg" | "all" = "text"
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
    // New colors
    red: {
      text: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/30",
      hoverBg: "hover:bg-red-400/20",
    },
    yellow: {
      text: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30",
      hoverBg: "hover:bg-yellow-400/20",
    },
    teal: {
      text: "text-teal-400",
      bg: "bg-teal-400/10",
      border: "border-teal-400/30",
      hoverBg: "hover:bg-teal-400/20",
    },
    indigo: {
      text: "text-indigo-400",
      bg: "bg-indigo-400/10",
      border: "border-indigo-400/30",
      hoverBg: "hover:bg-indigo-400/20",
    },
    gray: {
      text: "text-gray-400",
      bg: "bg-gray-400/10",
      border: "border-gray-400/30",
      hoverBg: "hover:bg-gray-400/20",
    }
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
    case "hoverBg":
      return colorConfig.hoverBg;
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
  // New colors
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
];
