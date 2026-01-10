
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { 
//   Trash2, Plus, LogOut, User as UserIcon, Loader2, 
//   Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
//   Lock, X, Download, FileText, Clock, Edit2, Save, ExternalLink
// } from 'lucide-react';
// import logo from './assets/logo.png'; 

// // Use your localhost URL for development to avoid CORS with Vercel during dev
// const API_URL = 'https://bee-bark-jira-backend.vercel.app/api'; 

// // --- AXIOS CONFIGURATION ---
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// }, (error) => Promise.reject(error));

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       localStorage.clear();
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
//   const [activeTab, setActiveTab] = useState('board'); 

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }
//   }, [token, user]);

//   if (!token) return <AuthScreen setToken={setToken} setUser={setUser} />;

//   return (
//     <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
//       <Sidebar user={user} setToken={setToken} activeTab={activeTab} setActiveTab={setActiveTab} />
//       <main className="flex-1 overflow-hidden relative">
//         {activeTab === 'board' && <BoardView currentUser={user} filter="all" />}
//         {activeTab === 'my-tasks' && <BoardView currentUser={user} filter="my-tasks" />}
//         {activeTab === 'team' && <TeamView />}
//       </main>
//     </div>
//   );
// }

// // --- VIEW: KANBAN BOARD ---
// function BoardView({ currentUser, filter }) {
//   const [tasks, setTasks] = useState([]);
//   const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
//   const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//       axios.get(`${API_URL}/users`).then(res => setUsers(res.data)).catch(console.error);
//   }, []);

//   const fetchTasks = async () => {
//     const endpoint = filter === 'my-tasks' ? `${API_URL}/tasks?filter=my-tasks` : `${API_URL}/tasks`;
//     try {
//         const { data } = await axios.get(endpoint);
//         setTasks(data);
//     } catch (e) { console.error("Fetch error", e); }
//   };

//   useEffect(() => { fetchTasks(); }, [filter]);

//   const onDragEnd = async (result) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;
//     const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
//     setTasks(updated);
//     await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
//   };

//   const columns = ['To Do', 'In Progress', 'Done'];

//   return (
//     <div className="h-full flex flex-col p-8 overflow-x-auto">
//       <header className="flex justify-between items-center mb-6">
//         <div>
//            <h1 className="text-2xl font-bold text-slate-900">{filter === 'my-tasks' ? 'My Tasks' : 'Project Board'}</h1>
//            <p className="text-slate-500 text-sm">Overview of all active pods</p>
//         </div>
//         <div className="flex gap-3">
//             <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
//               <Users size={18} /> New Pod
//             </button>
//             <button onClick={() => setIsTaskModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
//               <Plus size={18} /> Create Task
//             </button>
//         </div>
//       </header>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="flex gap-6 h-full pb-4">
//           {columns.map(status => (
//             <div key={status} className="w-80 flex-shrink-0 flex flex-col h-full">
//               <div className="flex justify-between items-center mb-3 px-1">
//                 <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
//                    <div className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
//                    {status}
//                 </h3>
//                 <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 text-slate-500">{tasks.filter(t => t.status === status).length}</span>
//               </div>
//               <Droppable droppableId={status}>
//                 {(provided, snapshot) => (
//                   <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 rounded-xl p-3 overflow-y-auto custom-scrollbar transition-colors border-2 ${snapshot.isDraggingOver ? 'bg-yellow-50/50 border-yellow-400/50' : 'bg-slate-100/50 border-transparent'}`}>
//                     {tasks.filter(t => t.status === status).map((task, index) => (
//                       <TaskCard key={task._id} task={task} index={index} onClick={() => setSelectedTask(task)} />
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           ))}
//         </div>
//       </DragDropContext>

//       {isTaskModalOpen && <CreateTaskModal onClose={() => setIsTaskModalOpen(false)} onSuccess={fetchTasks} currentUser={currentUser} users={users} />}
//       {isTeamModalOpen && <CreateTeamModal onClose={() => setIsTeamModalOpen(false)} onSuccess={() => alert("Pod Created!")} />}
//       {selectedTask && <TaskDetailModal task={selectedTask} users={users} onClose={() => setSelectedTask(null)} onUpdate={fetchTasks} />}
//     </div>
//   );
// }

// // --- TASK DETAIL MODAL (Fixed PDF) ---
// function TaskDetailModal({ task, onClose, onUpdate, users }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({ ...task });

