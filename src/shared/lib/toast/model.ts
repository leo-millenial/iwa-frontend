import { createEvent } from "effector";
import { type ExternalToast, toast } from "sonner";

export type ToastParams = {
  message: string | React.ReactNode;
  description?: string | React.ReactNode;
  options?: Omit<ExternalToast, "description">;
};

export const showToast = createEvent<ToastParams>();
export const showSuccessToast = createEvent<ToastParams>();
export const showErrorToast = createEvent<ToastParams>();

showToast.watch(({ message, description, options }) => {
  toast(message, {
    description,
    ...options,
  });
});

showSuccessToast.watch(({ message, description, options }) => {
  toast.success(message, {
    description,
    ...options,
  });
});

showErrorToast.watch(({ message, description, options }) => {
  toast.error(message, {
    description,
    ...options,
  });
});
