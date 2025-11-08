import type React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
}

export const Alert = ({
  className = "",
  variant = "default",
  children,
  ...props
}: AlertProps) => {
  const variantStyles = {
    default: "bg-muted border-border text-foreground",
    destructive: "bg-destructive/10 border-destructive/30 text-destructive",
    success:
      "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-800 dark:text-green-200",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
