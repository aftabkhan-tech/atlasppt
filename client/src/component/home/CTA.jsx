import { motion as Motion } from "framer-motion";
import { FiArrowRight, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";

const CTA = () => {
    const { user } = useAuth();
  return (
    <section
      id="about"
      className="px-[18px] pt-2.5 pb-[70px] sm:px-6 sm:pt-[30px] sm:pb-[100px]"
    >
      <Motion.div
        className="relative mx-auto max-w-[1150px] overflow-hidden rounded-[28px] bg-linear-to-br from-gray-900 to-indigo-900 px-5 py-[60px] text-center text-white shadow-[0_25px_70px_rgba(79,70,229,.2)] sm:px-[30px] sm:py-20"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute -top-[150px] -right-[100px] size-[300px] rounded-full bg-violet-500 opacity-25 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-[650px]">
          <span className="mx-auto flex size-[60px] items-center justify-center rounded-[18px] bg-white/10 text-[25px]">
            <FiUploadCloud />
          </span>

          <h2 className="mt-5 text-[clamp(34px,5vw,52px)] leading-[1.1] font-bold tracking-[-2px]">
            Ready to make your{" "}
            <span className="text-indigo-300">
              presentations better?
            </span>
          </h2>

          <p className="mx-auto mt-5 mb-[30px] max-w-[550px] leading-[1.7] text-slate-300">
            Upload your documents, organize your workspace and present
            everything from one beautiful platform.
          </p>

          <Motion.button
            className="mx-auto flex items-center gap-2 rounded-xl bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] px-5 py-3.5 text-sm font-bold text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              toast.success("Upload system is coming soon!")
            }
          >
            { user?"Upload":"Get Started"} <FiArrowRight />
          </Motion.button>
        </div>
      </Motion.div>
    </section>
  );
};

export default CTA;