import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import logoImage from "../assets/logo2.png";
import profileService from "../services/profileService";

const SharedPortfolioPage = () => {
  const { token } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getSharedProfile(token)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-workie-blue border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="shell-card max-w-lg p-8 text-center">
          <h1 className="shell-title text-3xl font-bold text-slate-900">Profile unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This portfolio link is no longer active or could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="shell-card bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-8 text-white sm:p-10">
          <img src={logoImage} alt="WorkieTechie" className="h-12 w-auto" />
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">Curated professional portfolio</p>
              <h1 className="shell-title mt-2 text-4xl font-bold">{profile.name}</h1>
              <p className="mt-2 text-lg text-slate-100">{profile.title}</p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100">{profile.bio}</p>
            </div>
            <div className="rounded-3xl bg-white/10 px-5 py-4 text-right backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-200">Primary expertise</div>
              <div className="mt-2 text-lg font-semibold">{profile.expertise_category?.name || "Professional"}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">About this professional</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{profile.bio || "No bio provided yet."}</p>
            </div>

            {profile.portfolio?.length ? (
              <div className="shell-panel p-6">
                <h2 className="shell-title text-2xl font-bold text-slate-900">Selected work</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                      {item.image ? (
                        <img src={item.image} alt={item.title || "Portfolio item"} className="h-52 w-full object-cover" />
                      ) : null}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-900">{item.title || "Portfolio item"}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Specializations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.specializations?.length ? (
                  profile.specializations.map((item) => (
                    <span key={item.id} className="status-pill bg-slate-100 text-slate-700">
                      {item.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No specializations listed.</p>
                )}
              </div>
            </div>

            <div className="shell-panel p-6">
              <h2 className="shell-title text-2xl font-bold text-slate-900">Certifications</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {profile.certifications || "No certifications shared yet."}
              </p>
            </div>

            {profile.hourly_rate ? (
              <div className="shell-panel p-6">
                <h2 className="shell-title text-2xl font-bold text-slate-900">Commercial context</h2>
                <p className="mt-4 text-sm text-slate-600">
                  Indicative rate: <span className="font-semibold text-slate-900">${profile.hourly_rate}/hr</span>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPortfolioPage;
