import { useEffect, useState } from "react";
import { X, Send, Trash2 } from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
export default function CommentModal({ post, onClose, onCountChange }) {
  const { user } = useAuth(); const [comments, setComments] = useState([]); const [content, setContent] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function load() { try { const {data}=await api.get(`/posts/${post._id}/comments`); setComments(data.comments); } catch(e) { setError(getError(e)); } }
  useEffect(()=>{ load(); }, [post._id]);
  async function submit(e) { e.preventDefault(); if(!content.trim()) return; setBusy(true); setError(""); try { const {data}=await api.post(`/posts/${post._id}/comments`,{content}); setComments(old=>[...old,data.comment]); setContent(""); onCountChange(post._id, comments.length+1); } catch(e) { setError(getError(e)); } finally {setBusy(false);} }
  async function remove(id) { try { await api.delete(`/comments/${id}`); setComments(old=>old.filter(c=>c._id!==id)); onCountChange(post._id, Math.max(0,comments.length-1)); } catch(e) { setError(getError(e)); } }
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="comment-modal"><div className="modal-head"><div><span className="eyebrow">COMMUNITY DISCUSSION</span><h3>Comments</h3><p>{post.title}</p></div><button className="icon-button" onClick={onClose}><X/></button></div>
    <div className="comments-list">{comments.map(c=><div className="comment-item" key={c._id}><div className="avatar small">{c.author?.name?.[0]?.toUpperCase()||"S"}</div><div className="comment-body"><strong>{c.author?.name||"Student"}</strong><span>{new Date(c.createdAt).toLocaleString()}</span><p>{c.content}</p></div>{String(c.author?._id)===String(user?._id)&&<button className="icon-button danger" onClick={()=>remove(c._id)} title="Delete comment"><Trash2 size={15}/></button>}</div>)}{comments.length===0&&<div className="empty-state compact"><div className="empty-icon">💬</div><strong>Start the conversation</strong><p>Be the first to share a thought.</p></div>}</div>
    {error&&<p className="inline-error">{error}</p>}<form className="comment-form" onSubmit={submit}><input value={content} onChange={e=>setContent(e.target.value)} placeholder="Write a thoughtful comment…" maxLength="1200" required/><button className="button primary" disabled={busy}><Send size={16}/> Send</button></form>
  </section></div>;
}
