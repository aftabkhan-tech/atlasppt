/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import {
  FiUploadCloud,
  FiFolder,
  FiMonitor,
  FiShield,
  FiSearch,
  FiLayers,
} from "react-icons/fi";
const Features = () => {
  const features = [
    [
      FiUploadCloud,
      "Easy File Upload",
      "Upload your presentations and documents quickly with a simple and intuitive interface.",
    ],
    [
      FiFolder,
      "Organize Everything",
      "Keep your important presentations and documents organized in one centralized workspace.",
    ],
    [
      FiMonitor,
      "Presentation Mode",
      "Open your selected files in a focused presentation environment without distractions.",
    ],
    [
      FiShield,
      "Secure Documents",
      "Keep your important files protected and accessible only to the people you trust.",
    ],
    [
      FiSearch,
      "Find Instantly",
      "Quickly search through your uploaded presentations and documents whenever you need them.",
    ],
    [
      FiLayers,
      "Smart Workspace",
      "Manage multiple file types from a single modern and responsive workspace.",
    ],
  ];
  return (
    <section
      id="features"
      className="mx-auto max-w-[1200px] px-[18px] py-20 sm:px-6 sm:py-[120px]"
    >
      <div className="mx-auto mb-10 max-w-[650px] text-center sm:mb-[60px]">
        <motion.span
          className="text-[13px] font-bold tracking-[1px] text-[var(--primary)] uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.span>
        <motion.h2
          className="mt-3 text-[clamp(35px,4vw,50px)] leading-[1.15] font-bold tracking-[-2px]"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Everything you need to{" "}
          <strong className="text-[var(--primary)]">present better.</strong>
        </motion.h2>
        <p className="mt-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Presento gives you a simple workspace to manage, organize and present
          your documents.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, description], index) => (
          <motion.div
            className="rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-7 transition hover:border-[var(--primary)] hover:shadow-[0_15px_40px_rgba(99,102,241,.08)]"
            key={title}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -8 }}
          >
            <span className="mb-5 flex size-12 items-center justify-center rounded-[13px] bg-[var(--primary-soft)] text-[21px] text-[var(--primary)]">
              <Icon />
            </span>
            <h3 className="mb-2.5 text-[17px] font-bold">{title}</h3>
            <p className="text-[13px] leading-[1.7] text-[var(--text-secondary)]">
              {description}
            </p>
            <a
              className="mt-[18px] inline-block text-xs font-bold text-[var(--primary)]"
              href="#workflow"
            >
              Learn more →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default Features;
