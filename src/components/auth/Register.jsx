import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoImage from "../../assets/logo2.png";
import DynamicQuestionField from "../../common/DynamicQuestionField";
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

const steps = ["Role", "Service", "Questions", "Account"];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [step, setStep] = useState("role");
  const [categories, setCategories] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
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
    if (!selectedRole) return;
    const audience = selectedRole === "professional" ? "professional" : "client";
    const categoryId = formData.expertise_category_id;
    profileService
      .getQuestionSets(audience, categoryId || undefined)
      .then(setQuestionSets)
      .catch(() => setQuestionSets([]));
  }, [selectedRole, formData.expertise_category_id]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === Number(formData.expertise_category_id)),
    [categories, formData.expertise_category_id]
  );

  const questions = useMemo(() => flattenQuestionSets(questionSets), [questionSets]);
  const activeStepIndex = Math.max(0, steps.findIndex((item) => item.toLowerCase() === step));

  const chooseRole = (role) => {
    setSelectedRole(role);
    setFormError("");
    setCustomAnswers({});
    setFormData((prev) => ({
      ...prev,
      expertise_category_id: "",
      specialization_ids: [],
    }));
    setStep("service");
  };

  const selectCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      expertise_category_id: String(categoryId),
      specialization_ids: [],
    }));
    setCustomAnswers({});
    setStep("questions");
  };

  const toggleSpecialization = (specializationId) => {
    setFormData((prev) => ({
      ...prev,
      specialization_ids: prev.specialization_ids.includes(specializationId)
        ? prev.specialization_ids.filter((id) => id !== specializationId)
        : [...prev.specialization_ids, specializationId],
    }));
  };

  const goToAccount = () => {
    if (!formData.expertise_category_id) {
      setFormError("Choose your service category before creating your account.");
      return;
    }
    setFormError("");
    setStep("account");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!selectedRole) {
      setFormError("Choose the type of account you want to create.");
      setStep("role");
      return;
    }
    if (!formData.expertise_category_id) {
      setFormError("Choose your service category before creating your account.");
      setStep("service");
      return;
    }
    if (!formData.email || !formData.password || !formData.re_password) {
      setFormError("Email and password fields are required.");
      return;
    }
    if (formData.password !== formData.re_password) {
      setFormError("Passwords do not match.");
      return;
    }

    const response = await register({
      email: formData.email,
      password: formData.password,
      re_password: formData.re_password,
      is_client: selectedRole === "client",
      is_freelancer: selectedRole === "professional",
      expertise_category_id: Number(formData.expertise_category_id),
      specialization_ids: formData.specialization_ids,
      onboarding_answers: customAnswers,
    });

    if (response.success) {
      navigate("/check-email");
    }
  };

  const renderProgress = () => (
    <div className="mb-8 grid grid-cols-4 gap-2">
      {steps.map((item, index) => {
        const isActive = index <= activeStepIndex;
        return (
          <div key={item} className={`h-2 rounded-full ${isActive ? "bg-workie-gold" : "bg-slate-200"}`} />
        );
      })}
    </div>
  );

  const renderRoleStep = () => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Choose your path</p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">What kind of account are you creating?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            id: "professional",
            title: "Professional",
            body: "Build a trusted profile, answer service-specific onboarding questions, and get considered for better-fit client work.",
            accent: "from-workie-blue to-workie-blue-light",
          },
          {
            id: "client",
            title: "Client",
            body: "Share what you need, review vetted talent signals, track progress, and complete work with confidence.",
            accent: "from-workie-gold to-amber-500",
          },
        ].map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => chooseRole(role.id)}
            className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-workie-gold"
          >
            <div className={`h-2 bg-gradient-to-r ${role.accent}`} />
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-xl font-black text-workie-blue">
                {role.title.charAt(0)}
              </div>
              <h3 className="shell-title mt-5 text-2xl font-bold text-slate-900">{role.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{role.body}</p>
              <span className="mt-6 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-workie-blue transition group-hover:bg-workie-blue group-hover:text-white">
                Continue as {role.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderServiceStep = () => (
    <div>
      <button type="button" onClick={() => setStep("role")} className="mb-5 text-sm font-semibold text-workie-blue">
        Back to account type
      </button>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">
        {selectedRole === "professional" ? "Professional setup" : "Client setup"}
      </p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
        {selectedRole === "professional" ? "Pick your strongest service category" : "What kind of work do you need first?"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {selectedRole === "professional"
          ? "This controls the onboarding questions you answer and helps WorkieTechie understand where your strengths fit best."
          : "This helps WorkieTechie understand your likely project needs and prepare a better matching experience."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.id)}
            className={`rounded-[26px] border p-5 text-left transition hover:-translate-y-1 ${
              Number(formData.expertise_category_id) === category.id
                ? "border-workie-gold bg-amber-50"
                : "border-slate-200 bg-white hover:border-workie-blue"
            }`}
          >
            <h3 className="shell-title text-xl font-bold text-slate-900">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {category.description ||
                (selectedRole === "professional"
                  ? "Curated professionals in this WorkieTechie service category."
                  : "Submit or explore work requests in this service category.")}
            </p>
            {category.specializations?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {category.specializations.slice(0, 3).map((specialization) => (
                  <span key={specialization.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {specialization.name}
                  </span>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuestionsStep = () => (
    <div>
      <button type="button" onClick={() => setStep("service")} className="mb-5 text-sm font-semibold text-workie-blue">
        Back to service category
      </button>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">
        {selectedRole === "professional" ? "Service profile" : "Project intent"}
      </p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
        {selectedRole === "professional"
          ? `Tell us about your ${selectedCategory?.name || "service"} background`
          : `Tell us what you may need in ${selectedCategory?.name || "this service"}`}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {selectedRole === "professional"
          ? "These prompts help WorkieTechie understand your experience, strengths, and delivery fit before matching you to client work."
          : "These prompts help WorkieTechie understand your likely project scope before you submit a formal request."}
      </p>

      {selectedCategory?.specializations?.length ? (
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">
            {selectedRole === "professional" ? "Optional specializations" : "Likely project focus"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCategory.specializations.map((specialization) => {
              const isSelected = formData.specialization_ids.includes(specialization.id);
              return (
                <button
                  key={specialization.id}
                  type="button"
                  onClick={() => toggleSpecialization(specialization.id)}
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

      <div className="mt-6 grid gap-4">
        {questions.length ? (
          questions.map((question) => (
            <div key={question.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
              <DynamicQuestionField
                question={question}
                value={customAnswers[question.id] || ""}
                onChange={(value) => setCustomAnswers((prev) => ({ ...prev, [question.id]: value }))}
                inputClassName="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
              />
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
            No extra {selectedRole === "professional" ? "onboarding" : "client intake"} questions are configured for this service yet. You can continue to account setup.
          </div>
        )}
      </div>

      <button type="button" onClick={goToAccount} className="mt-6 w-full rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white">
        Continue to account details
      </button>
    </div>
  );

  const renderAccountStep = () => (
    <div>
      <button
        type="button"
        onClick={() => setStep("questions")}
        className="mb-5 text-sm font-semibold text-workie-blue"
      >
        Back
      </button>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Create account</p>
      <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">
        Finish your {selectedRole === "professional" ? "professional" : "client"} signup
      </h2>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Confirm password
            <input
              type="password"
              value={formData.re_password}
              onChange={(event) => setFormData((prev) => ({ ...prev, re_password: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="shell-card overflow-hidden bg-gradient-to-br from-workie-blue via-workie-blue-light to-[#0f7ba8] p-8 text-white sm:p-10">
          <img src={logoImage} alt="WorkieTechie" className="mb-10 h-14 w-auto" />
          <span className="status-pill bg-white/15 text-white">Vetted matching. Accountable delivery.</span>
          <h1 className="shell-title mt-6 text-4xl font-bold sm:text-5xl">
            Start with the right path, then we tailor the setup.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
            Professionals choose a service category so their profile starts with clear strengths. Clients choose a likely project need so matching starts with better context.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              "Clients get matched with professionals whose strengths fit the work.",
              "Professionals get considered for projects that respect their expertise.",
              "Clear expectations help reduce poor-fit work before it starts.",
              "Every account starts with trust, context, and accountability.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="shell-card p-8 sm:p-10">
          {renderProgress()}
          {(error || formError) && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError || error}
            </div>
          )}
          {step === "role" ? renderRoleStep() : null}
          {step === "service" ? renderServiceStep() : null}
          {step === "questions" ? renderQuestionsStep() : null}
          {step === "account" ? renderAccountStep() : null}

          <p className="mt-8 text-center text-sm text-slate-600">
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
