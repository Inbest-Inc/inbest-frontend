import React from "react";
import Image from "next/image";

// Types for the component
interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg"; // Small, medium, large sizes
  className?: string;
  onClick?: () => void;
}

export default function Avatar({
  src,
  name,
  size = "md",
  className = "",
  onClick,
}: AvatarProps) {
  // Determine size dimensions
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
  };

  // Apply rounded corners based on size
  const roundedMap = {
    sm: "rounded-xl",
    md: "rounded-xl",
    lg: "rounded-2xl",
  };

  // Determine font size for the default avatar with initial
  const fontSizeMap = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-3xl",
  };

  // Get the first character of the name for the default avatar
  const nameInitial = name.charAt(0);

  return (
    <div
      className={`relative ${sizeMap[size]} ${roundedMap[size]} overflow-hidden ring-1 ring-black/[0.08] bg-gray-200 flex-shrink-0 ${className}`}
      onClick={onClick}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <span className={`${fontSizeMap[size]} font-medium text-gray-500`}>
            {nameInitial}
          </span>
        </div>
      )}
    </div>
  );
}