//   const handleSave = async () => {
//     try {
//         await axios.put(`${API_URL}/tasks/${task._id}`, {
//             title: editForm.title,
//             description: editForm.description,
//             priority: editForm.priority,
//             assigneeId: editForm.assignee?._id || editForm.assignee,
//             reporterId: editForm.reporter?._id || editForm.reporter,
//             status: editForm.status
//         });
//         onUpdate();
//         setIsEditing(false);
//         onClose();
//     } catch (err) { alert("Failed to update task"); }
//   };

//   if (!task) return null;

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] flex flex-col">
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//           <div className="flex items-center gap-3 w-full">
//              {isEditing ? (
//                  <input className="font-bold text-xl bg-white border border-slate-300 rounded px-2 w-full" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
//              ) : (
//                  <>
//                     <h2 className="text-xl font-bold text-slate-900 leading-tight">{task.title}</h2>
//                     <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500" title="Edit">
//                         <Edit2 size={16} />
//                     </button>
//                  </>
//              )}
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500 ml-4"><X size={20} /></button>
//         </div>

//         <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
//             <div>
//                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14}/> Description</h3>
//                {isEditing ? (
//                    <textarea className="w-full border p-2 rounded h-32" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
//                ) : (
//                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description || "No description provided."}</div>
//                )}
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
//                <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
//                   <div className="font-bold text-slate-800 mt-1">{task.status}</div>
//                </div>
//                <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Reporter</label>
//                   {isEditing ? (
//                       <select className="w-full border bg-white rounded mt-1 text-sm p-1" value={editForm.reporter?._id || editForm.reporter} onChange={e => setEditForm({...editForm, reporter: e.target.value})}>
//                           {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                       </select>
//                   ) : (
//                       <div className="font-bold text-slate-800 mt-1 flex items-center gap-1"><UserIcon size={14} className="text-slate-400"/>{task.reporter?.username || 'Unknown'}</div>
//                   )}
//                </div>
//                <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
//                   {isEditing ? (
//                       <select className="w-full border bg-white rounded mt-1 text-sm p-1" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
//                           <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
//                       </select>
//                   ) : (
//                       <div className="font-bold text-slate-800 mt-1">{task.priority}</div>
//                   )}
//                </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label>
//                   <div className={`font-bold mt-1 flex items-center gap-1 ${new Date(task.deadline) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
//                      <Clock size={14}/> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
//                   </div>
//                </div>
//             </div>

//             <div>
//                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned To</h3>
//                 {isEditing ? (
//                      <select className="w-full border bg-white rounded p-2" value={editForm.assignee?._id || editForm.assignee || ""} onChange={e => setEditForm({...editForm, assignee: e.target.value})}>
//                         <option value="">Unassigned</option>
//                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                      </select>
//                 ) : (
//                     task.assignee ? (
//                         <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm w-fit">
//                             <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 text-lg">{task.assignee.username[0].toUpperCase()}</div>
//                             <div><div className="font-bold text-slate-900">{task.assignee.username}</div><div className="text-xs text-slate-500">{task.assignee.email}</div></div>
//                         </div>
//                     ) : <div className="text-sm text-slate-400 italic">No one assigned yet.</div>
//                 )}
//             </div>

//             <div>
//                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Paperclip size={14}/> Attachments ({task.attachments?.length || 0})</h3>
//                 {task.attachments && task.attachments.length > 0 ? (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                         {task.attachments.map((file, idx) => {
//                              // DETECT PDF via Extension OR Mimetype
//                              const isPdf = (file.format && file.format.includes('pdf')) || 
//                                            (file.url && file.url.toLowerCase().endsWith('.pdf')) ||
//                                            (file.name && file.name.toLowerCase().endsWith('.pdf'));
                             
//                              const isImage = !isPdf;

//                              return (
//                                 <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden group relative bg-slate-50">
//                                     {isImage ? (
//                                         <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
//                                     ) : (
//                                         <div className="w-full h-32 flex flex-col items-center justify-center text-slate-500 p-2 text-center bg-slate-100">
//                                             <FileText size={32} className="text-red-500 mb-2" />
//                                             <span className="text-xs font-bold text-slate-700 truncate w-full">{file.name || 'Document'}</span>
//                                             <span className="text-[10px] uppercase text-slate-400">PDF Document</span>
//                                         </div>
//                                     )}
//                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
//                                         <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-yellow-400 transition shadow-lg" title="Open File">
//                                             <ExternalLink size={20} className="text-slate-900" />
//                                         </a>
//                                     </div>
//                                 </div>
//                              )
//                         })}
//                     </div>
//                 ) : <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-sm text-slate-400">No attachments found.</div>}
//             </div>

