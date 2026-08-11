import axios from "axios";
import { useState } from "react";
import { FiArrowRight, FiLock, FiMail, FiUploadCloud } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { API_URL } from "../api";

const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const { setUser } = useAuth();
     const navigate = useNavigate();
     const location = useLocation();
     const handlelogin= async (e)=>{
    e.preventDefault()
    try{
     const result= await axios.post(`${API_URL}/api/auth/login`,{email,password},{withCredentials:true})
     setUser(result.data.user)
     toast.success(result.data.message)
     navigate(location.state?.from || "/ppt", { replace: true })
    } catch(error){
     toast.error(error.response?.data?.message || "Login failed")
    }
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-[18px] py-10 text-[var(--text)] sm:px-6">
      <div className="pointer-events-none absolute -top-32 -left-32 size-[420px] rounded-full bg-[var(--primary)] opacity-15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 size-[420px] rounded-full bg-violet-500 opacity-15 blur-[100px]" />

      <section className="relative z-10 w-full max-w-[440px] rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] backdrop-blur-sm sm:p-9">
        <Link
          to="/"
          className="mx-auto flex w-fit items-center gap-2.5 text-[22px] font-extrabold"
        >
          <span className="flex size-[38px] items-center justify-center rounded-[11px] bg-linear-to-br from-[var(--primary)] to-violet-500 text-white shadow-[0_8px_25px_rgba(99,102,241,.3)]">
            <FiUploadCloud />
          </span>
          Presento
        </Link>

        <div className="mt-8 text-center">
          <p className="text-[13px] font-bold tracking-[1px] text-[var(--primary)] uppercase">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-1px]">
            Sign in to your workspace
          </h1>
          <p className="mt-3 text-sm leading-[1.7] text-[var(--text-secondary)]">
            Continue organizing and presenting your best work.
          </p>
        </div>

        <form onSubmit={handlelogin} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">
            Email address
            <span className="relative mt-2 block">
              <FiMail className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
              onChange={(e)=>setEmail(e.target.value)} value={email}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pr-4 pl-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                type="email"
                placeholder="you@example.com"
              />
            </span>
          </label>

          <label className="block text-sm font-semibold">
            Password
            <span className="relative mt-2 block">
              <FiLock className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
              onChange={(e)=>setPassword(e.target.value)} value={password}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pr-4 pl-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                type="password"
                placeholder="Enter your password"
              />
            </span>
          </label>

          <div className="flex items-center justify-between gap-4 text-xs">
            <label className="flex items-center gap-2 text-[var(--text-secondary)]">
              <input className="accent-[var(--primary)]" type="checkbox" />
              Remember me
            </label>
            <a className="font-semibold text-[var(--primary)]" href="#forgot-password">
              Forgot password?
            </a>
          </div>

          <button
          type="submit"
           className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,102,241,.25)]">
            Sign in <FiArrowRight />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--text-secondary)]">
          New to Presento?{" "}
          <Link className="font-bold text-[var(--primary)]" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
