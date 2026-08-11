/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FiUploadCloud, FiFolder, FiPlayCircle } from "react-icons/fi";
const Workflow = () => {
  const steps = [
    [
      "01",
      FiUploadCloud,
      "Upload",
      "Upload your PPT, PDF, DOC or other supported documents.",
    ],
    [
      "02",
      FiFolder,
      "Organize",
      "Keep your presentations organized and choose the files you want.",
    ],
    [
      "03",
      FiPlayCircle,
      "Present",
      "Open your selected document and start presenting with confidence.",
    ],
  ];
  return (
    <section
      id="workflow"
      className="mx-auto max-w-[1100px] px-[18px] py-20 sm:px-6 sm:py-[120px]"
    >
      <div className="mx-auto mb-10 max-w-[650px] text-center sm:mb-[60px]">
        <span className="text-[13px] font-bold tracking-[1px] text-[var(--primary)] uppercase">
          Simple Workflow
        </span>
        <h2 className="mt-3 text-[clamp(35px,4vw,50px)] leading-[1.15] font-bold tracking-[-2px]">
          From upload to{" "}
          <strong className="text-[var(--primary)]">presentation.</strong>
        </h2>
        <p className="mt-[15px] leading-[1.7] text-[var(--text-secondary)]">
          Three simple steps to turn your documents into a presentation.
        </p>
      </div>
      <div className="grid gap-[25px] lg:grid-cols-3">
        {steps.map(([number, Icon, title, description], index) => (
          <motion.div
            className="relative rounded-[20px] border border-[var(--border)] bg-[var(--card)] px-[25px] py-[35px] text-center"
            key={number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <span className="absolute top-[15px] right-[18px] text-[11px] font-bold text-[var(--text-muted)]">
              {number}
            </span>
            <span className="mx-auto mt-2.5 mb-5 flex size-[60px] items-center justify-center rounded-[17px] bg-[var(--primary-soft)] text-[25px] text-[var(--primary)]">
              <Icon />
            </span>
            <h3 className="mb-2.5 text-lg font-bold">{title}</h3>
            <p className="text-[13px] leading-[1.7] text-[var(--text-secondary)]">
              {description}
            </p>
            {index !== 2 && (
              <i className="absolute top-1/2 -right-[33px] hidden h-px w-10 bg-[var(--border)] lg:block" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default Workflow;
