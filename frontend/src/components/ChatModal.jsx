import { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
export default function ChatModal({ student, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bottom = useRef(null);
  async function load(silent=false) {
    try { const {data}=await api.get(`/messages/${student._id}`); setMessages(data.messages || []); if(!silent)setError(""); }
    catch(e){setError(getError(e));}
  }
  useEffect(()=>{load(); const timer=setInterval(()=>load(true),3000); return()=>clearInterval(timer);},[student._id]);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function send(e){
    e.preventDefault(); const value=text.trim(); if(!value||sending)return;
    setSending(true);setError("");
    try {const {data}=await api.post(`/messages/${student._id}`,{text:value});setMessages(old=>[...old,data.message]);setText("");}
    catch(e){setError(getError(e));}
    finally{setSending(false);}
  }
  return <div className="chat-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="chat-modal" role="dialog" aria-modal="true" aria-label={`Chat with ${student.name}`}>
      <header className="chat-header"><div className="avatar">{student.name?.[0]?.toUpperCase()}</div><div className="chat-person"><strong>{student.name}</strong><span><MessageCircle size={13}/> CampusConnect messages</span></div><button className="icon-button" onClick={onClose} aria-label="Close chat"><X/></button></header>
      <div className="chat-messages">{messages.length===0?<div className="chat-empty"><MessageCircle size={30}/><strong>Say hi to {student.name?.split(" ")[0]}!</strong><span>Start a conversation about classes, projects, or shared interests.</span></div>:messages.map(m=><div key={m._id} className={`chat-message ${String(m.sender?._id)===String(user?._id)?"mine":"theirs"}`}><span>{m.text}</span><small>{new Date(m.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>)}<div ref={bottom}/></div>
      {error&&<div className="chat-error">{error}</div>}
      <form className="chat-compose" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} maxLength={2000} placeholder={`Message ${student.name?.split(" ")[0]}…`} autoFocus/><button className="button primary" disabled={!text.trim()||sending}><Send size={17}/><span>Send</span></button></form>
    </section>
  </div>;
}
