import { cn } from "@/lib/utils";
import { Locale, ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/shared/ui/button";

type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  fromYear?: number;
  toYear?: number;
  locale?: Locale;
  captionLayout?: "buttons" | "dropdown" | "dropdown-buttons";
} & (
  | { mode: "single"; defaultMonth?: Date; selected?: Date; onSelect?: (date?: Date) => void }
  | {
      mode: "multiple";
      defaultMonth?: Date;
      selected?: Date[];
      onSelect?: (dates?: Date[]) => void;
    }
  | {
      mode: "range";
      defaultMonth?: Date;
      selected?: { from?: Date; to?: Date };
      onSelect?: (range?: { from?: Date; to?: Date }) => void;
    }
  | { mode?: "default"; defaultMonth?: Date }
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  mode = "single",
  locale = ru,
  captionLayout = "dropdown-buttons",
  ...props
}: CalendarProps) {
  return (
    // @ts-expect-error
    <DayPicker
      showOutsideDays={showOutsideDays}
      fromYear={fromYear}
      toYear={toYear}
      mode={mode}
      locale={locale}
      captionLayout={captionLayout}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2 hid",
        month: "flex flex-col gap-4 ",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "hidden",
        caption_dropdowns: "flex gap-1",
        dropdown:
          "cursor-pointer rounded-md bg-transparent p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50",
        dropdown_month: "",
        dropdown_year: "",
        dropdown_icon: "ml-1 size-4",
        vhidden: "sr-only",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
        Dropdown: ({ value, onChange, children, ...props }) => {
          return (
            <select
              value={value}
              onChange={onChange}
              className={cn(
                "cursor-pointer rounded-md bg-transparent p-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50",
                props.className,
              )}
            >
              {children}
            </select>
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
