import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({
  label,
  options,
  className = "",
  id,
  ...rest
}: SelectProps) {
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
      <select
        id={inputId}
        className={`w-full bg-surface-container-high border-transparent rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm font-medium ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