//             {isEditing && (
//                 <div className="flex justify-end gap-2 pt-4 border-t">
//                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
//                     <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white rounded font-bold flex items-center gap-2"><Save size={16}/> Save Changes</button>
//                 </div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- TASK CARD ---
// function TaskCard({ task, index, onClick }) {
//   return (
//     <Draggable draggableId={task._id} index={index}>
//       {(provided, snapshot) => (
//         <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={onClick} className={`bg-white p-4 rounded-lg border border-slate-200 mb-3 shadow-sm hover:shadow-md transition group relative cursor-pointer ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-yellow-400 z-50' : ''}`}>
//           <div className="flex flex-wrap gap-2 mb-3">
//             <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[120px]">{task.pod}</span>
//             <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'Low' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.priority}</span>
//           </div>
//           <h4 className="font-semibold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
//           <div className="flex justify-between items-center pt-3 border-t border-slate-50">
//             <div className="flex items-center gap-2">
//                 {task.assignee ? (
//                     <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
//                          <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] font-bold text-slate-900">{task.assignee.username[0].toUpperCase()}</div>
//                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">{task.assignee.username}</span>
//                     </div>
//                 ) : <span className="text-[10px] text-slate-400 italic">Unassigned</span>}
//             </div>
//             <div className="flex items-center gap-2">
//                 {task.deadline && <div className={`flex items-center gap-1 text-[10px] font-medium ${new Date(task.deadline) < new Date() ? 'text-red-500' : 'text-slate-400'}`}><Calendar size={12} />{new Date(task.deadline).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>}
//                 {task.attachments?.length > 0 && <Paperclip size={12} className="text-slate-400" />}
//             </div>
//           </div>
//         </div>
//       )}
//     </Draggable>
//   );
// }

// // --- CREATE TASK MODAL (Fixed Dropdown Visibility) ---
// function CreateTaskModal({ onClose, onSuccess, currentUser, users }) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '', description: '', priority: 'Medium', pod: 'Development', assigneeId: '',
//     startDate: new Date().toISOString().split('T')[0], deadline: '', files: [],
//     reporterId: currentUser._id
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault(); setLoading(true);
//     const data = new FormData();
//     Object.keys(formData).forEach(key => {
//         if(key === 'files') { for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); } 
//         else { data.append(key, formData[key]); }
//     });
//     try { await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); onSuccess(); onClose(); } 
//     catch(err) { alert("Failed."); } finally { setLoading(false); }
//   };

//   const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//             <h2 className="text-lg font-bold text-slate-800">Create New Task</h2>
//             <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition">✕</button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
            
//             {/* REPORTER SELECT (Fixed: bg-white for visibility) */}
//             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
//                <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Reporter</label>
//                <select 
//                   className="w-full bg-white border border-blue-200 rounded p-2 text-slate-800 font-medium outline-none focus:ring-2 focus:ring-blue-400" 
//                   value={formData.reporterId} 
//                   onChange={e => setFormData({...formData, reporterId: e.target.value})}
//                >
//                    {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                </select>
//                <div className="text-xs text-blue-500 italic mt-1">Updates sent here.</div>
//             </div>

