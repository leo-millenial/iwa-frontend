interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return <div className="min-h-[48px]"></div>;

  return (
    <div className="min-h-[48px]">
      <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
        {message}
      </div>
    </div>
  );
};
