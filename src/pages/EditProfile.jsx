import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import profileService from "../services/profileService";

const EditProfile = () => {
  const { user, profile, fetchProfile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [bankMessage, setBankMessage] = useState("");
  const [bankDirectoryMessage, setBankDirectoryMessage] = useState("");
  const [portfolioMessage, setPortfolioMessage] = useState("");
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
    skill_ids: [],
    specialization_ids: [],
  });
  const [answerMap, setAnswerMap] = useState({});
  const [bankForm, setBankForm] = useState({ bank_code: "", bank_name: "", account_number: "" });
  const [portfolioForm, setPortfolioForm] = useState({ title: "", description: "" });

  const loadPage = async () => {
    const [profileData, categoriesData, linkData] = await Promise.all([
      fetchProfile(),
      profileService.getExpertiseCategories(),
      user?.is_freelancer ? profileService.getShareLinks().catch(() => []) : Promise.resolve([]),
    ]);

    setCategories(categoriesData);
    setShareLinks(linkData);
    if (user?.is_freelancer) {
      const [accounts, portfolio, bankDirectory] = await Promise.all([
        profileService.getBankAccounts().catch(() => []),
        profileService.getPortfolioItems().catch(() => []),
        profileService.getBanks().catch(() => null),
      ]);
      setBankAccounts(accounts);
      setPortfolioItems(portfolio);
      if (bankDirectory) {
        setBanks(bankDirectory);
        setBankDirectoryMessage("");
      } else {
        setBanks([]);
        setBankDirectoryMessage("Bank list is temporarily unavailable. Please try again shortly.");
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
      skill_ids: profileData?.skills?.map((skill) => skill.id) || [],
      specialization_ids: profileData?.specializations?.map((item) => item.id) || [],
    });

    const answers =
      profileData?.question_answers?.reduce((accumulator, item) => {
        accumulator[item.question.id] = item.value;
        return accumulator;
      }, {}) || {};
    setAnswerMap(answers);
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
      await loadPage();
      setMessage("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  };

  const createShareLink = async () => {
    await profileService.createShareLink({});
    setShareLinks(await profileService.getShareLinks());
  };

  const verifyBankAccount = async (event) => {
    event.preventDefault();
    setBankMessage("");
    if (!bankForm.bank_code || !bankForm.account_number) {
      setBankMessage("Choose your bank and enter your account number.");
      return;
    }
    await profileService.createBankAccount(bankForm);
    setBankAccounts(await profileService.getBankAccounts());
    setBankForm({ bank_code: "", bank_name: "", account_number: "" });
    setBankMessage("Bank details submitted for verification.");
  };

  const addPortfolioItem = async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("portfolio-image-input");
    if (!fileInput?.files?.[0]) return;
    const payload = new FormData();
    payload.append("title", portfolioForm.title);
    payload.append("description", portfolioForm.description);
    payload.append("image", fileInput.files[0]);
    await profileService.createPortfolioItem(payload);
    setPortfolioItems(await profileService.getPortfolioItems());
    setPortfolioForm({ title: "", description: "" });
    fileInput.value = "";
    setPortfolioMessage("Portfolio item added.");
  };

  const removePortfolioItem = async (itemId) => {
    await profileService.deletePortfolioItem(itemId);
    setPortfolioItems(await profileService.getPortfolioItems());
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

        <form className="grid gap-6 xl:grid-cols-[1fr_0.8fr]" onSubmit={saveProfile}>
          <div className="space-y-6">
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
                <h2 className="shell-title text-2xl font-bold text-slate-900">Skill-specific intake answers</h2>
                <p className="mt-2 text-sm text-slate-600">
                  These questions are configured by the admin team for your chosen expertise area.
                </p>
                <div className="mt-6 space-y-5">
                  {questionSets.flatMap((set) =>
                    set.questions.map((question) => (
                      <label key={question.id} className="block text-sm font-medium text-slate-700">
                        {question.text}
                        <input
                          value={answerMap[question.id] || ""}
                          onChange={(event) =>
                            setAnswerMap((prev) => ({ ...prev, [question.id]: event.target.value }))
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                          placeholder={question.placeholder || "Add your answer"}
                        />
                      </label>
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
          </div>

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
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Private portfolio links</p>
                      <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Client-shareable profile links</h2>
                    </div>
                    <button type="button" onClick={createShareLink} className="rounded-full bg-workie-blue px-4 py-2 text-sm font-semibold text-white">
                      Create link
                    </button>
                  </div>
                  <div className="mt-5 space-y-3">
                    {shareLinks.length ? (
                      shareLinks.map((link) => (
                        <div key={link.id} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                          <div className="font-semibold text-slate-900">{window.location.origin}/portfolio/{link.token}</div>
                          <div className="mt-1 text-slate-500">{link.is_active ? "Active" : "Inactive"}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No share links yet.</p>
                    )}
                  </div>
                </div>

                <div className="shell-panel p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Portfolio management</p>
                  <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Add and curate work samples</h2>
                  <form className="mt-5 space-y-4" onSubmit={addPortfolioItem}>
                    <label className="block text-sm font-medium text-slate-700">
                      Project title
                      <input
                        value={portfolioForm.title}
                        onChange={(event) => setPortfolioForm((prev) => ({ ...prev, title: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Description
                      <textarea
                        rows="3"
                        value={portfolioForm.description}
                        onChange={(event) => setPortfolioForm((prev) => ({ ...prev, description: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Image
                      <input
                        id="portfolio-image-input"
                        type="file"
                        accept="image/*"
                        className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                      />
                    </label>
                    <button type="submit" className="rounded-2xl bg-workie-blue px-4 py-3 text-sm font-semibold text-white">
                      Add portfolio item
                    </button>
                    {portfolioMessage ? <div className="text-sm text-emerald-700">{portfolioMessage}</div> : null}
                  </form>
                  <div className="mt-5 space-y-3">
                    {portfolioItems.length ? (
                      portfolioItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                              {item.image ? (
                                <img src={item.image} alt={item.title || "Portfolio item"} className="h-16 w-16 rounded-2xl object-cover" />
                              ) : null}
                              <div>
                                <div className="font-semibold text-slate-900">{item.title || "Portfolio item"}</div>
                                <div className="mt-1 text-sm text-slate-500">{item.description}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePortfolioItem(item.id)}
                              className="text-sm font-semibold text-rose-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No portfolio items yet.</p>
                    )}
                  </div>
                </div>

                <div className="shell-panel p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">Payout setup</p>
                  <h2 className="shell-title mt-2 text-2xl font-bold text-slate-900">Verify Nigerian bank details</h2>
                  <form className="mt-5 space-y-4" onSubmit={verifyBankAccount}>
                    <label className="block text-sm font-medium text-slate-700">
                      Bank
                      <select
                        value={bankForm.bank_code}
                        onChange={(event) => {
                          const selectedBank = banks.find((bank) => String(bank.code) === event.target.value);
                          setBankForm((prev) => ({
                            ...prev,
                            bank_code: event.target.value,
                            bank_name: selectedBank?.name || "",
                          }));
                        }}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
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
                        onChange={(event) => setBankForm((prev) => ({ ...prev, account_number: event.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-workie-gold"
                      />
                    </label>
                    <button type="submit" className="rounded-2xl bg-workie-gold px-4 py-3 text-sm font-semibold text-white">
                      Submit for verification
                    </button>
                    {bankDirectoryMessage ? <div className="text-sm text-amber-700">{bankDirectoryMessage}</div> : null}
                    {bankMessage ? <div className="text-sm text-emerald-700">{bankMessage}</div> : null}
                  </form>
                  <div className="mt-5 space-y-3">
                    {bankAccounts.length ? (
                      bankAccounts.map((account) => (
                        <div key={account.id} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                          <div className="font-semibold text-slate-900">
                            {account.bank_name || account.bank_code} - {account.account_number}
                          </div>
                          <div className="mt-1 text-slate-500">
                            {account.account_name || "Awaiting verification"} - {account.status}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No bank accounts submitted yet.</p>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
