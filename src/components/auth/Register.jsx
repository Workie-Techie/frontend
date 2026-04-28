import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImage from "../../assets/logo2.png";
import useAuth from "../../hooks/useAuth";
import profileService from "../../services/profileService";

const flattenQuestionSets = (questionSets) =>
  questionSets.flatMap((set) =>
    set.questions.map((question) => ({
      ...question,
      setName: set.name,
      isGeneral: set.is_general,
    }))
  );

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [categories, setCategories] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedRole, setSelectedRole] = useState("professional");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
    expertise_category_id: "",
    specialization_ids: [],
  });
  const [customAnswers, setCustomAnswers] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    profileService.getExpertiseCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const categoryId = selectedRole === "professional" ? formData.expertise_category_id : undefined;
    profileService
      .getQuestionSets(selectedRole === "professional" ? "professional" : "client", categoryId || undefined)
      .then(setQuestionSets)
      .catch(() => setQuestionSets([]));
  }, [selectedRole, formData.expertise_category_id]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === Number(formData.expertise_category_id)),
    [categories, formData.expertise_category_id]
  );

  const questions = useMemo(() => flattenQuestionSets(questionSets), [questionSets]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.email || !formData.password || !formData.re_password) {
      setFormError("Email and password fields are required.");
      return;
    }
    if (formData.password !== formData.re_password) {
      setFormError("Passwords do not match.");
      return;
    }
    if (selectedRole === "professional" && !formData.expertise_category_id) {
      setFormError("Choose your primary expertise area to continue.");
      return;
    }

    const response = await register({
      ...formData,
      is_client: selectedRole === "client",
      is_freelancer: selectedRole === "professional",
      expertise_category_id:
        selectedRole === "professional" ? Number(formData.expertise_category_id) : undefined,
      specialization_ids: formData.specialization_ids,
      onboarding_answers: customAnswers,
    });

    if (response.success) {
      navigate("/check-email");
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="shell-card overflow-hidden bg-gradient-to-br from-workie-blue via-workie-blue-light to-[#0f7ba8] p-8 text-white sm:p-10">
          <img src={logoImage} alt="WorkieTechie" className="mb-10 h-14 w-auto" />
          <span className="status-pill bg-white/15 text-white">Admin-led talent matching</span>
          <h1 className="shell-title mt-6 text-4xl font-bold sm:text-5xl">
            Join the side of WorkieTechie built for serious delivery.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
            Professionals build premium portfolios and wait for curated project assignments. Clients submit structured briefs and get a managed delivery experience from the WorkieTechie team.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Admin-curated matches instead of a noisy job board",
              "Skill-specific intake set from the admin panel",
              "Private portfolio links for client confidence",
              "Built for premium Nigerian talent and smooth delivery ops",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="shell-card p-8 sm:p-10">
          <div className="mb-8 flex rounded-full bg-slate-100 p-1">
            {[
              { id: "professional", label: "Professional" },
              { id: "client", label: "Client" },
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  selectedRole === role.id
                    ? "bg-workie-gold text-white shadow-lg"
                    : "text-slate-600 hover:text-workie-blue"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="shell-title text-3xl font-bold text-slate-900">
              Create your {selectedRole === "professional" ? "professional" : "client"} account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {selectedRole === "professional"
                ? "Choose your primary expertise area at signup so the admin team can route the right onboarding prompts and matching logic."
                : "Set up your client account so you can submit structured project requests and track delivery through the platform."}
            </p>
          </div>

          {(error || formError) && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError || error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Confirm password
              <input
                type="password"
                value={formData.re_password}
                onChange={(event) => setFormData((prev) => ({ ...prev, re_password: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
              />
            </label>

            {selectedRole === "professional" && (
              <>
                <label className="block text-sm font-medium text-slate-700">
                  Primary expertise
                  <select
                    value={formData.expertise_category_id}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        expertise_category_id: event.target.value,
                        specialization_ids: [],
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedCategory?.specializations?.length ? (
                  <div>
                    <p className="text-sm font-medium text-slate-700">Relevant specializations</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedCategory.specializations.map((specialization) => {
                        const isSelected = formData.specialization_ids.includes(specialization.id);
                        return (
                          <button
                            key={specialization.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                specialization_ids: isSelected
                                  ? prev.specialization_ids.filter((id) => id !== specialization.id)
                                  : [...prev.specialization_ids, specialization.id],
                              }))
                            }
                            className={`rounded-full border px-4 py-2 text-sm transition ${
                              isSelected
                                ? "border-workie-gold bg-amber-50 text-workie-blue"
                                : "border-slate-200 bg-white text-slate-600 hover:border-workie-blue"
                            }`}
                          >
                            {specialization.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {questions.length > 0 && (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-workie-blue">
                  Initial onboarding prompts
                </p>
                <div className="mt-4 grid gap-4">
                  {questions.map((question) => (
                    <label key={question.id} className="text-sm font-medium text-slate-700">
                      {question.text}
                      <input
                        type={question.question_type === "number" ? "number" : "text"}
                        value={customAnswers[question.id] || ""}
                        onChange={(event) =>
                          setCustomAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                        }
                        placeholder={question.placeholder || "Your answer"}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-workie-gold"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-workie-blue">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
