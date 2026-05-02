import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logoImage from "../assets/logo2.png";

const navLinks = [
  { label: "How it works", to: "/#how-it-works" },
  { label: "Trust process", to: "/#trust" },
];

const Navbar = ({ tone = "light" }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navIsSolid = isScrolled || tone === "solid" || isOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.nav
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto max-w-7xl rounded-full border px-4 py-3 backdrop-blur-xl transition-all duration-300 ${
          navIsSolid
            ? "border-white/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
            : "border-white/70 bg-white/70 shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label="WorkieTechie home">
            <img src={logoImage} alt="WorkieTechie" className="h-11 w-auto" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-workie-blue"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link to="/login" className="rounded-full px-4 py-2.5 text-sm font-semibold text-workie-blue transition hover:bg-slate-100">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-workie-gold px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-500">
              Create account
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-workie-blue shadow-sm transition hover:border-workie-gold lg:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Menu</span>
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "rotate-45" : "-translate-y-1.5"}`}
            />
            <span className={`absolute h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span
              className={`absolute h-0.5 w-5 rounded-full bg-current transition ${isOpen ? "-rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[28px] border border-white/80 bg-white/95 p-3 shadow-[0_22px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:hidden"
          >
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-workie-blue"
              >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
              <Link to="/register" onClick={() => setIsOpen(false)} className="rounded-2xl bg-workie-gold px-4 py-3 text-center text-sm font-semibold text-white">
                Create account
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-workie-blue">
                Login
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
