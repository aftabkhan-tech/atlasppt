/* eslint-disable no-unused-vars */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiUploadCloud,
  FiLogIn,
  FiUser,
  FiLogOut,
  FiFolder,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../AuthContext";
import { API_URL } from "../../api";
import { toast } from "react-toastify";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#workflow" },
    { name: "About", href: "#about" },
  ];

  const actionClasses =
    "flex items-center gap-2 rounded-[10px] px-[17px] py-2.5 text-sm font-semibold";

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">

      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-6">

        {/* Logo */}
        <motion.a
          href="#home"
          className="flex items-center gap-2.5 text-[19px] font-extrabold sm:text-[22px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="flex size-[35px] items-center justify-center rounded-[10px] bg-linear-to-br from-[var(--primary)] to-violet-500 text-white">
            <FiUploadCloud />
          </span>

          Presento
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="rounded-[10px] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">

          <ThemeToggle />

          {/* If user is not logged in */}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className={`${actionClasses} cursor-pointer bg-[var(--primary-soft)] text-[var(--primary)]`}
            >
              <FiLogIn />
              Login
            </button>
          ) : (
            /* Profile */
            <div className="group relative">

              {/* Profile Icon */}
              <button
                className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
              >
                <FiUser size={20} />
              </button>

              {/* Profile Dropdown */}
              <div className="pointer-events-none absolute top-[52px] right-0 w-[260px] translate-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 opacity-0 shadow-[var(--shadow)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">

                {/* User Info */}
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">

                  <div className="flex size-[45px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                    <FiUser size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                  </div>

                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                >
                  <FiLogOut />
                  Logout
                </button>

              </div>
            </div>
          )}

          {user && (
            <button
              onClick={() => navigate("/ppt")}
              className={`${actionClasses} cursor-pointer bg-[var(--primary-soft)] text-[var(--primary)]`}
            >
              <FiFolder />
              My PPTs
            </button>
          )}

          {/* Upload */}
          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
                return;
              }

              navigate("/upload");
            }}
            className={`${actionClasses} cursor-pointer bg-[var(--primary)] text-white`}
          >
            <FiUploadCloud />
            Upload
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="cursor-pointer text-[25px] lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="flex flex-col gap-1 border-t border-[var(--border)] px-6 pt-2.5 pb-5 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >

            {/* Nav Links */}
            {navItems.map((item) => (
              <a
                key={item.name}
                className="rounded-[10px] p-3 text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className="mt-2 border-t border-[var(--border)] pt-3">

              {!user ? (
                /* Mobile Login */
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className={`${actionClasses} w-full cursor-pointer justify-center bg-[var(--primary-soft)] text-[var(--primary)]`}
                >
                  <FiLogIn />
                  Login
                </button>
              ) : (
                /* Mobile User */
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">

                  <div className="flex items-center gap-3">

                    <div className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                      <FiUser />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[var(--text-secondary)]">
                        {user.email}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500"
                  >
                    <FiLogOut />
                    Logout
                  </button>

                </div>
              )}

              {user && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/ppt");
                  }}
                  className={`${actionClasses} mt-2 w-full cursor-pointer justify-center bg-[var(--primary-soft)] text-[var(--primary)]`}
                >
                  <FiFolder />
                  My PPTs
                </button>
              )}

              {/* Mobile Upload */}
              <button
                onClick={() => {
                  setMenuOpen(false);

                  if (!user) {
                    navigate("/login");
                    return;
                  }

                  navigate("/upload");
                }}
                className={`${actionClasses} mt-2 w-full cursor-pointer justify-center bg-[var(--primary)] text-white`}
              >
                <FiUploadCloud />
                Upload
              </button>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
