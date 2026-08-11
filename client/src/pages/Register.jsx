import axios from "axios";
import { useState } from "react";
import { FiArrowRight, FiLock, FiMail, FiUploadCloud, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import { API_URL } from "../api";

const Register = () => {
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
   const { setUser } = useAuth();
  const navigate = useNavigate();
  const handlereg= async (e)=>{
    e.preventDefault()
    try{
     const result= await axios.post(`${API_URL}/api/auth/reg`,{name,email,password},{withCredentials:true})
     setUser(result.data.user)
     toast.success(result.data.message)
     navigate("/ppt", { replace: true })
    } catch(error){
     toast.error(error.response?.data?.message || "Registration failed")
    }
  }
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-[18px] py-10 text-[var(--text)] sm:px-6">
      <div className="pointer-events-none absolute -top-32 -left-32 size-[420px] rounded-full bg-[var(--primary)] opacity-15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 size-[420px] rounded-full bg-violet-500 opacity-15 blur-[100px]" />

      <section className="relative z-10 w-full max-w-[440px] rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] backdrop-blur-sm sm:p-9">
        <Link to="/" className="mx-auto flex w-fit items-center gap-2.5 text-[22px] font-extrabold">
          <span className="flex size-[38px] items-center justify-center rounded-[11px] bg-linear-to-br from-[var(--primary)] to-violet-500 text-white shadow-[0_8px_25px_rgba(99,102,241,.3)]">
            <FiUploadCloud />
          </span>
          Presento
        </Link>

        <div className="mt-8 text-center">
          <p className="text-[13px] font-bold tracking-[1px] text-[var(--primary)] uppercase">
            Get started free
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-1px]">Create your account</h1>
          <p className="mt-3 text-sm leading-[1.7] text-[var(--text-secondary)]">
            Build a better home for every presentation.
          </p>
        </div>

        <form onSubmit={handlereg} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">
            Full name
            <span className="relative mt-2 block">
              <FiUser className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input onChange={(e)=>setName(e.target.value)} value={name} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pr-4 pl-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]" type="text" placeholder="Your full name" />
            </span>
          </label>
          <label className="block text-sm font-semibold">
            Email address
            <span className="relative mt-2 block">
              <FiMail className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pr-4 pl-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]" type="email" placeholder="you@example.com" />
            </span>
          </label>
          <label className="block text-sm font-semibold">
            Password
            <span className="relative mt-2 block">
              <FiLock className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pr-4 pl-11 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]" type="password" placeholder="Create a password" />
            </span>
          </label>
          <label className="flex items-start gap-2 text-xs leading-[1.6] text-[var(--text-secondary)]">
            <input className="mt-0.5 accent-[var(--primary)]" type="checkbox" />
            I agree to the Terms of Service and Privacy Policy.
          </label>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[var(--primary)] to-[var(--primary-dark)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(99,102,241,.25)]">
            Create account <FiArrowRight />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link className="font-bold text-[var(--primary)]" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
