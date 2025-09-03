import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `floating-input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="floating-label">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-3 py-4 pt-4 pb-2 border-2 border-border rounded-md bg-background text-sm transition-colors",
            "focus:border-primary focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 top-4 text-sm text-muted-foreground pointer-events-none transition-all duration-200",
            "peer-focus:top-1 peer-focus:left-2 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium",
            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:font-medium",
            "bg-background px-1",
            error && "text-destructive"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-destructive" data-testid={`error-${inputId}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
