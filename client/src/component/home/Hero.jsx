/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";

const Hero = () => (
  <section
    id="home"
    className="relative min-h-auto overflow-hidden pt-[130px] pb-20 sm:min-h-[850px] sm:pt-40"
  >
    <div className="pointer-events-none absolute top-[50px] -left-[150px] size-[450px] rounded-full bg-[var(--primary)] opacity-15 blur-[100px]" />
    <div className="pointer-events-none absolute -right-[100px] -bottom-[150px] size-[450px] rounded-full bg-purple-500 opacity-15 blur-[100px]" />
    <div className="relative mx-auto grid max-w-[1200px] items-center gap-[60px] px-[18px] text-center lg:grid-cols-[1fr_.95fr] lg:gap-[70px] lg:px-6 lg:text-left">
      <div className="flex flex-col items-center lg:items-start">
        <div className="mb-[25px] flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--primary-soft)] px-3.5 py-2 text-[13px] font-semibold text-[var(--primary)]">
          <span className="size-[7px] rounded-full bg-green-500 shadow-[0_0_0_5px_rgba(34,197,94,.1)]" />
          The modern presentation workspace
        </div>
        <h1 className="max-w-[700px] text-[40px] leading-[1.05] font-bold tracking-[-2px] sm:text-[clamp(48px,6vw,76px)] sm:tracking-[-3px]">
          Your presentations,
          <span className="block bg-linear-to-br from-[var(--primary)] to-purple-500 bg-clip-text text-transparent">
            {" "}
            beautifully organized.
          </span>
        </h1>
        <p className="mt-[25px] max-w-[700px] text-sm leading-[1.8] text-[var(--text-secondary)] sm:text-[17px]">
          Upload, organize and present your important documents from one
          beautiful, focused workspace.
        </p>
        <div className="mt-[35px] flex w-full flex-col gap-[14px] sm:w-auto sm:flex-row">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,102,241,.25)] sm:w-auto">
            Get Started <FiArrowRight />
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3.5 text-sm font-bold sm:w-auto">
            Explore features
          </button>
        </div>
        <p className="mt-[25px] flex flex-wrap items-center justify-center gap-2 text-[13px] text-[var(--text-secondary)] lg:justify-start">
          <FiCheckCircle className="text-green-500" />
          No credit card required <span>•</span> Free to get started
        </p>
      </div>
      <motion.div
        className="relative mx-auto w-full max-w-[650px]"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="rotate-0 rounded-3xl border border-[var(--border)] bg-linear-to-br from-[var(--card-solid)] to-[var(--bg-secondary)] p-3 shadow-[var(--shadow)] sm:rotate-1 sm:p-[18px]">
          <div className="flex items-center gap-[15px] border-b border-[var(--border)] px-[5px] pt-1 pb-[18px]">
            <span className="flex gap-[5px]">
              <i className="size-2 rounded-full bg-[var(--text-muted)]" />
              <i className="size-2 rounded-full bg-[var(--text-muted)]" />
              <i className="size-2 rounded-full bg-[var(--text-muted)]" />
            </span>
            <span className="text-[13px] font-bold">My Workspace</span>
          </div>
          <div className="my-5 rounded-[18px] border border-dashed border-[var(--primary)] bg-[var(--primary-soft)] px-5 py-[30px] text-center">
            <span className="mx-auto flex size-[55px] items-center justify-center rounded-2xl bg-[var(--primary)] text-[25px] text-white">
              <FiUploadCloud />
            </span>
            <h3 className="mt-[15px] text-base font-bold">Drop files here</h3>
            <p className="my-[6px] mb-[15px] text-xs text-[var(--text-secondary)]">
              PPT, PDF, DOC and more
            </p>
            <button className="rounded-lg bg-[var(--card-solid)] px-[15px] py-[9px] text-xs font-semibold">
              Browse files
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              ["Quarterly Report.pptx", "PPT"],
              ["Presentation notes.pdf", "PDF"],
            ].map(([name, type]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-[13px] border border-[var(--border)] bg-[var(--bg-secondary)] p-3"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-[10px] text-lg ${type === "PPT" ? "bg-orange-500/10 text-orange-500" : "bg-red-500/10 text-red-500"}`}
                >
                  <FiFileText />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-bold">{name}</h4>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Uploaded just now
                  </span>
                </div>
                <FiCheckCircle className="ml-auto text-green-500" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-[25px] left-[5px] flex min-w-[200px] items-center gap-3 rounded-[15px] border border-[var(--border)] bg-[var(--card-solid)] p-[15px] shadow-[var(--shadow)] sm:-bottom-[30px] sm:-left-[35px] sm:min-w-[220px]">
          <FiCheckCircle className="size-[38px] rounded-[10px] bg-[var(--primary-soft)] p-[9px] text-[var(--primary)]" />
          <div className="flex flex-col gap-[3px]">
            <strong className="text-xs">Ready to present</strong>
            <span className="text-[10px] text-[var(--text-secondary)]">
              Everything in one place
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
export default Hero;
