import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
  FiMinimize,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../api";

const Presentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewerRef = useRef(null);

  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState(1);
  const [sidebar, setSidebar] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ============================
  // LOAD PRESENTATION
  // ============================
  useEffect(() => {
    const loadPresentation = async () => {
      try {
        setLoading(true);

        // Get presentation metadata
        const metadata = await axios.get(
          `${API_URL}/api/ppt/${id}`,
          {
            withCredentials: true,
          }
        );

        // Get PPTX slides
        const slideResponse = await axios.get(
          `${API_URL}/api/ppt/${id}/slides`,
          {
            withCredentials: true,
          }
        );

        setPresentation(metadata.data.presentation);
        setSlides(slideResponse.data.slides || []);
        setSlide(1);

      } catch (error) {
        console.error("Presentation loading error:", error);

        toast.error(
          error.response?.data?.message ||
            "Could not load presentation."
        );

        navigate("/ppt", { replace: true });

      } finally {
        setLoading(false);
      }
    };

    loadPresentation();
  }, [id, navigate]);

  // ============================
  // FULLSCREEN
  // ============================
  useEffect(() => {
    const onFullscreen = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      onFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreen
      );
    };
  }, []);

  // ============================
  // KEYBOARD NAVIGATION
  // ============================
  useEffect(() => {
    const onKey = (event) => {
      if (
        ["ArrowRight", " ", "PageDown"].includes(event.key)
      ) {
        event.preventDefault();

        setSlide((current) =>
          Math.min(current + 1, slides.length)
        );
      }

      if (
        ["ArrowLeft", "PageUp"].includes(event.key)
      ) {
        event.preventDefault();

        setSlide((current) =>
          Math.max(current - 1, 1)
        );
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [slides.length]);

  // ============================
  // FULLSCREEN TOGGLE
  // ============================
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current?.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <main className="min-h-screen bg-[#08080a] pt-32 text-center text-white/60">
        Loading presentation...
      </main>
    );
  }

  // ============================
  // NO PRESENTATION
  // ============================
  if (!presentation || slides.length === 0) {
    return (
      <main className="min-h-screen bg-[#08080a] pt-32 text-center text-white/60">
        <p>No readable slides found.</p>

        <button
          onClick={() => navigate("/ppt")}
          className="mt-5 rounded-lg bg-indigo-500 px-5 py-2 text-white"
        >
          Back to presentations
        </button>
      </main>
    );
  }

  const currentSlide = slides[slide - 1];

  return (
    <main
      ref={viewerRef}
      className="flex min-h-screen overflow-hidden bg-[#09090b] text-white"
    >
      {/* ============================
          SIDEBAR
      ============================ */}
      <aside
        className={`${
          sidebar ? "w-[230px]" : "w-0"
        } hidden shrink-0 overflow-hidden border-r border-white/10 bg-[#111116] transition-all duration-300 md:block`}
      >
        <div className="w-[230px] p-4">
          <p className="mb-4 truncate text-sm font-bold">
            {presentation.name}
          </p>

          <p className="mb-3 text-xs text-white/50">
            Slides ({slides.length})
          </p>

          <div className="space-y-2 overflow-y-auto pr-1">
            {slides.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSlide(index + 1)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  slide === index + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 text-white/65 hover:bg-white/10"
                }`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded bg-black/20 text-xs">
                  {index + 1}
                </span>

                <span className="truncate">
                  Slide {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ============================
          MAIN
      ============================ */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <header className="flex h-[70px] items-center justify-between border-b border-white/10 bg-[#111116] px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate("/ppt")}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/10"
            >
              <FiArrowLeft />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {presentation.name}
              </p>

              <p className="text-[11px] text-white/50">
                Slide {slide} of {slides.length}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSidebar(!sidebar)}
              className="hidden size-9 cursor-pointer items-center justify-center rounded-lg bg-white/10 md:flex"
            >
              {sidebar ? <FiX /> : <FiMenu />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/10"
            >
              {fullscreen ? (
                <FiMinimize />
              ) : (
                <FiMaximize />
              )}
            </button>
          </div>
        </header>

        {/* ============================
            SLIDE
        ============================ */}
        <section className="flex min-h-0 flex-1 items-center justify-center bg-black p-3 sm:p-6">
          <div className="flex aspect-video w-full max-w-[1400px] flex-col overflow-hidden rounded-lg bg-white text-black shadow-2xl">

            {/* Slide header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <span className="text-sm font-medium text-gray-500">
                Slide {slide}
              </span>

              <span className="text-xs text-gray-400">
                {presentation.name}
              </span>
            </div>

            {/* Slide content */}
            <div className="flex flex-1 items-center justify-center overflow-auto p-8 sm:p-12">
              <div className="w-full max-w-4xl whitespace-pre-wrap text-center text-xl leading-relaxed sm:text-2xl">
                {currentSlide?.text ||
                  "This slide has no readable text content."}
              </div>
            </div>

          </div>
        </section>

        {/* ============================
            FOOTER
        ============================ */}
        <footer className="flex items-center justify-between border-t border-white/10 bg-[#111116] px-4 py-4 sm:px-6">
          <span className="text-xs text-white/60">
            {slide} / {slides.length}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setSlide((current) =>
                  Math.max(current - 1, 1)
                )
              }
              disabled={slide === 1}
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={() =>
                setSlide((current) =>
                  Math.min(
                    current + 1,
                    slides.length
                  )
                )
              }
              disabled={slide === slides.length}
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FiChevronRight />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Presentation;
