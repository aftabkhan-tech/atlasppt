/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FiUploadCloud, FiFileText, FiMonitor, FiZap } from "react-icons/fi";
const Stats = () => {
  const stats = [
    [FiUploadCloud, "10K+", "Files Uploaded"],
    [FiFileText, "5K+", "Documents Managed"],
    [FiMonitor, "2K+", "Presentations"],
    [FiZap, "99.9%", "Fast Experience"],
  ];
  return (
    <section className="border-y border-[var(--border)] px-6 py-[50px]">
      <div className="mx-auto grid max-w-[1200px] gap-[5px] sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {stats.map(([Icon, number, text], index) => (
          <motion.div
            className="flex items-center gap-[15px] rounded-[15px] p-[15px] sm:p-5"
            key={text}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <span className="flex size-[45px] shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl text-[var(--primary)]">
              <Icon />
            </span>
            <div>
              <h3 className="text-[23px] font-bold">{number}</h3>
              <p className="mt-[3px] text-xs text-[var(--text-secondary)]">
                {text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default Stats;