//             <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Title</label><input className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-400 font-medium" placeholder="e.g. Redesign Hero" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
//             <div className="grid grid-cols-2 gap-4">
//                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod</label><select className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-sm" value={formData.pod} onChange={e => setFormData({...formData, pod: e.target.value})}>{PODS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
//                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label><select className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start</label><input type="date" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
//                 <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label><input type="date" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} /></div>
//             </div>
//             <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
//                 <select className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-sm" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}>
//                     <option value="">Unassigned</option>{users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                 </select>
//             </div>
//             <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label><textarea className="w-full border border-slate-200 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-yellow-400 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
//             <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Attachments</label>
//                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 relative"><Paperclip size={24} className="mb-2"/><span className="text-sm">Click to upload files</span><input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} /></div>
//                 {formData.files.length > 0 && <div className="mt-2 text-xs font-bold">{formData.files.length} files</div>}
//             </div>
//             <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-600 font-bold hover:bg-slate-100 text-sm">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-2 text-sm shadow-lg">{loading && <Loader2 className="animate-spin" size={16} />} Create Task</button></div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // --- MODAL: CREATE TEAM (Fixed List Size) ---
// function CreateTeamModal({ onClose, onSuccess }) {
//   const [name, setName] = useState('');
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => { axios.get(`${API_URL}/users`).then(res => setUsers(res.data)); }, []);
//   const toggleMember = (id) => setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   const handleSubmit = async (e) => {
//     e.preventDefault(); setLoading(true);
//     try { await axios.post(`${API_URL}/teams`, { name, isPrivate, members: selectedMembers }); onSuccess(); onClose(); } catch(err) { alert("Failed."); } finally { setLoading(false); }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in duration-200">
//          <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-900">Create New Pod</h2><button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button></div>
//          <form onSubmit={handleSubmit} className="space-y-4">
//             <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod Name</label><input className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-400 font-medium" placeholder="e.g. Secret Project X" value={name} onChange={e => setName(e.target.value)} required /></div>
//             <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} /><div><span className="block text-sm font-bold text-slate-800 flex items-center gap-2"><Lock size={14} /> Secret Team?</span><span className="block text-xs text-slate-500">Only selected members see this.</span></div></label>
//             {isPrivate && (
//                 <div className="mt-4">
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Members</label>
//                     {/* FIXED HEIGHT: h-64 */}
//                     <div className="h-64 overflow-y-auto border border-slate-200 rounded-lg p-2 custom-scrollbar bg-slate-50">
//                         {users.length > 0 ? users.map(u => (
//                             <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded cursor-pointer transition">
//                                 <input type="checkbox" checked={selectedMembers.includes(u._id)} onChange={() => toggleMember(u._id)} className="accent-slate-900 w-4 h-4"/>
//                                 <span className="text-sm font-medium text-slate-700">{u.username}</span>
//                             </label>
//                         )) : <div className="text-center text-slate-400 text-sm mt-4">No other users found.</div>}
//                     </div>
//                 </div>
//             )}
//             <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">{loading && <Loader2 className="animate-spin" size={16}/>} Create Pod</button></div>
//          </form>
//       </div>
//     </div>
//   );
// }

// // ... (Rest of components: TeamView, Sidebar, AuthScreen remain unchanged) ...
// // (Including them below for completeness)

// function TeamView() {
//     const [users, setUsers] = useState([]);
//     useEffect(() => { axios.get(`${API_URL}/users`).then(res => setUsers(res.data)); }, []);
//     return (
//         <div className="p-8 h-full overflow-y-auto">
//             <h1 className="text-2xl font-bold text-slate-900 mb-6">Team Members</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {users.map(u => <div key={u._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition"><div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-slate-900">{u.username[0].toUpperCase()}</div><div className="overflow-hidden"><h3 className="font-bold text-slate-800 truncate">{u.username}</h3><p className="text-sm text-slate-500 truncate">{u.email}</p><span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span></div></div>)}
//             </div>
//         </div>
//     );
// }

// function Sidebar({ user, setToken, activeTab, setActiveTab }) {
//   return (
//     <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
//       <div className="p-6 flex items-center gap-3 border-b border-slate-100">{logo ? <img src={logo} alt="Logo" className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-yellow-400 rounded-lg"></div>}<span className="text-lg font-black tracking-tighter text-slate-900">BeeBark</span></div>
//       <nav className="flex-1 px-3 py-6 space-y-1">
//         <SidebarItem active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<LayoutGrid size={18}/>}>Kanban Board</SidebarItem>
//         <SidebarItem active={activeTab === 'my-tasks'} onClick={() => setActiveTab('my-tasks')} icon={<CheckCircle2 size={18}/>}>My Tasks</SidebarItem>
//         <SidebarItem active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={18}/>}>Team Members</SidebarItem>
//       </nav>
//       <div className="p-4 border-t border-slate-100 bg-slate-50"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-sm">{user?.username?.[0]?.toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-900">{user?.username}</div><div className="text-xs text-slate-500 truncate">{user?.email}</div></div></div><button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs font-bold w-full transition-colors p-2 rounded hover:bg-red-50"><LogOut size={14} /> Sign Out</button></div>
//     </aside>
//   );
// }

// function SidebarItem({ children, active, onClick, icon }) {
//     return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{icon}{children}</button>;
// }

