import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface PageLoaderProps {
  /**
   * Текст, отображаемый под индикатором загрузки
   */
  text?: string;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
  /**
   * Размер индикатора загрузки
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Дополнительные пропсы для совместимости с React Router
   */
  [key: string]: unknown;
}

/**
 * Компонент для отображения индикатора загрузки на весь экран
 */
function RoutePageLoader({
  text = "Загрузка...",
  className,
  size = "md",
  ...props
}: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2
          className={cn("animate-spin text-primary", sizeClasses[size])}
          aria-hidden="true"
        />
        {text && (
          <p className="text-center text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Компонент PageLoader для использования в качестве fallback в createRouteView
 * Принимает любые пропсы (или не принимает их вовсе)
 */
export const PageLoader: React.ComponentType<unknown> = () => {
  return <RoutePageLoader />;
};
