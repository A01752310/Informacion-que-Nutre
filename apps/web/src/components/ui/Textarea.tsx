import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={inputId}
        className={`w-full bg-surface-container-high border-transparent rounded-lg py-3 px-4 transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none leading-relaxed ${
          error ? "border-error focus:border-error" : ""
        } ${className}`}
        {...rest}
      />
      {error && (
        <p className="text-[10px] text-error font-medium pl-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[10px] text-on-surface-variant/70 italic pl-1">
          {hint}
        </p>
      )}
    </div>
  );
}