// function AuthScreen({ setToken, setUser }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const handleSubmit = async (e) => {
//     e.preventDefault(); setLoading(true); setError('');
//     try {
//       const endpoint = isLogin ? '/login' : '/register';
//       const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
//       if (isLogin) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setToken(data.token); setUser(data.user); } 
//       else { setIsLogin(true); setError("Account created! Please log in."); setFormData({ username: '', email: '', password: '' }); }
//     } catch (err) { setError(err.response?.data?.error || "Connection failed."); } finally { setLoading(false); }
//   };
//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-slate-50">
//       <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
//         <div className="text-center mb-8"><h1 className="text-4xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Agile project management for high-performance pods.</p></div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//            <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label><input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
//            {!isLogin && <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>}
//            <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
//            {error && <div className={`text-center text-sm p-2 rounded-lg font-medium ${error.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>{error}</div>}
//            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg mt-4 flex justify-center items-center gap-2">{loading && <Loader2 className="animate-spin" />}{isLogin ? 'Log In' : 'Join Team'}</button>
//         </form>
//         <div className="text-center mt-6"><button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition">{isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}</button></div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Trash2, Plus, LogOut, User as UserIcon, Loader2, 
  Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
  Lock, X, Download, FileText, Clock, Edit2, Save, ExternalLink,
  Search, AlertCircle, ChevronDown
} from 'lucide-react';
import logo from './assets/logo.png'; 

// Use your localhost URL for development to avoid CORS with Vercel during dev
const API_URL = 'https://bee-bark-jira-backend.vercel.app/api'; 

