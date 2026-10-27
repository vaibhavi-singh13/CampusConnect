import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
export default function Login() {
 const [form,setForm]=useState({email:"",password:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const {login}=useAuth(); const navigate=useNavigate();
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 async function submit(e){e.preventDefault();setBusy(true);setError("");try{const {data}=await api.post("/auth/login",form);login(data);navigate("/feed");}catch(e){setError(getError(e));}finally{setBusy(false);}}
 return <AuthPage title="Welcome back." subtitle="Your campus has been busy. Come catch up."><form onSubmit={submit} className="auth-form"><label>Email address<input type="email" name="email" value={form.email} onChange={change} placeholder="you@college.edu" required autoComplete="email"/></label><label>Password<input type="password" name="password" value={form.password} onChange={change} placeholder="Your password" required autoComplete="current-password"/></label>{error&&<div className="form-error">{error}</div>}<button className="button primary full" disabled={busy}>{busy?"Logging you in…":"Log in to CampusConnect"}</button></form><p className="auth-switch">New around here? <Link to="/register">Create an account</Link></p></AuthPage>;
}
export function AuthPage({title,subtitle,children}){return <div className="auth-layout"><Link to="/" className="auth-back"><ArrowLeft size={16}/> Back home</Link><div className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark"><GraduationCap size={22}/></span><span>campus<span className="brand-accent">connect</span><small>YOUR CAMPUS, CONNECTED</small></span></Link><div className="auth-heading"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h1>{title}</h1><p>{subtitle}</p></div>{children}<div className="auth-bottom">A better campus experience, together. <span>✦</span></div></div><div className="auth-decoration deco-one"></div><div className="auth-decoration deco-two"></div></div>}
