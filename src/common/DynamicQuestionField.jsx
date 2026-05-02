const normalizeMultiValue = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const DynamicQuestionField = ({ question, value, onChange, inputClassName = "" }) => {
  const baseClassName =
    inputClassName ||
    "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-workie-gold";
  const choices = question.choices || [];

  const updateMultiSelect = (choice, checked) => {
    const current = normalizeMultiValue(value);
    const next = checked ? [...new Set([...current, choice])] : current.filter((item) => item !== choice);
    onChange(JSON.stringify(next));
  };

  const renderControl = () => {
    if (question.question_type === "long_text") {
      return (
        <textarea
          rows="4"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder || "Your answer"}
          className={baseClassName}
        />
      );
    }

    if (question.question_type === "select") {
      return (
        <select value={value || ""} onChange={(event) => onChange(event.target.value)} className={baseClassName}>
          <option value="">{question.placeholder || "Select an option"}</option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      );
    }

    if (question.question_type === "multi_select") {
      const selectedValues = normalizeMultiValue(value);
      return (
        <div className="mt-3 flex flex-wrap gap-2">
          {choices.length ? (
            choices.map((choice) => {
              const selected = selectedValues.includes(choice);
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => updateMultiSelect(choice, !selected)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selected
                      ? "border-workie-gold bg-amber-50 text-workie-blue"
                      : "border-slate-200 bg-white text-slate-600 hover:border-workie-blue"
                  }`}
                >
                  {choice}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-amber-700">No options configured for this multi-select question.</p>
          )}
        </div>
      );
    }

    if (question.question_type === "boolean") {
      return (
        <select value={value || ""} onChange={(event) => onChange(event.target.value)} className={baseClassName}>
          <option value="">{question.placeholder || "Choose yes or no"}</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    return (
      <input
        type={question.question_type === "number" ? "number" : question.question_type === "url" ? "url" : "text"}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={question.placeholder || "Your answer"}
        className={baseClassName}
      />
    );
  };

  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="flex items-center justify-between gap-3">
        {question.text}
        {question.is_required ? <span className="text-xs font-semibold text-workie-gold">Required</span> : null}
      </span>
      {question.help_text ? <span className="mt-1 block text-xs leading-5 text-slate-500">{question.help_text}</span> : null}
      {renderControl()}
    </label>
  );
};

export default DynamicQuestionField;