// --- AXIOS CONFIGURATION ---
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// --- HELPER: GENERATE TASK ID ---
const generateTaskId = () => {
  // Generates BB-1000 to BB-9999
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BB-${randomNum}`;
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeTab, setActiveTab] = useState('board'); 

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  if (!token) return <AuthScreen setToken={setToken} setUser={setUser} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar user={user} setToken={setToken} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'board' && <BoardView currentUser={user} filter="all" />}
        {activeTab === 'my-tasks' && <BoardView currentUser={user} filter="my-tasks" />}
        {activeTab === 'team' && <TeamView />}
      </main>
    </div>
  );
}

// --- VIEW: KANBAN BOARD ---
function BoardView({ currentUser, filter }) {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
      axios.get(`${API_URL}/users`).then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const fetchTasks = async () => {
    const endpoint = filter === 'my-tasks' ? `${API_URL}/tasks?filter=my-tasks` : `${API_URL}/tasks`;
    try {
        const { data } = await axios.get(endpoint);
        setTasks(data);
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTasks(updated);
    await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
  };

  // Filter tasks based on Search Query (ID or Title)
  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    const matchesTitle = task.title.toLowerCase().includes(query);
    const matchesId = task.taskId ? task.taskId.toLowerCase().includes(query) : false;
    return matchesTitle || matchesId;
  });

  const columns = ['To Do', 'In Progress', 'Blocked', 'Done'];

  return (
    <div className="h-full flex flex-col p-8 overflow-x-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">{filter === 'my-tasks' ? 'My Tasks' : 'Project Board'}</h1>
           <p className="text-slate-500 text-sm">Overview of all active pods</p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-md mx-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by Title or Ticket ID (e.g., BB-0001)..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="flex gap-3">
            <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
              <Users size={18} /> New Pod
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
              <Plus size={18} /> Create Task
            </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full pb-4">
          {columns.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col h-full">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                       status === 'Done' ? 'bg-green-500' : 
                       status === 'In Progress' ? 'bg-blue-500' : 
                       status === 'Blocked' ? 'bg-red-500' : 
                       'bg-slate-400'
                    }`}></div>
                   {status}
                </h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 text-slate-500">{filteredTasks.filter(t => t.status === status).length}</span>
              </div>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 rounded-xl p-3 overflow-y-auto custom-scrollbar transition-colors border-2 ${snapshot.isDraggingOver ? 'bg-yellow-50/50 border-yellow-400/50' : 'bg-slate-100/50 border-transparent'}`}>
                    {filteredTasks.filter(t => t.status === status).map((task, index) => (
                      <TaskCard key={task._id} task={task} index={index} onClick={() => setSelectedTask(task)} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isTaskModalOpen && <CreateTaskModal onClose={() => setIsTaskModalOpen(false)} onSuccess={fetchTasks} currentUser={currentUser} users={users} />}
      {isTeamModalOpen && <CreateTeamModal onClose={() => setIsTeamModalOpen(false)} onSuccess={() => alert("Pod Created!")} />}
      {selectedTask && <TaskDetailModal task={selectedTask} users={users} onClose={() => setSelectedTask(null)} onUpdate={fetchTasks} />}
    </div>
  );
}

// --- TASK DETAIL MODAL ---
function TaskDetailModal({ task, onClose, onUpdate, users }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...task });

  const handleSave = async () => {
    try {
        await axios.put(`${API_URL}/tasks/${task._id}`, {
            title: editForm.title,
            description: editForm.description,
            priority: editForm.priority,
            assigneeId: editForm.assignee?._id || editForm.assignee,
            reporterId: editForm.reporter?._id || editForm.reporter,
            status: editForm.status
        });
        onUpdate();
        setIsEditing(false);
        onClose();
    } catch (err) { alert("Failed to update task"); }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3 w-full">
             <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded border border-slate-300">
                {task.taskId || 'NO-ID'}
             </span>
             {isEditing ? (
                 <input className="font-bold text-xl bg-white border border-slate-300 rounded px-2 w-full" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
             ) : (
                 <>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{task.title}</h2>
                    <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500" title="Edit">
                        <Edit2 size={16} />
                    </button>
                 </>
             )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500 ml-4"><X size={20} /></button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14}/> Description</h3>
               {isEditing ? (
                   <textarea className="w-full border p-2 rounded h-32" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
               ) : (
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{task.description || "No description provided."}</div>
               )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <div className="font-bold text-slate-800 mt-1">{task.status}</div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Reporter</label>
                  {isEditing ? (
                      <select className="w-full border bg-white rounded mt-1 text-sm p-1" value={editForm.reporter?._id || editForm.reporter} onChange={e => setEditForm({...editForm, reporter: e.target.value})}>
                          {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                      </select>
                  ) : (
                      <div className="font-bold text-slate-800 mt-1 flex items-center gap-1"><UserIcon size={14} className="text-slate-400"/>{task.reporter?.username || 'Unknown'}</div>
                  )}
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Priority</label>
                  {isEditing ? (
                      <select className="w-full border bg-white rounded mt-1 text-sm p-1" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
                          <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                      </select>
                  ) : (
                      <div className="font-bold text-slate-800 mt-1">{task.priority}</div>
                  )}
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label>
                  <div className={`font-bold mt-1 flex items-center gap-1 ${new Date(task.deadline) < new Date() ? 'text-red-600' : 'text-slate-800'}`}>
                     <Clock size={14}/> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
                  </div>
               </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned To</h3>
                {isEditing ? (
                      <select className="w-full border bg-white rounded p-2" value={editForm.assignee?._id || editForm.assignee || ""} onChange={e => setEditForm({...editForm, assignee: e.target.value})}>
                         <option value="">Unassigned</option>
                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                      </select>
                ) : (
                    task.assignee ? (
                        <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm w-fit">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 text-lg">{task.assignee.username[0].toUpperCase()}</div>
                            <div><div className="font-bold text-slate-900">{task.assignee.username}</div><div className="text-xs text-slate-500">{task.assignee.email}</div></div>
                        </div>
                    ) : <div className="text-sm text-slate-400 italic">No one assigned yet.</div>
                )}
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Paperclip size={14}/> Attachments ({task.attachments?.length || 0})</h3>
                {task.attachments && task.attachments.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {task.attachments.map((file, idx) => {
                             const isPdf = (file.format && file.format.includes('pdf')) || 
                                            (file.url && file.url.toLowerCase().endsWith('.pdf')) ||
                                            (file.name && file.name.toLowerCase().endsWith('.pdf'));
                             
                             const isImage = !isPdf;

                             return (
                                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden group relative bg-slate-50">
                                    {isImage ? (
                                        <img src={file.url} alt={file.name} className="w-full h-32 object-cover" />
                                    ) : (
                                        <div className="w-full h-32 flex flex-col items-center justify-center text-slate-500 p-2 text-center bg-slate-100">
                                            <FileText size={32} className="text-red-500 mb-2" />
                                            <span className="text-xs font-bold text-slate-700 truncate w-full">{file.name || 'Document'}</span>
                                            <span className="text-[10px] uppercase text-slate-400">PDF Document</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full hover:bg-yellow-400 transition shadow-lg" title="Open File">
                                            <ExternalLink size={20} className="text-slate-900" />
                                        </a>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                ) : <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-sm text-slate-400">No attachments found.</div>}
            </div>

            {isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white rounded font-bold flex items-center gap-2"><Save size={16}/> Save Changes</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

// --- TASK CARD ---
function TaskCard({ task, index, onClick }) {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={onClick} className={`bg-white p-4 rounded-lg border border-slate-200 mb-3 shadow-sm hover:shadow-md transition group relative cursor-pointer ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-yellow-400 z-50' : ''}`}>
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-slate-500">{task.taskId || 'BB-####'}</span>
             <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'Low' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.priority}</span>
          </div>
          <h4 className="font-semibold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[120px]">{task.pod}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="flex items-center gap-2">
                {task.assignee ? (
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                         <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] font-bold text-slate-900">{task.assignee.username[0].toUpperCase()}</div>
                         <span className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">{task.assignee.username}</span>
                    </div>
                ) : <span className="text-[10px] text-slate-400 italic">Unassigned</span>}
            </div>
            <div className="flex items-center gap-2">
                {task.deadline && <div className={`flex items-center gap-1 text-[10px] font-medium ${new Date(task.deadline) < new Date() ? 'text-red-500' : 'text-slate-400'}`}><Calendar size={12} />{new Date(task.deadline).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>}
                {task.attachments?.length > 0 && <Paperclip size={12} className="text-slate-400" />}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// --- NEW CREATE TASK MODAL (Match Image Design) ---
function CreateTaskModal({ onClose, onSuccess, currentUser, users }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', 
    status: 'To Do',
    priority: 'Medium', 
    pod: 'Development', 
    assigneeId: '',
    startDate: new Date().toISOString().split('T')[0], 
    deadline: '', 
    files: [],
    reporterId: currentUser._id,
    taskId: generateTaskId() // Generate BB-XXXX on open
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if(key === 'files') { for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); } 
        else { data.append(key, formData[key]); }
    });
    
    try { 
        // Sending taskId to backend. Ensure backend Schema accepts 'taskId' or it will just be ignored
        await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
        onSuccess(); 
        onClose(); 
    } 
    catch(err) { alert("Failed."); } finally { setLoading(false); }
  };

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-800">New Task <span className="text-slate-400 font-normal ml-2">{formData.taskId}</span></h2>
            <div className="flex gap-4 items-center">
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={14} />} Create Task
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
            </div>
        </div>

        {/* BODY (Split Layout) */}
        <div className="flex flex-1 overflow-hidden">
            {/* LEFT: CONTENT */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
                 <input 
                    className="w-full text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-6 bg-transparent" 
                    placeholder="Issue Title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    autoFocus
                    required 
                 />

                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                        <FileText size={14} /> Description
                    </label>
                    <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 resize-none" 
                        placeholder="Add a detailed description..."
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                 </div>

                 <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                        <Paperclip size={14} /> Attachments
                    </label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer relative">
                        <span className="text-sm">Click to upload new files</span>
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} />
                    </div>
                    {formData.files.length > 0 && <div className="mt-2 text-xs font-bold text-green-600">{formData.files.length} files selected</div>}
                 </div>
            </div>

            {/* RIGHT: META DETAILS */}
            <div className="w-80 bg-slate-50 p-6 overflow-y-auto custom-scrollbar space-y-6">
                
                {/* STATUS */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select 
                        className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none"
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Blocked</option>
                        <option>Done</option>
                    </select>
                </div>

                {/* PRIORITY */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
                    <div className="flex gap-1">
                        {['Low', 'Medium', 'High', 'Critical'].map(p => (
                            <button 
                                key={p}
                                type="button"
                                onClick={() => setFormData({...formData, priority: p})}
                                className={`flex-1 py-1 text-[10px] uppercase font-bold border rounded transition
                                    ${formData.priority === p 
                                        ? 'bg-slate-800 text-white border-slate-800' 
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* POD */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Team</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
                            value={formData.pod} 
                            onChange={e => setFormData({...formData, pod: e.target.value})}
                        >
                            {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
                    </div>
                </div>

                {/* ASSIGNEE */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
                            value={formData.assigneeId} 
                            onChange={e => setFormData({...formData, assigneeId: e.target.value})}
                        >
                            <option value="">Unassigned</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                        </select>
                        <UserIcon size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
                    </div>
                </div>

                {/* TIMELINE */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeline</label>
                    <div className="bg-white border border-slate-200 rounded p-3">
                         <div className="mb-2">
                            <label className="text-[10px] text-slate-400 uppercase">Start Date</label>
                            <input type="date" className="w-full text-sm font-medium outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                         </div>
                         <div className="pt-2 border-t border-slate-100">
                            <label className="text-[10px] text-slate-400 uppercase">Due Date</label>
                            <input type="date" className="w-full text-sm font-medium outline-none" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                         </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// --- MODAL: CREATE TEAM (Fixed List Size) ---
function CreateTeamModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { axios.get(`${API_URL}/users`).then(res => setUsers(res.data)); }, []);
  const toggleMember = (id) => setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await axios.post(`${API_URL}/teams`, { name, isPrivate, members: selectedMembers }); onSuccess(); onClose(); } catch(err) { alert("Failed."); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in duration-200">
         <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-900">Create New Pod</h2><button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button></div>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod Name</label><input className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-yellow-400 font-medium" placeholder="e.g. Secret Project X" value={name} onChange={e => setName(e.target.value)} required /></div>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} /><div><span className="block text-sm font-bold text-slate-800 flex items-center gap-2"><Lock size={14} /> Secret Team?</span><span className="block text-xs text-slate-500">Only selected members see this.</span></div></label>
            {isPrivate && (
                <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Members</label>
                    <div className="h-64 overflow-y-auto border border-slate-200 rounded-lg p-2 custom-scrollbar bg-slate-50">
                        {users.length > 0 ? users.map(u => (
                            <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded cursor-pointer transition">
                                <input type="checkbox" checked={selectedMembers.includes(u._id)} onChange={() => toggleMember(u._id)} className="accent-slate-900 w-4 h-4"/>
                                <span className="text-sm font-medium text-slate-700">{u.username}</span>
                            </label>
                        )) : <div className="text-center text-slate-400 text-sm mt-4">No other users found.</div>}
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">{loading && <Loader2 className="animate-spin" size={16}/>} Create Pod</button></div>
         </form>
      </div>
    </div>
  );
}

function TeamView() {
    const [users, setUsers] = useState([]);
    useEffect(() => { axios.get(`${API_URL}/users`).then(res => setUsers(res.data)); }, []);
    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Team Members</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => <div key={u._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition"><div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-slate-900">{u.username[0].toUpperCase()}</div><div className="overflow-hidden"><h3 className="font-bold text-slate-800 truncate">{u.username}</h3><p className="text-sm text-slate-500 truncate">{u.email}</p><span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span></div></div>)}
            </div>
        </div>
    );
}

function Sidebar({ user, setToken, activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">{logo ? <img src={logo} alt="Logo" className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 bg-yellow-400 rounded-lg"></div>}<span className="text-lg font-black tracking-tighter text-slate-900">BeeBark</span></div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        <SidebarItem active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<LayoutGrid size={18}/>}>Kanban Board</SidebarItem>
        <SidebarItem active={activeTab === 'my-tasks'} onClick={() => setActiveTab('my-tasks')} icon={<CheckCircle2 size={18}/>}>My Tasks</SidebarItem>
        <SidebarItem active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={18}/>}>Team Members</SidebarItem>
      </nav>
      <div className="p-4 border-t border-slate-100 bg-slate-50"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-sm">{user?.username?.[0]?.toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-900">{user?.username}</div><div className="text-xs text-slate-500 truncate">{user?.email}</div></div></div><button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs font-bold w-full transition-colors p-2 rounded hover:bg-red-50"><LogOut size={14} /> Sign Out</button></div>
    </aside>
  );
}

function SidebarItem({ children, active, onClick, icon }) {
    return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{icon}{children}</button>;
}

function AuthScreen({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setToken(data.token); setUser(data.user); } 
      else { setIsLogin(true); setError("Account created! Please log in."); setFormData({ username: '', email: '', password: '' }); }
    } catch (err) { setError(err.response?.data?.error || "Connection failed."); } finally { setLoading(false); }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8"><h1 className="text-4xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Agile project management for high-performance pods.</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label><input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
           {!isLogin && <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label><input type="email" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>}
           <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 transition" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
           {error && <div className={`text-center text-sm p-2 rounded-lg font-medium ${error.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>{error}</div>}
           <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg mt-4 flex justify-center items-center gap-2">{loading && <Loader2 className="animate-spin" />}{isLogin ? 'Log In' : 'Join Team'}</button>
        </form>
        <div className="text-center mt-6"><button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition">{isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}</button></div>
      </div>
    </div>
  );
}