import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DynamicQuestionField from "../common/DynamicQuestionField";
import profileService from "../services/profileService";

const flattenQuestionSets = (questionSets) =>
  questionSets.flatMap((set) =>
    set.questions.map((question) => ({
      ...question,
      setName: set.name,
    }))
  );

const ClientRequestPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    summary: "",
    expertise_category_id: "",
    specialization_ids: [],
    budget: "",
    desired_timeline: "",
  });
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileService.getExpertiseCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    profileService
      .getQuestionSets("client", form.expertise_category_id || undefined)
      .then(setQuestionSets)
      .catch(() => setQuestionSets([]));
  }, [form.expertise_category_id]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === Number(form.expertise_category_id)),
    [categories, form.expertise_category_id]
  );

  const questions = useMemo(() => flattenQuestionSets(questionSets), [questionSets]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage("");
    setFormError("");
    if (!form.title.trim() || !form.summary.trim() || !form.expertise_category_id) {
      setFormError("Add a title, summary, and expertise category before submitting.");
      return;
    }
    setSaving(true);
    try {
      await profileService.createClientRequest({
        ...form,
        expertise_category_id: form.expertise_category_id ? Number(form.expertise_category_id) : null,
        specialization_ids: form.specialization_ids,
        answers: Object.entries(answers).map(([question_id, value]) => ({
          question_id: Number(question_id),
          value,
        })),
      });
      setFormMessage("Project request submitted successfully. Redirecting to your dashboard...");
      navigate("/dashboard");
    } catch {
      setFormError("We could not submit your request right now. Please review your details and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="shell-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Client intake</p>
              <h1 className="shell-title mt-2 text-4xl font-bold text-slate-900">Submit a structured project request</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Give the admin team a clear brief with your timeline, budget, and service-specific requirements so they can qualify the project and match the right professional.
              </p>
            </div>
            <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Back to dashboard
            </Link>
          </div>
        </div>

        <form className="shell-panel p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2 text-sm font-medium text-slate-700">
              Project title
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Expertise category
              <select
                value={form.expertise_category_id}
                onChange={(event) => setForm((prev) => ({ ...prev, expertise_category_id: event.target.value, specialization_ids: [] }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Desired timeline
              <input
                value={form.desired_timeline}
                onChange={(event) => setForm((prev) => ({ ...prev, desired_timeline: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Budget
              <input
                type="number"
                value={form.budget}
                onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
              />
            </label>

            {selectedCategory?.specializations?.length ? (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-slate-700">Relevant specialization(s)</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCategory.specializations.map((specialization) => {
                    const selected = form.specialization_ids.includes(specialization.id);
                    return (
                      <button
                        key={specialization.id}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            specialization_ids: selected
                              ? prev.specialization_ids.filter((id) => id !== specialization.id)
                              : [...prev.specialization_ids, specialization.id],
                          }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm ${
                          selected
                            ? "border-workie-gold bg-amber-50 text-workie-blue"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {specialization.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <label className="sm:col-span-2 text-sm font-medium text-slate-700">
              Project summary
              <textarea
                rows="5"
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
              />
            </label>
          </div>

          {questions.length ? (
            <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Project-specific questions</p>
                <div className="mt-4 grid gap-4">
                  {questions.map((question) => (
                    <DynamicQuestionField
                      key={question.id}
                      question={question}
                      value={answers[question.id] || ""}
                      onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
                    />
                  ))}
                </div>
            </div>
          ) : null}

          {formError ? <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</div> : null}
          {formMessage ? <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{formMessage}</div> : null}

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white"
          >
            {saving ? "Submitting..." : "Submit project request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientRequestPage;
