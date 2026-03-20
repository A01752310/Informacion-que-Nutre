import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-surface-container-high border-transparent rounded-lg py-3 px-4 transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${
          error ? "border-error focus:border-error focus:ring-error/20" : ""
        } ${className}`}
        {...rest}
      />
      {error && (
        <p className="text-[10px] text-error font-medium pl-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[10px] text-on-surface-variant/70 italic pl-1">
          {hint}
        </p>
      )}
    </div>
  );
}
