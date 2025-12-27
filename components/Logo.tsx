import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  variant = "default",
  showText = true,
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", tree: "w-5 h-5", text: "text-lg" },
    md: { icon: "w-10 h-10", tree: "w-6 h-6", text: "text-xl" },
    lg: { icon: "w-12 h-12", tree: "w-8 h-8", text: "text-2xl" },
  };

  const variants = {
    default: {
      bg: "bg-primary",
      tree: "text-white",
      textPrimary: "text-foreground",
      textAccent: "text-accent",
    },
    light: {
      bg: "bg-white/20",
      tree: "text-white",
      textPrimary: "text-white",
      textAccent: "text-gold-300",
    },
    dark: {
      bg: "bg-primary",
      tree: "text-white",
      textPrimary: "text-foreground",
      textAccent: "text-accent",
    },
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 group", className)}
    >
      {/* Cross Icon Container - matches favicon */}
      <div
        className={cn(
          currentSize.icon,
          currentVariant.bg,
          "rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        )}
      >
        {/* Cross with Base SVG - matching favicon design */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(currentSize.tree, currentVariant.tree)}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vertical bar */}
          <rect x="10" y="4" width="4" height="14" rx="0.5" fill="currentColor" />
          {/* Horizontal bar */}
          <rect x="6" y="7" width="12" height="3.5" rx="0.5" fill="currentColor" />
          {/* Base */}
          <path d="M8 17.5h8v1.5l-4 2l-4-2z" fill="currentColor" opacity="0.8" />
        </svg>
      </div>

      {/* Text Logo */}
      {showText && (
        <span className={cn(currentSize.text, "font-semibold tracking-tight")}>
          <span className={currentVariant.textPrimary}>Cemetery</span>
          <span className={currentVariant.textAccent}>NearMe</span>
          <span className={currentVariant.textPrimary}>.com</span>
        </span>
      )}
    </Link>
  );
}
