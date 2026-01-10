
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



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Trash2, Plus, LogOut, User as UserIcon, Loader2, 
  Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
  Lock, X, FileText, Clock, ExternalLink, ChevronDown, 
  Ban, Eye, MoreHorizontal 
} from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = 'https://bee-bark-jira-backend.vercel.app/api'; 

// --- AXIOS INTERCEPTORS ---
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

// --- MAIN APP ---
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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      <Sidebar user={user} setToken={setToken} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'board' && <BoardView currentUser={user} filter="all" />}
        {activeTab === 'my-tasks' && <BoardView currentUser={user} filter="my-tasks" />}
        {activeTab === 'team' && <TeamView />}
      </main>
    </div>
  );
}

// --- HELPER: USER SELECT COMPONENT ---
function UserSelect({ users, selectedId, onChange, label, type = "assignee" }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const selectedUser = users.find(u => u._id === selectedId);

  return (
    <div className="relative mb-4" ref={wrapperRef}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition shadow-sm"
      >
        <div className="flex items-center gap-2">
          {selectedUser ? (
            <>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${type === 'reporter' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                {selectedUser.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{selectedUser.username}</span>
            </>
          ) : (
            <span className="text-sm text-slate-400 italic">Select User...</span>
          )}
        </div>
        <ChevronDown size={14} className="text-slate-400"/>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div onClick={() => { onChange(""); setIsOpen(false); }} className="p-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-400 italic border-b">
            Unassigned
          </div>
          {users.map(u => (
            <div 
              key={u._id} 
              onClick={() => { onChange(u._id); setIsOpen(false); }}
              className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer transition"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">{u.username}</span>
                <span className="text-[10px] text-slate-400">{u.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- VIEW: KANBAN BOARD ---
function BoardView({ currentUser, filter }) {
  const [tasks, setTasks] = useState([]);
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // 'create' or 'edit'
  const [selectedTask, setSelectedTask] = useState(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  
  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
      axios.get(`${API_URL}/users`).then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const fetchTasks = async () => {
    const endpoint = filter === 'my-tasks' ? `${API_URL}/tasks?filter=my-tasks` : `${API_URL}/tasks`;
    try { const { data } = await axios.get(endpoint); setTasks(data); } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTasks(updated);
    await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
  };

  // Handlers for opening the unified drawer
  const openCreateDrawer = () => {
    setSelectedTask(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const openEditDrawer = (task) => {
    setSelectedTask(task);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{filter === 'my-tasks' ? 'My Assignments' : 'Project Board'}</h1>
           <p className="text-slate-500 text-sm mt-1">Manage tasks and team pods.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
              <Users size={18} /> New Pod
            </button>
            <button onClick={openCreateDrawer} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200">
                <Plus size={18} /> Create Task
            </button>
        </div>
      </header>

      {/* BOARD AREA */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-slate-50/50">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-6 min-w-max">
            {columns.map(status => (
              <div key={status} className="w-[340px] flex flex-col h-full bg-slate-100/50 rounded-xl border border-slate-200/60">
                <div className="p-3 flex justify-between items-center border-b border-slate-200/50">
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                     <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{status}</span>
                  </div>
                  <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-slate-400 border">{tasks.filter(t => t.status === status).length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} 
                      className={`flex-1 p-2 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                    >
                      {tasks.filter(t => t.status === status).map((task, index) => (
                        <TaskCard key={task._id} task={task} index={index} onClick={() => openEditDrawer(task)} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* UNIFIED TASK DRAWER (Handles Create & Edit) */}
      <TaskDrawer 
        isOpen={drawerOpen}
        mode={drawerMode}
        task={selectedTask}
        users={users}
        currentUser={currentUser}
        onClose={() => setDrawerOpen(false)}
        onSuccess={fetchTasks}
      />

      {isTeamModalOpen && <CreateTeamModal onClose={() => setIsTeamModalOpen(false)} onSuccess={() => alert("Pod Created!")} />}
    </div>
  );
}

// --- NEW COMPONENT: TASK DRAWER (UI MATCHING SCREENSHOT) ---
function TaskDrawer({ isOpen, mode, task, users, currentUser, onClose, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form based on mode
  useEffect(() => {
    if (mode === 'edit' && task) {
        setFormData({ ...task });
    } else {
        setFormData({
            title: '', description: '', priority: 'Medium', status: 'To Do',
            pod: 'Development', assignee: '', reporter: currentUser?._id,
            deadline: new Date().toISOString().split('T')[0], attachments: []
        });
    }
  }, [mode, task, currentUser, isOpen]);

  const handleSave = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);

    try {
        if (mode === 'create') {
            const data = new FormData();
            // Map flat form data to what backend expects for creation
            data.append('title', formData.title);
            data.append('description', formData.description || '');
            data.append('priority', formData.priority);
            data.append('status', formData.status);
            data.append('pod', formData.pod);
            data.append('assigneeId', formData.assignee || '');
            data.append('reporterId', formData.reporter || '');
            data.append('deadline', formData.deadline);
            // Handle file uploads if any (simplified for demo)
            if(formData.newFiles) {
                for(let i=0; i<formData.newFiles.length; i++) data.append('files', formData.newFiles[i]);
            }
            await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
            // Update Logic
            await axios.put(`${API_URL}/tasks/${task._id}`, {
                ...formData,
                assigneeId: formData.assignee?._id || formData.assignee,
                reporterId: formData.reporter?._id || formData.reporter,
            });
        }
        onSuccess();
        onClose();
    } catch (err) {
        console.error(err);
        alert("Operation failed");
    } finally {
        setLoading(false);
    }
  };

  // Helper for immediate updates in Edit mode (Autosave feel)
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media", "Sales", "Operations"];

  return (
    <>
       {/* Backdrop */}
       <div onClick={onClose} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity"></div>
       
       {/* Drawer Panel - Right Side */}
       <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 transform transition-transform flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
             <div className="flex items-center gap-3">
                {mode === 'edit' ? (
                     <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {task?._id ? `ISSUE-${task._id.slice(-4).toUpperCase()}` : 'LOADING...'}
                     </span>
                ) : (
                    <span className="text-sm font-bold text-slate-800">New Issue</span>
                )}
             </div>
             <div className="flex gap-2">
                {mode === 'create' && (
                    <button onClick={handleSave} disabled={loading} className="px-4 py-1.5 bg-slate-900 text-white text-sm font-bold rounded hover:bg-slate-800">
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                )}
                {mode === 'edit' && (
                    <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition"><X size={20}/></button>
             </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* LEFT COLUMN: CONTENT (65%) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 border-r border-slate-100 bg-white">
               
               {/* Title */}
               <input 
                 className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent mb-6"
                 value={formData.title}
                 onChange={(e) => updateField('title', e.target.value)}
                 placeholder="Issue Title"
                 autoFocus={mode === 'create'}
               />

               {/* Description */}
               <div className="mb-8 group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText size={14}/> Description
                  </label>
                  <textarea 
                    className="w-full min-h-[200px] p-4 text-sm leading-relaxed text-slate-700 bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Add a detailed description..."
                  />
               </div>

               {/* Attachments */}
               <div className="mb-8">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Paperclip size={14}/> Attachments
                  </label>
                  
                  {/* Existing Attachments */}
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-3">
                       {formData.attachments.map((file, idx) => {
                          const isPdf = file.url?.toLowerCase().endsWith('.pdf') || file.format?.includes('pdf');
                          return (
                             <a href={file.url} target="_blank" rel="noopener noreferrer" key={idx} 
                                className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition bg-white"
                             >
                                <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${isPdf ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                   {isPdf ? <FileText size={20}/> : <Eye size={20}/>}
                                </div>
                                <div className="overflow-hidden">
                                   <div className="text-sm font-medium text-slate-700 truncate">{file.name || "Attachment"}</div>
                                   <div className="text-[10px] text-slate-400 uppercase">{isPdf ? 'PDF Document' : 'Image File'}</div>
                                </div>
                                <ExternalLink size={14} className="ml-auto text-slate-300 group-hover:text-blue-500"/>
                             </a>
                          )
                       })}
                    </div>
                  )}

                  {/* Upload Field */}
                  <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50/50 relative">
                      <span className="text-sm text-slate-400 font-medium">Click to upload new files</span>
                      <input 
                        type="file" multiple 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={e => updateField('newFiles', e.target.files)} 
                      />
                      {formData.newFiles && <div className="text-xs text-blue-600 font-bold mt-2">{formData.newFiles.length} files selected</div>}
                  </div>
               </div>
            </div>

            {/* RIGHT COLUMN: META DATA (35%) - GRAY SIDEBAR */}
            <div className="w-full md:w-[320px] bg-slate-50/80 p-6 flex flex-col gap-6 overflow-y-auto border-l border-slate-100">
               
               {/* Status */}
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
                  <div className="relative">
                      <select 
                        value={formData.status} 
                        onChange={(e) => updateField('status', e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-bold py-3 px-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-sm"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"/>
                  </div>
               </div>

               {/* Priority (Buttons Style) */}
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Priority</label>
                  <div className="grid grid-cols-4 gap-1">
                     {['Low', 'Medium', 'High', 'Critical'].map(p => (
                        <button 
                           key={p}
                           onClick={() => updateField('priority', p)}
                           className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all 
                           ${formData.priority === p 
                             ? (p === 'Critical' ? 'bg-red-900 text-white border-red-900' : 'bg-slate-800 text-white border-slate-800') 
                             : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                           {p}
                        </button>
                     ))}
                  </div>
               </div>
               
               <hr className="border-slate-200" />

               {/* POD / TEAM SELECTOR (Added per request) */}
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Pod / Team</label>
                  <div className="relative">
                      <select 
                        value={formData.pod} 
                        onChange={(e) => updateField('pod', e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                      >
                        {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <Users size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"/>
                  </div>
               </div>

               {/* Assignee */}
               <UserSelect 
                  users={users} 
                  selectedId={formData.assignee?._id || formData.assignee} 
                  onChange={(id) => updateField('assignee', id)} 
                  label="Assignee" 
                  type="assignee"
               />

               {/* Reporter */}
               <UserSelect 
                  users={users} 
                  selectedId={formData.reporter?._id || formData.reporter} 
                  onChange={(id) => updateField('reporter', id)} 
                  label="Reporter (Receives Email)" 
                  type="reporter"
               />

               <hr className="border-slate-200" />
               
               {/* Timeline */}
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Timeline</label>
                 <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                       <Clock size={16} className="text-slate-400"/> 
                       <span className="text-xs text-slate-400 font-bold uppercase mr-2">Due:</span>
                       <input 
                         type="date" 
                         value={formData.deadline ? formData.deadline.split('T')[0] : ''}
                         onChange={(e) => updateField('deadline', e.target.value)}
                         className="outline-none text-slate-700 font-bold bg-transparent w-full"
                       />
                 </div>
               </div>

            </div>
          </div>
       </div>
    </>
  );
}

// --- TASK CARD ---
function TaskCard({ task, index, onClick }) {
  const isDone = task.status === 'Done';
  
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps} 
          onClick={onClick} 
          className={`
            bg-white p-4 rounded-xl border mb-3 shadow-sm hover:shadow-md transition-all group relative cursor-pointer
            ${snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-blue-500 z-50' : 'border-slate-200'}
            ${isDone ? 'opacity-75' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 tracking-wide border border-slate-200">{task.pod}</span>
             {task.priority === 'Critical' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </div>

          <h4 className={`font-semibold text-slate-800 text-sm mb-3 leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
             {task.title}
          </h4>

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="flex items-center gap-2">
                {task.assignee ? (
                    <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm border border-white">
                           {task.assignee.username[0].toUpperCase()}
                         </div>
                    </div>
                ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                       <UserIcon size={12} className="text-slate-300"/>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                {task.deadline && (
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${new Date(task.deadline) < new Date() && !isDone ? 'text-red-500' : 'text-slate-400'}`}>
                    <Calendar size={12} />
                    {new Date(task.deadline).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// --- SIDEBAR ---
function Sidebar({ user, setToken, activeTab, setActiveTab }) {
  return (
    <aside className="w-[240px] bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
         <span className="text-lg font-bold text-white tracking-tight">BeeBark</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        <SidebarItem active={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<LayoutGrid size={18}/>}>Roadmap</SidebarItem>
        <SidebarItem active={activeTab === 'my-tasks'} onClick={() => setActiveTab('my-tasks')} icon={<CheckCircle2 size={18}/>}>My Issues</SidebarItem>
        <SidebarItem active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<Users size={18}/>}>Team</SidebarItem>
      </nav>

      <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg">
             {user?.username?.[0]?.toUpperCase()}
           </div>
           <div className="overflow-hidden">
             <div className="text-sm font-bold text-white truncate">{user?.username}</div>
             <div className="text-[10px] text-slate-400 truncate">Online</div>
           </div>
        </div>
        <button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold w-full transition-colors p-2 rounded hover:bg-slate-700">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

function SidebarItem({ children, active, onClick, icon }) {
    return (
      <button 
        onClick={onClick} 
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
        ${active ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}
      >
        {icon}{children}
      </button>
    );
}

// --- MODAL: CREATE TEAM (Kept as requested) ---
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
                    <div className="h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 custom-scrollbar bg-slate-50">
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
    <div className="h-screen w-full flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8"><h1 className="text-3xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Sign in to your workspace</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
           {!isLogin && <input className="w-full border p-3 rounded-lg bg-slate-50" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />}
           <input type="email" className="w-full border p-3 rounded-lg bg-slate-50" placeholder="Email address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
           <input type="password" className="w-full border p-3 rounded-lg bg-slate-50" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
           {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
           <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg">{loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
        </form>
        <div className="text-center mt-4"><button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline font-bold">{isLogin ? "No account? Create one" : "Already have an account?"}</button></div>
      </div>
    </div>
  );
}

function TeamView() {
    return <div className="p-10 text-center text-slate-500 font-bold">Select "New Pod" to create a team or view Board.</div>
}