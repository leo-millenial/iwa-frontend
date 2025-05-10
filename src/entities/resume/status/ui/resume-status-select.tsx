import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

import { resumeStatusLabels, resumeStatusVariants } from "@/entities/resume/status/consts";

import { ResumeStatus } from "@/shared/types/resume.interface.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface ResumeStatusSelectProps {
  value: ResumeStatus;
  onChange: (value: ResumeStatus) => void;
  asChild?: boolean;
}

const ResumeStatusSelect: React.FC<ResumeStatusSelectProps> = ({
  value,
  onChange,
  asChild = false,
}) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите статус" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(resumeStatusLabels).map(([status, label]) => (
            <SelectItem
              key={status}
              value={status}
              className={cn(resumeStatusVariants[status as ResumeStatus])}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Comp>
  );
};

export { ResumeStatusSelect };
