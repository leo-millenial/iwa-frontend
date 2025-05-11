import { cn } from "@/lib/utils.ts";
import { useUnit } from "effector-react";
import { Circle } from "lucide-react";

import { $isConnected } from "@/features/chat/connect/model.ts";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip.tsx";

export const SocketStatusBadge = () => {
  const isConnected = useUnit($isConnected);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-center rounded-full p-1 transition-colors",
            isConnected ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300",
          )}
        >
          <span className="relative flex items-center justify-center w-3 h-3">
            {isConnected ? (
              <>
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
              </>
            ) : (
              <Circle className="text-red-500 w-3 h-3" />
            )}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{isConnected ? "Вы онлайн" : "Чат временно не доступен"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
