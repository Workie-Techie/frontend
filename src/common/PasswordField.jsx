import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

const PasswordField = ({
  label,
  id,
  value,
  onChange,
  placeholder = "Password",
  autoComplete,
  className = "",
  inputClassName = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || "password";

  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <div className="relative mt-2">
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-workie-gold focus:bg-white ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute inset-y-0 right-3 flex items-center rounded-xl px-2 text-slate-500 transition hover:bg-white hover:text-workie-blue"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
        </button>
      </div>
    </label>
  );
};

export default PasswordField;
