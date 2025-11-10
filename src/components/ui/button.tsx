import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
    md: "px-4 py-2.5 text-base rounded-lg gap-2",
    lg: "px-6 py-3 text-lg rounded-xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus-visible:ring-blue-500",
    secondary:
      "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 active:from-gray-800 active:to-gray-900 text-gray-100 shadow-lg shadow-gray-900/50 hover:shadow-xl focus-visible:ring-gray-500",
    danger:
      "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 focus-visible:ring-red-500",
    outline:
      "bg-transparent border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/30 active:bg-gray-800/50 text-gray-700 hover:text-white focus-visible:ring-gray-500",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const showIconSlot = icon || isLoading;

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={isLoading || disabled}
      {...rest}
    >
      {showIconSlot && (
        <span
          className={cn(
            "inline-flex items-center justify-center flex-shrink-0",
            iconSize[size]
          )}
        >
          {isLoading ? (
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            icon
          )}
        </span>
      )}

      {children && (
        <span className="inline-flex items-center whitespace-nowrap">
          {children}
        </span>
      )}
    </button>
  );
};
