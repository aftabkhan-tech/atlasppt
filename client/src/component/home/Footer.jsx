import { FiUploadCloud, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
const Footer = () => {
  const social = [FiGithub, FiTwitter, FiLinkedin];
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-[18px] pt-[50px] pb-5 sm:px-6 sm:pt-[70px] sm:pb-[25px]">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:gap-[50px] lg:grid-cols-[1.5fr_1fr] lg:gap-[100px]">
        <div className="max-w-[350px]">
          <div className="flex items-center gap-2.5 text-xl font-extrabold">
            <span className="flex size-[35px] items-center justify-center rounded-[11px] bg-linear-to-br from-[var(--primary)] to-violet-500 text-white">
              <FiUploadCloud />
            </span>
            Presento
          </div>
          <p className="mt-[18px] text-[13px] leading-[1.7] text-[var(--text-secondary)]">
            Upload. Organize. Present. Your modern workspace for documents and
            presentations.
          </p>
          <div className="mt-5 flex gap-2.5">
            {social.map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Social link"
                className="flex size-[35px] items-center justify-center rounded-[9px] border border-[var(--border)] text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10">
          {[
            ["Product", ["Features", "How It Works", "Presentation", "Upload"]],
            ["Company", ["About", "Contact", "Privacy", "Terms"]],
          ].map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="mb-[5px] text-sm font-bold">{title}</h4>
              {links.map((link) => (
                <a
                  key={link}
                  href={
                    link === "Features"
                      ? "#features"
                      : link === "How It Works"
                        ? "#workflow"
                        : link === "About"
                          ? "#about"
                          : "#"
                  }
                  className="text-xs text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1200px] flex-col gap-5 border-t border-[var(--border)] pt-5 text-[11px] text-[var(--text-muted)] sm:mt-[60px] sm:flex-row sm:justify-between">
        <p>© 2026 Presento. All rights reserved.</p>
        <span>Built for better presentations.</span>
      </div>
    </footer>
  );
};
export default Footer;
