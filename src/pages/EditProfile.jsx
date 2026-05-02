import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DynamicQuestionField from "../common/DynamicQuestionField";
import useAuth from "../hooks/useAuth";
import profileService from "../services/profileService";

const getFriendlyBankError = (detail) => {
  if (detail?.includes("PAYSTACK_SECRET_KEY")) {
    return "Bank verification is not configured yet. Please contact support before adding payout details.";
  }
  return detail || "Bank list is temporarily unavailable. Please try again shortly.";
};

const EditProfile = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [bankMessage, setBankMessage] = useState("");
  const [bankDirectoryMessage, setBankDirectoryMessage] = useState("");
  const [bankVerifying, setBankVerifying] = useState(false);
  const [isChangingBankAccount, setIsChangingBankAccount] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    city: "",
    state: "",
    business_name: "",
    certifications: "",
    hourly_rate: "",
    profile_status: "draft",
    specialization_ids: [],
  });
  const [answerMap, setAnswerMap] = useState({});
  const [bankForm, setBankForm] = useState({ bank_code: "", bank_name: "", account_number: "" });

  const loadPage = async (forceProfile = false) => {
    setPageLoading(true);
    try {
      const [profileData, categoriesData] = await Promise.all([
        fetchProfile({ force: forceProfile }),
        profileService.getExpertiseCategories(),
      ]);

      setCategories(categoriesData);
      if (user?.is_freelancer) {
        const [accounts, bankDirectory] = await Promise.all([
          profileService.getBankAccounts().catch(() => []),
          profileService.getBanks().catch((error) => ({
            error: getFriendlyBankError(error?.response?.data?.detail),
          })),
        ]);
        setBankAccounts(Array.isArray(accounts) ? accounts : []);
        if (Array.isArray(bankDirectory)) {
          setBanks(bankDirectory);
          setBankDirectoryMessage("");
        } else {
          setBanks([]);
          setBankDirectoryMessage(bankDirectory?.error || "Bank list is temporarily unavailable. Please try again shortly.");
        }
      }

      setForm({
        name: profileData?.name || "",
        title: profileData?.title || "",
        bio: profileData?.bio || "",
        city: profileData?.city || "",
        state: profileData?.state || "",
        business_name: profileData?.business_name || "",
        certifications: profileData?.certifications || "",
        hourly_rate: profileData?.hourly_rate || "",
        profile_status: profileData?.profile_status || "draft",
        specialization_ids: profileData?.specializations?.map((item) => item.id) || [],
      });

      const answers =
        profileData?.question_answers?.reduce((accumulator, item) => {
          accumulator[item.question.id] = item.value;
          return accumulator;
        }, {}) || {};
      setAnswerMap(answers);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    const categoryId = profile?.expertise_category?.id;
    if (!user || !categoryId || !user.is_freelancer) return;
    profileService
      .getQuestionSets("professional", categoryId)
      .then(setQuestionSets)
      .catch(() => setQuestionSets([]));
  }, [user, profile?.expertise_category?.id]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === profile?.expertise_category?.id),
    [categories, profile?.expertise_category?.id]
  );
  const verifiedBankAccount = useMemo(
    () => bankAccounts.find((account) => account.status === "verified") || null,
    [bankAccounts]
  );
  const shouldShowBankForm = !verifiedBankAccount || isChangingBankAccount;

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => payload.append(key, item));
        } else if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      const fileInput = document.getElementById("profile-image-input");
      if (fileInput?.files?.[0]) {
        payload.append("profile_image", fileInput.files[0]);
      }

      await profileService.updateProfile(payload, true);
      if (Object.keys(answerMap).length) {
        await profileService.saveProfessionalAnswers(
          Object.entries(answerMap).map(([question_id, value]) => ({
            question_id: Number(question_id),
            value,
          }))
        );
      }
      await loadPage(true);
      setMessage("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  };

  const verifyBankAccount = async (event) => {
    event.preventDefault();
    setBankMessage("");
    if (!bankForm.bank_code || !bankForm.account_number) {
      setBankMessage("Choose your bank and enter your account number.");
      return;
    }
    setBankVerifying(true);
    try {
      const verification = await profileService.createBankAccount(bankForm);
      setBankAccounts(await profileService.getBankAccounts());
      setBankForm({ bank_code: "", bank_name: "", account_number: "" });
      if (verification?.status === "verified") {
        setIsChangingBankAccount(false);
      }
      setBankMessage(
        verification?.status === "verified"
          ? "Bank details verified successfully."
          : "Bank details submitted, but verification could not be completed yet."
      );
    } catch (error) {
      setBankMessage(getFriendlyBankError(error?.response?.data?.detail || "Unable to verify this bank account right now."));
    } finally {
      setBankVerifying(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="shell-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Profile workspace</p>
              <h1 className="shell-title mt-2 text-4xl font-bold text-slate-900">Refine your profile and operating details</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Keep your information sharp so the admin team can qualify you faster, match you better, and communicate clearly with clients.
              </p>
            </div>
            <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Back to dashboard
            </Link>
          </div>
        </div>

        {pageLoading ? (
          <div className="shell-panel flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />
            <h2 className="shell-title mt-6 text-2xl font-bold text-slate-900">Loading your profile workspace</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              We are pulling your profile, payout setup, and configured questions.
            </p>
          </div>
        ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <form className="space-y-6" onSubmit={saveProfile}>
            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Core profile</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Full name"],
                  ["title", "Professional title"],
                  ["city", "City"],
                  ["state", "State"],
                ].map(([key, label]) => (
                  <label key={key} className="text-sm font-medium text-slate-700">
                    {label}
                    <input
                      value={form[key]}
                      onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                ))}

                {user?.is_client ? (
                  <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                    Business name
                    <input
                      value={form.business_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, business_name: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                ) : null}

                {user?.is_freelancer ? (
                  <label className="text-sm font-medium text-slate-700">
                    Hourly rate
                    <input
                      type="number"
                      value={form.hourly_rate}
                      onChange={(event) => setForm((prev) => ({ ...prev, hourly_rate: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                ) : null}

                <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                  Bio
                  <textarea
                    rows="5"
                    value={form.bio}
                    onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                  />
                </label>

                {user?.is_freelancer ? (
                  <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                    Certifications
                    <textarea
                      rows="4"
                      value={form.certifications}
                      onChange={(event) => setForm((prev) => ({ ...prev, certifications: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                    />
                  </label>
                ) : null}

                <label className="sm:col-span-2 text-sm font-medium text-slate-700">
                  Profile image
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                  />
                </label>
              </div>
            </div>

            {user?.is_freelancer && questionSets.length ? (
              <div className="shell-panel p-6">
                <h2 className="shell-title text-2xl font-bold text-slate-900">Service-specific intake answers</h2>
                <p className="mt-2 text-sm text-slate-600">
                  These questions are configured by the admin team for your chosen expertise area.
                </p>
                <div className="mt-6 space-y-5">
                    {questionSets.flatMap((set) =>
                      set.questions.map((question) => (
                        <DynamicQuestionField
                          key={question.id}
                          question={question}
                          value={answerMap[question.id] || ""}
                          onChange={(value) => setAnswerMap((prev) => ({ ...prev, [question.id]: value }))}
                          inputClassName="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                        />
                      ))
                    )}
                  </div>
              </div>
            ) : null}

            {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white"
            >
              {saving ? "Saving..." : "Save profile updates"}
            </button>
          </form>

          <div className="space-y-6">
            <div className="shell-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Expertise</p>
              <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">
                {profile?.expertise_category?.name || "No expertise selected"}
              </h2>
              <p className="mt-3 text-sm text-slate-600">{selectedCategory?.description || "Primary category from signup."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {profile?.specializations?.map((specialization) => (
                  <span key={specialization.id} className="status-pill bg-slate-100 text-slate-700">
                    {specialization.name}
                  </span>
                ))}
              </div>
            </div>

            {user?.is_freelancer ? (
              <>
                <div className="shell-panel p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Portfolio workspace</p>
                  <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Manage work samples and share links</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Portfolio items, multiple images, ordering, previews, and client-shareable links now live in one dedicated workspace.
                  </p>
                  <Link to="/dashboard/portfolio" className="mt-5 inline-flex rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold !text-white">
                    Open portfolio workspace
                  </Link>
                </div>

                <div className="shell-panel p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Payout setup</p>
                  <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Nigerian bank details</h2>

                  {verifiedBankAccount && !isChangingBankAccount ? (
                    <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            Verified
                          </span>
                          <h3 className="mt-4 text-lg font-bold text-slate-900">
                            {verifiedBankAccount.account_name || "Verified account"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {verifiedBankAccount.bank_name || verifiedBankAccount.bank_code}
                          </p>
                          <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                            {verifiedBankAccount.account_number}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingBankAccount(true);
                            setBankMessage("");
                          }}
                          className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm"
                        >
                          Change account
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {shouldShowBankForm ? (
                    <form className="mt-5 space-y-4" onSubmit={verifyBankAccount}>
                      {verifiedBankAccount ? (
                        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          Add and verify a new payout account to replace the current verified account.
                        </div>
                      ) : null}
                      <label className="block text-sm font-medium text-slate-700">
                        Bank
                        <select
                          value={bankForm.bank_code}
                          disabled={bankVerifying}
                          onChange={(event) => {
                            const selectedBank = banks.find((bank) => String(bank.code) === event.target.value);
                            setBankForm((prev) => ({
                              ...prev,
                              bank_code: event.target.value,
                              bank_name: selectedBank?.name || "",
                            }));
                          }}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select your bank</option>
                          {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-slate-700">
                        Account number
                        <input
                          value={bankForm.account_number}
                          disabled={bankVerifying}
                          onChange={(event) => setBankForm((prev) => ({ ...prev, account_number: event.target.value }))}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="submit"
                          disabled={bankVerifying}
                          className="inline-flex items-center gap-2 rounded-2xl bg-workie-gold px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {bankVerifying ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          ) : null}
                          {bankVerifying ? "Verifying..." : "Submit for verification"}
                        </button>
                        {verifiedBankAccount ? (
                          <button
                            type="button"
                            disabled={bankVerifying}
                            onClick={() => {
                              setIsChangingBankAccount(false);
                              setBankForm({ bank_code: "", bank_name: "", account_number: "" });
                              setBankMessage("");
                            }}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                      {bankDirectoryMessage ? <div className="text-sm text-amber-700">{bankDirectoryMessage}</div> : null}
                      {bankMessage ? <div className="text-sm text-emerald-700">{bankMessage}</div> : null}
                    </form>
                  ) : bankMessage ? (
                    <div className="mt-4 text-sm text-emerald-700">{bankMessage}</div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
