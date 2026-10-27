import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";
export default function PostCard({ post, onChange, onComment }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const own = String(post.author?._id) === String(user?._id);
  async function toggleLike() {
    setBusy(true); setError("");
    try {
      const { data } = post.likedByMe ? await api.delete(`/posts/${post._id}/like`) : await api.post(`/posts/${post._id}/like`);
      onChange({ ...post, likedByMe: data.liked, likesCount: data.likesCount });
    } catch (e) { setError(getError(e)); } finally { setBusy(false); }
  }
  async function saveEdit(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { const { data } = await api.patch(`/posts/${post._id}`, { title, content }); onChange({ ...post, ...data.post }); setEditing(false); }
    catch (e) { setError(getError(e)); } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("Delete this post? Its comments and likes will also be removed.")) return;
    try { await api.delete(`/posts/${post._id}`); onChange(null); } catch (e) { setError(getError(e)); }
  }
  return <article className="post-card">
    <div className="post-head"><div className="avatar">{post.author?.name?.[0]?.toUpperCase() || "S"}</div><div className="post-author"><strong>{post.author?.name || "Student"}</strong><span>{post.author?.college || "Campus member"} · {new Date(post.createdAt).toLocaleDateString()}</span></div>
      {own && <div className="post-actions"><button className="icon-button" title="Edit post" onClick={() => setEditing(!editing)}><Pencil size={16}/></button><button className="icon-button danger" title="Delete post" onClick={remove}><Trash2 size={16}/></button></div>}
    </div>
    {editing ? <form className="edit-form" onSubmit={saveEdit}><input value={title} onChange={e=>setTitle(e.target.value)} required maxLength="120"/><textarea value={content} onChange={e=>setContent(e.target.value)} required maxLength="5000"/><div className="form-row"><button className="button primary" disabled={busy}>Save changes</button><button type="button" className="button ghost" onClick={()=>setEditing(false)}>Cancel</button></div></form> : <>
      <div className="post-category">{post.category}</div><h3 className="post-title">{post.title}</h3><p className="post-content">{post.content}</p>
      {post.imageUrl && <a className="post-link" href={post.imageUrl} target="_blank" rel="noreferrer">View attached link ↗</a>}
      <div className="post-footer"><button className={`post-action ${post.likedByMe ? "liked" : ""}`} disabled={busy} onClick={toggleLike}><Heart size={18} fill={post.likedByMe ? "currentColor" : "none"}/>{post.likesCount || 0} likes</button><button className="post-action" onClick={()=>onComment(post)}><MessageCircle size={18}/>{post.commentsCount || 0} comments</button><span className="post-tag"><MoreHorizontal size={16}/> Campus conversation</span></div>
    </>}
    {error && <p className="inline-error">{error}</p>}
  </article>;
}
