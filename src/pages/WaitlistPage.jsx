import { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiOutlineCheckCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";

import profileService from "../services/profileService";

const audienceOptions = [
  {
    id: "professional",
    title: "Professional",
    body: "Join first if you want to be considered for vetted client work as the talent pool opens.",
  },
  {
    id: "client",
    title: "Client",
    body: "Join if you want early access to guided project requests and vetted professional matching.",
  },
];

const WaitlistPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    audience: "professional",
    expertise_category_id: "",
    note: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  useEffect(() => {
    profileService.getExpertiseCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: false });
    try {
      await profileService.joinWaitlist({
        ...formData,
        expertise_category_id: formData.expertise_category_id || null,
        source: "waitlist_page",
      });
      setStatus({ loading: false, error: "", success: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: error?.response?.data?.email?.[0] || error?.response?.data?.detail || "Could not join the waitlist. Please try again.",
        success: false,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf0] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[38px] bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-8 text-white shadow-[0_26px_90px_rgba(21,75,108,0.22)] sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">Early access</p>
          <h1 className="shell-title mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            Join the WorkieTechie waitlist.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-100 sm:text-lg">
            We are prioritizing serious professionals first, so the talent pool is strong before wider client demand is opened. Clients can still join to be notified when request access expands.
          </p>
          <div className="mt-8 grid gap-4">
            {["Vetted professional onboarding", "Guided client project requests", "Portfolio visibility controlled by quality review", "Matching built around accountability"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">
            Back to homepage <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="rounded-[38px] border border-white/80 bg-white p-6 shadow-[0_26px_80px_rgba(15,23,42,0.08)] sm:p-8">
          {status.success ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <HiOutlineCheckCircle className="h-16 w-16 text-emerald-500" />
              <h2 className="shell-title mt-5 text-3xl font-bold text-slate-950">You are on the list.</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                Thanks for your interest. We will use your selected category to prioritize relevant early-access updates.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus({ loading: false, error: "", success: false });
                  setFormData({ name: "", email: "", audience: "professional", expertise_category_id: "", note: "" });
                }}
                className="mt-6 rounded-full bg-workie-blue px-6 py-3 text-sm font-bold text-white"
              >
                Add another person
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-workie-gold">Tell us where you fit</p>
                <h2 className="shell-title mt-2 text-3xl font-bold text-slate-950">Reserve your early spot</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {audienceOptions.map((option) => {
                  const isSelected = formData.audience === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateField("audience", option.id)}
                      className={`rounded-[24px] border p-4 text-left transition hover:-translate-y-0.5 ${
                        isSelected ? "border-workie-gold bg-amber-50" : "border-slate-200 bg-white hover:border-workie-blue"
                      }`}
                    >
                      <p className="font-bold text-slate-950">{option.title}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{option.body}</p>
                    </button>
                  );
                })}
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input
                  required
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                  placeholder="Your name"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Primary interest
                <select
                  value={formData.expertise_category_id}
                  onChange={(event) => updateField("expertise_category_id", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                >
                  <option value="">Not sure yet</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Short note
                <textarea
                  value={formData.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-workie-gold focus:bg-white"
                  placeholder={formData.audience === "professional" ? "What do you do best?" : "What kind of work might you need?"}
                />
              </label>

              {status.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{status.error}</div> : null}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full rounded-2xl bg-workie-gold px-5 py-3.5 text-sm font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status.loading ? "Joining waitlist..." : "Join waitlist"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default WaitlistPage;
