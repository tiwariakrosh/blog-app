export const Loader = () => (
  <div className="flex items-center justify-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
    </div>
  </div>
);

export const LoadingSpinner = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <Loader />
    <p className="text-muted-foreground">{message}</p>
  </div>
);
