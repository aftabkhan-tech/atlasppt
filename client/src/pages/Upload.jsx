import { useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFile,
  FiFileText,
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../api";

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const allowedTypes = [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const maxFileSize = 20 * 1024 * 1024;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(
        "Only PPT and PPTX files are allowed."
      );
      return;
    }

    if (selectedFile.size > maxFileSize) {
      toast.error("File size must be less than 20MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];

    handleFile(selectedFile);

    // Allow selecting same file again
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];

    handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const getFileIcon = () => {
    if (!file) return <FiUploadCloud />;

    if (file.type.includes("pdf")) {
      return <FiFileText />;
    }

    if (
      file.type.includes("presentation") ||
      file.name.endsWith(".ppt") ||
      file.name.endsWith(".pptx")
    ) {
      return <FiImage />;
    }

    return <FiFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API_URL}/api/ppt/upload`, formData, { withCredentials: true });

      toast.success("Document uploaded successfully!");

      setFile(null);
      navigate("/ppt");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 pt-[100px] sm:px-6">

      {/* Background Glow */}
      <div className="pointer-events-none fixed top-[120px] left-1/2 -z-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1050px]">

        {/* Back */}
        <Motion.button
          onClick={() => navigate(-1)}
          className="mb-7 flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FiArrowLeft />
          Back
        </Motion.button>

        {/* Heading */}
        <Motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 flex items-center gap-3">

            <span className="flex size-[48px] items-center justify-center rounded-[14px] bg-[var(--primary-soft)] text-[22px] text-[var(--primary)]">
              <FiUploadCloud />
            </span>

            <div>
              <p className="text-xs font-bold tracking-[1px] text-[var(--primary)] uppercase">
                Workspace
              </p>

              <h1 className="text-3xl font-bold tracking-[-1px] sm:text-4xl">
                Upload a document
              </h1>
            </div>

          </div>

          <p className="max-w-[650px] text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            Upload your presentations and documents to keep everything
            organized in one beautiful workspace.
          </p>
        </Motion.div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">

          {/* Upload Card */}
          <Motion.div
            className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] sm:p-7"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex min-h-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border-2 border-dashed px-5 text-center transition-all duration-300 sm:min-h-[400px] ${
                dragActive
                  ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                  : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/40"
              }`}
            >

              {/* Glow */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 size-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[70px]" />

              <Motion.div
                animate={
                  dragActive
                    ? {
                        scale: 1.15,
                        y: -5,
                      }
                    : {
                        scale: 1,
                        y: 0,
                      }
                }
                className="relative z-10 flex size-[76px] items-center justify-center rounded-[22px] bg-[var(--primary-soft)] text-[32px] text-[var(--primary)]"
              >
                <FiUploadCloud />
              </Motion.div>

              <h2 className="relative z-10 mt-6 text-xl font-bold">
                {dragActive
                  ? "Drop your file here"
                  : "Drag & drop your file here"}
              </h2>

              <p className="relative z-10 mt-2 text-sm text-[var(--text-secondary)]">
                or click anywhere to browse from your device
              </p>

              <span className="relative z-10 mt-5 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(99,102,241,.2)]">
                Choose File
              </span>

              <p className="relative z-10 mt-5 text-xs text-[var(--text-muted)]">
                PDF, PPT, PPTX, DOC & DOCX · Maximum 20MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".ppt,.pptx"
                onChange={handleInputChange}
              />
            </div>

            {/* Selected File */}
            <AnimatePresence>
              {file && (
                <Motion.div
                  initial={{ opacity: 0, y: 15, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">

                    <div className="flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-xl text-[var(--primary)]">
                      {getFileIcon()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <FiCheckCircle className="shrink-0 text-lg text-emerald-500" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-500"
                    >
                      <FiX />
                    </button>

                  </div>
                </Motion.div>
              )}
            </AnimatePresence>

            {/* Upload Button */}
            <Motion.button
              onClick={handleUpload}
              disabled={uploading || !file}
              whileHover={file && !uploading ? { scale: 1.02 } : {}}
              whileTap={file && !uploading ? { scale: 0.98 } : {}}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                file && !uploading
                  ? "cursor-pointer bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[0_12px_30px_rgba(99,102,241,.2)]"
                  : "cursor-not-allowed bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              }`}
            >
              <FiUploadCloud />

              {uploading ? "Uploading..." : "Upload Document"}
            </Motion.button>

          </Motion.div>

          {/* Right Information */}
          <Motion.div
            className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow)] sm:p-6"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

            <p className="text-xs font-bold tracking-[1px] text-[var(--primary)] uppercase">
              Supported files
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Everything you need
            </h2>

            <div className="mt-6 space-y-3">

              {[
                {
                  icon: <FiImage />,
                  title: "PowerPoint",
                  desc: ".ppt and .pptx presentations",
                },
                {
                  icon: <FiFileText />,
                  title: "PDF Documents",
                  desc: "PDF files for presentation",
                },
                {
                  icon: <FiFile />,
                  title: "Word Documents",
                  desc: ".doc and .docx files",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3.5"
                >
                  <div className="flex size-[40px] shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* Tips */}
            <div className="mt-6 rounded-xl bg-[var(--primary-soft)] p-4">
              <p className="text-sm font-bold text-[var(--primary)]">
                ✨ Quick tip
              </p>

              <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
                Upload clear and well-structured files for the best
                presentation experience.
              </p>
            </div>

          </Motion.div>

        </div>
      </div>
    </main>
  );
};

export default Upload;
