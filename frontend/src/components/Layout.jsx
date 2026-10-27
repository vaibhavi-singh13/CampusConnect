import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Compass, GraduationCap, LogOut, Plus, Users, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Layout({ children }) {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("cc_theme") === "dark");
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("cc_theme", dark ? "dark" : "light"); }, [dark]);
  const signOut = () => { logout(); navigate("/"); };
  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink to="/feed" className="brand"><span className="brand-mark"><GraduationCap size={22}/></span><span>campus<span className="brand-accent">connect</span><small>YOUR CAMPUS, CONNECTED</small></span></NavLink>
      <div className="nav-label">YOUR SPACE</div>
      <nav className="side-nav">
        <NavLink to="/feed"><Compass size={20}/> Community feed</NavLink>
        <NavLink to="/resources"><BookOpen size={20}/> Resource library</NavLink>
        <NavLink to="/students"><Users size={20}/> Find students</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="mini-profile"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="mini-user"><strong>{user?.name}</strong><span>{user?.college || "Campus member"}</span></div></div>
        <button className="logout-button" onClick={signOut}><LogOut size={17}/> Log out</button>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar"><div><span className="eyebrow">YOUR COLLEGE COMMUNITY</span><h2>Good things happen when we connect.</h2></div><div className="topbar-actions"><button className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Toggle dark mode">{dark ? <Sun size={19}/> : <Moon size={19}/>}<span>{dark ? "Light mode" : "Dark mode"}</span></button><NavLink className="profile-pill" to="/profile"><div className="avatar small">{user?.name?.[0]?.toUpperCase()}</div><span>My profile</span></NavLink></div></header>
      <main className="content">{children}</main>
      <footer className="footer">Made for students, powered by community <span>✦</span></footer>
    </div>
    <nav className="mobile-nav"><NavLink to="/feed"><Compass size={19}/>Feed</NavLink><NavLink to="/resources"><BookOpen size={19}/>Resources</NavLink><NavLink to="/students"><Users size={19}/>Students</NavLink><NavLink to="/profile"><Plus size={19}/>Profile</NavLink></nav>
  </div>;
}
