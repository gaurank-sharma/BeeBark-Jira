
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { 
//   Trash2, Plus, LogOut, User as UserIcon, Loader2, 
//   Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
//   Lock, X, Download, FileText, Clock, Edit2, Save, ExternalLink,
//   Search, AlertCircle, ChevronDown
// } from 'lucide-react';
// import logo from './assets/logo.png'; 

// // Use your localhost URL for development
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

// // --- HELPER: GENERATE TASK ID ---
// const generateTaskId = () => {
//   const randomNum = Math.floor(1000 + Math.random() * 9000);
//   return `BB-${randomNum}`;
// };

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
//   const [searchQuery, setSearchQuery] = useState('');
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

//   // Filter tasks based on Search Query (ID or Title)
//   const filteredTasks = tasks.filter(task => {
//     const query = searchQuery.toLowerCase();
//     const matchesTitle = task.title.toLowerCase().includes(query);
//     const matchesId = task.taskId ? task.taskId.toLowerCase().includes(query) : false;
//     return matchesTitle || matchesId;
//   });

//   const columns = ['To Do', 'In Progress', 'Blocked', 'Done'];

//   return (
//     <div className="h-full flex flex-col p-8 overflow-x-auto">
//       <header className="flex justify-between items-center mb-6">
//         <div>
//            <h1 className="text-2xl font-bold text-slate-900">{filter === 'my-tasks' ? 'My Tasks' : 'Project Board'}</h1>
//            <p className="text-slate-500 text-sm">Overview of all active pods</p>
//         </div>

//         {/* SEARCH BAR */}
//         <div className="flex-1 max-w-md mx-6">
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input 
//                     type="text" 
//                     placeholder="Search by Title or Ticket ID (e.g., BB-1234)..." 
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </div>
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
//                    <div className={`w-2 h-2 rounded-full ${
//                        status === 'Done' ? 'bg-green-500' : 
//                        status === 'In Progress' ? 'bg-blue-500' : 
//                        status === 'Blocked' ? 'bg-red-500' : 
//                        'bg-slate-400'
//                     }`}></div>
//                    {status}
//                 </h3>
//                 <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 text-slate-500">{filteredTasks.filter(t => t.status === status).length}</span>
//               </div>
//               <Droppable droppableId={status}>
//                 {(provided, snapshot) => (
//                   <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 rounded-xl p-3 overflow-y-auto custom-scrollbar transition-colors border-2 ${snapshot.isDraggingOver ? 'bg-yellow-50/50 border-yellow-400/50' : 'bg-slate-100/50 border-transparent'}`}>
//                     {filteredTasks.filter(t => t.status === status).map((task, index) => (
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

// // --- TASK DETAIL MODAL (Redesigned to Match Creation Modal) ---
// function TaskDetailModal({ task, onClose, onUpdate, users }) {
//   const [loading, setLoading] = useState(false);
//   const [editForm, setEditForm] = useState({
//      ...task,
//      assigneeId: task.assignee?._id || task.assignee || "",
//      reporterId: task.reporter?._id || task.reporter || "",
//      startDate: task.startDate ? task.startDate.split('T')[0] : "",
//      deadline: task.deadline ? task.deadline.split('T')[0] : ""
//   });

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//         await axios.put(`${API_URL}/tasks/${task._id}`, {
//             title: editForm.title,
//             description: editForm.description,
//             priority: editForm.priority,
//             pod: editForm.pod,
//             status: editForm.status,
//             assigneeId: editForm.assigneeId,
//             startDate: editForm.startDate,
//             deadline: editForm.deadline,
//         });
//         onUpdate();
//         onClose();
//     } catch (err) { alert("Failed to update task"); }
//     finally { setLoading(false); }
//   };

//   if (!task) return null;

//   const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[80vh] flex flex-col">
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//                 Task Details 
//                 {/* ID DISPLAY FIX */}
//                 <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-sm font-medium border border-slate-200">
//                     {task.taskId || 'NO-ID'}
//                 </span>
//             </h2>
//             <div className="flex gap-4 items-center">
//                 <button 
//                     onClick={handleSave} 
//                     disabled={loading}
//                     className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2"
//                 >
//                     {loading && <Loader2 className="animate-spin" size={14} />} Save Changes
//                 </button>
//                 <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
//             </div>
//         </div>

//         {/* BODY (Split Layout) */}
//         <div className="flex flex-1 overflow-hidden">
//             {/* LEFT: CONTENT */}
//             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
//                  <input 
//                     className="w-full text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-6 bg-transparent" 
//                     placeholder="Issue Title" 
//                     value={editForm.title} 
//                     onChange={e => setEditForm({...editForm, title: e.target.value})} 
//                  />

//                  <div className="mb-6">
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
//                         <FileText size={14} /> Description
//                     </label>
//                     <textarea 
//                         className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 resize-none" 
//                         value={editForm.description} 
//                         onChange={e => setEditForm({...editForm, description: e.target.value})} 
//                     />
//                  </div>

//                  <div>
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
//                         <Paperclip size={14} /> Attachments ({task.attachments?.length || 0})
//                     </label>
//                     {task.attachments && task.attachments.length > 0 ? (
//                         <div className="grid grid-cols-2 gap-4 mt-2">
//                             {task.attachments.map((file, idx) => (
//                                 <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
//                                     <div className="bg-red-50 p-2 rounded text-red-500"><FileText size={18}/></div>
//                                     <div className="overflow-hidden">
//                                         <div className="text-sm font-bold text-slate-700 truncate">{file.name}</div>
//                                         <div className="text-xs text-slate-400 uppercase">{file.format?.split('/')[1] || 'FILE'}</div>
//                                     </div>
//                                 </a>
//                             ))}
//                         </div>
//                     ) : <div className="text-sm text-slate-400 italic">No attachments.</div>}
//                  </div>
//             </div>

//             {/* RIGHT: META DETAILS */}
//             <div className="w-80 bg-slate-50 p-6 overflow-y-auto custom-scrollbar space-y-6">
                
//                 {/* STATUS */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
//                     <select 
//                         className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none"
//                         value={editForm.status} 
//                         onChange={e => setEditForm({...editForm, status: e.target.value})}
//                     >
//                         <option>To Do</option>
//                         <option>In Progress</option>
//                         <option>Blocked</option>
//                         <option>Done</option>
//                     </select>
//                 </div>

//                 {/* PRIORITY */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
//                     <div className="flex gap-1">
//                         {['Low', 'Medium', 'High', 'Critical'].map(p => (
//                             <button 
//                                 key={p}
//                                 onClick={() => setEditForm({...editForm, priority: p})}
//                                 className={`flex-1 py-1 text-[10px] uppercase font-bold border rounded transition
//                                     ${editForm.priority === p 
//                                         ? 'bg-slate-800 text-white border-slate-800' 
//                                         : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
//                                     }`}
//                             >
//                                 {p}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* POD */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Team</label>
//                     <div className="relative">
//                         <select 
//                             className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
//                             value={editForm.pod} 
//                             onChange={e => setEditForm({...editForm, pod: e.target.value})}
//                         >
//                             {PODS.map(p => <option key={p} value={p}>{p}</option>)}
//                         </select>
//                         <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
//                     </div>
//                 </div>

//                 {/* ASSIGNEE */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
//                     <div className="relative">
//                         <select 
//                             className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
//                             value={editForm.assigneeId} 
//                             onChange={e => setEditForm({...editForm, assigneeId: e.target.value})}
//                         >
//                             <option value="">Unassigned</option>
//                             {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                         </select>
//                         <UserIcon size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
//                     </div>
//                 </div>

//                 {/* TIMELINE */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeline</label>
//                     <div className="bg-white border border-slate-200 rounded p-3">
//                          <div className="mb-2">
//                             <label className="text-[10px] text-slate-400 uppercase">Start Date</label>
//                             <input type="date" className="w-full text-sm font-medium outline-none" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} />
//                          </div>
//                          <div className="pt-2 border-t border-slate-100">
//                             <label className="text-[10px] text-slate-400 uppercase">Due Date</label>
//                             <input type="date" className="w-full text-sm font-medium outline-none" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} />
//                          </div>
//                     </div>
//                 </div>

//                 {/* REPORTER INFO */}
//                 <div className="pt-4 border-t border-slate-200">
//                     <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reported By</label>
//                     <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
//                         <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">R</div>
//                         {task.reporter?.username || 'Unknown'}
//                     </div>
//                 </div>

//             </div>
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
//           <div className="flex justify-between items-start mb-2">
//              {/* ID DISPLAY ON CARD */}
//              <span className="text-[10px] font-bold text-slate-500 hover:text-blue-600 transition">{task.taskId}</span>
//              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'Low' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.priority}</span>
//           </div>
//           <h4 className="font-semibold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
          
//           <div className="flex flex-wrap gap-2 mb-3">
//             <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[120px]">{task.pod}</span>
//           </div>

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

// // --- CREATE TASK MODAL (Match Image Design) ---
// function CreateTaskModal({ onClose, onSuccess, currentUser, users }) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '', description: '', 
//     status: 'To Do',
//     priority: 'Medium', 
//     pod: 'Development', 
//     assigneeId: '',
//     startDate: new Date().toISOString().split('T')[0], 
//     deadline: '', 
//     files: [],
//     reporterId: currentUser._id,
//     taskId: generateTaskId() 
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setLoading(true);
//     const data = new FormData();
//     Object.keys(formData).forEach(key => {
//         if(key === 'files') { for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); } 
//         else { data.append(key, formData[key]); }
//     });
    
//     try { 
//         await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
//         onSuccess(); 
//         onClose(); 
//     } 
//     catch(err) { alert("Failed."); } finally { setLoading(false); }
//   };

//   const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[80vh] flex flex-col">
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
//             <h2 className="text-lg font-bold text-slate-800">New Task <span className="text-slate-400 font-normal ml-2">{formData.taskId}</span></h2>
//             <div className="flex gap-4 items-center">
//                 <button 
//                     onClick={handleSubmit} 
//                     disabled={loading}
//                     className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2"
//                 >
//                     {loading && <Loader2 className="animate-spin" size={14} />} Create Task
//                 </button>
//                 <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
//             </div>
//         </div>

//         {/* BODY (Split Layout) */}
//         <div className="flex flex-1 overflow-hidden">
//             {/* LEFT: CONTENT */}
//             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
//                  <input 
//                     className="w-full text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-6 bg-transparent" 
//                     placeholder="Issue Title" 
//                     value={formData.title} 
//                     onChange={e => setFormData({...formData, title: e.target.value})} 
//                     autoFocus
//                     required 
//                  />

//                  <div className="mb-6">
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
//                         <FileText size={14} /> Description
//                     </label>
//                     <textarea 
//                         className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-64 outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 resize-none" 
//                         placeholder="Add a detailed description..."
//                         value={formData.description} 
//                         onChange={e => setFormData({...formData, description: e.target.value})} 
//                     />
//                  </div>

//                  <div>
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
//                         <Paperclip size={14} /> Attachments
//                     </label>
//                     <div className="border border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer relative">
//                         <span className="text-sm">Click to upload new files</span>
//                         <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} />
//                     </div>
//                     {formData.files.length > 0 && <div className="mt-2 text-xs font-bold text-green-600">{formData.files.length} files selected</div>}
//                  </div>
//             </div>

//             {/* RIGHT: META DETAILS */}
//             <div className="w-80 bg-slate-50 p-6 overflow-y-auto custom-scrollbar space-y-6">
                
//                 {/* STATUS */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
//                     <select 
//                         className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none"
//                         value={formData.status} 
//                         onChange={e => setFormData({...formData, status: e.target.value})}
//                     >
//                         <option>To Do</option>
//                         <option>In Progress</option>
//                         <option>Blocked</option>
//                         <option>Done</option>
//                     </select>
//                 </div>

//                 {/* PRIORITY */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
//                     <div className="flex gap-1">
//                         {['Low', 'Medium', 'High', 'Critical'].map(p => (
//                             <button 
//                                 key={p}
//                                 type="button"
//                                 onClick={() => setFormData({...formData, priority: p})}
//                                 className={`flex-1 py-1 text-[10px] uppercase font-bold border rounded transition
//                                     ${formData.priority === p 
//                                         ? 'bg-slate-800 text-white border-slate-800' 
//                                         : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
//                                     }`}
//                             >
//                                 {p}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* POD */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Team</label>
//                     <div className="relative">
//                         <select 
//                             className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
//                             value={formData.pod} 
//                             onChange={e => setFormData({...formData, pod: e.target.value})}
//                         >
//                             {PODS.map(p => <option key={p} value={p}>{p}</option>)}
//                         </select>
//                         <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
//                     </div>
//                 </div>

//                 {/* ASSIGNEE */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
//                     <div className="relative">
//                         <select 
//                             className="w-full bg-white border border-slate-200 rounded p-2 text-sm font-medium outline-none appearance-none"
//                             value={formData.assigneeId} 
//                             onChange={e => setFormData({...formData, assigneeId: e.target.value})}
//                         >
//                             <option value="">Unassigned</option>
//                             {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                         </select>
//                         <UserIcon size={14} className="absolute right-3 top-3 pointer-events-none text-slate-400"/>
//                     </div>
//                 </div>

//                 {/* TIMELINE */}
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timeline</label>
//                     <div className="bg-white border border-slate-200 rounded p-3">
//                          <div className="mb-2">
//                             <label className="text-[10px] text-slate-400 uppercase">Start Date</label>
//                             <input type="date" className="w-full text-sm font-medium outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
//                          </div>
//                          <div className="pt-2 border-t border-slate-100">
//                             <label className="text-[10px] text-slate-400 uppercase">Due Date</label>
//                             <input type="date" className="w-full text-sm font-medium outline-none" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
//                          </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
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
  Search, AlertCircle, ChevronDown, CheckSquare, Square, ArrowRight, Copy, Check
} from 'lucide-react';
import logo from './assets/logo.png'; 

const API_URL = 'https://bee-bark-jira-backend.vercel.app/api'; 

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

const generateTaskId = () => `BB-${Math.floor(1000 + Math.random() * 9000)}`;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [activeView, setActiveView] = useState('board'); 
  const [activeTeam, setActiveTeam] = useState(null); 

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
      <Sidebar 
        user={user} 
        setToken={setToken} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
      />
      <main className="flex-1 overflow-hidden relative">
        {activeView === 'board' && <BoardView currentUser={user} activeTeam={activeTeam} filter={activeTeam ? 'team' : 'all'} />}
        {activeView === 'my-tasks' && <BoardView currentUser={user} activeTeam={null} filter="my-tasks" />}
        {activeView === 'team-list' && <TeamView />}
      </main>
    </div>
  );
}

// --- VIEW: KANBAN BOARD ---
function BoardView({ currentUser, activeTeam, filter }) {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // MODAL STATES
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [parentTaskForSubtask, setParentTaskForSubtask] = useState(null); // If set, we are creating a subtask
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
      axios.get(`${API_URL}/users`).then(res => setUsers(res.data));
      axios.get(`${API_URL}/teams`).then(res => setTeams(res.data));
  }, []);

  const fetchTasks = async () => {
    let endpoint = `${API_URL}/tasks`;
    if (filter === 'my-tasks') endpoint += `?filter=my-tasks`;
    else if (activeTeam) endpoint += `?teamId=${activeTeam._id}`;
    
    try {
        const { data } = await axios.get(endpoint);
       setTasks(data);
        
        // If a task is currently selected, refresh its data from the full list
        if(selectedTask) {
            const updated = data.find(t => t._id === selectedTask._id);
            if(updated) setSelectedTask(updated);
        }
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchTasks(); }, [filter, activeTeam]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    // Optimistic Update
    const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTasks(updated);
    await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
  };

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return task.title.toLowerCase().includes(query) || (task.taskId && task.taskId.toLowerCase().includes(query));
  });

  const columns = ['To Do', 'In Progress', 'Blocked', 'Done'];

  return (
    <div className="h-full flex flex-col p-8 overflow-x-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">
               {filter === 'my-tasks' ? 'My Tasks' : activeTeam ? activeTeam.name : 'All Tasks'}
           </h1>
           <p className="text-slate-500 text-sm">
               {activeTeam ? (activeTeam.isPrivate ? 'Private Team Board' : 'Public Team Board') : 'Overview'}
           </p>
        </div>

        <div className="flex-1 max-w-md mx-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by Title or Ticket ID..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="flex gap-3">
            <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
              <Users size={18} /> New Team
            </button>
            <button onClick={() => { setParentTaskForSubtask(null); setIsCreateModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
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
                   <div className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : status === 'Blocked' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
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

      {/* CREATE MODAL (Used for both Tasks and Subtasks) */}
      {isCreateModalOpen && (
        <CreateTaskModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onSuccess={fetchTasks} 
            currentUser={currentUser} 
            users={users} 
            teams={teams} 
            activeTeam={activeTeam}
            parentTask={parentTaskForSubtask} // Pass parent if creating subtask
        />
      )}

      {isTeamModalOpen && <CreateTeamModal onClose={() => {setIsTeamModalOpen(false); window.location.reload();}} onSuccess={() => alert("Team Created!")} />}
      
      {/* DETAIL MODAL */}
      {selectedTask && (
        <TaskDetailModal 
            task={selectedTask} 
            users={users} 
            teams={teams} 
            onClose={() => setSelectedTask(null)} 
            onUpdate={fetchTasks}
            onCreateSubtask={() => {
                setParentTaskForSubtask(selectedTask);
                setIsCreateModalOpen(true);
            }}
            onSelectSubtask={(sub) => {
                // To drill down into a subtask
                // You might need to fetch the full subtask data if populate isn't deep enough
                // For now, assuming sub is populated or we fetch
                // Simplest: just swap selectedTask
                // But we need full data. Let's fetch it.
                axios.get(`${API_URL}/tasks?taskId=${sub._id}`).then(res => {
                    // Since API returns list, finding logic might differ. 
                    // Better approach: just rely on the fact that selectedTask needs full object.
                    // Ideally we have an endpoint GET /tasks/:id
                    // For this snippet, we'll try to find it in 'tasks' state, if not there (it's a subtask), we rely on parent's data or need a fetch.
                    // Let's implement a quick fetch by ID in fetchTasks logic? 
                    // Or just use the object we have from populate:
                    setSelectedTask(sub); // Note: this sub object might be partial from populate
                });
            }}
        />
      )}
    </div>
  );
}

// --- TASK DETAIL MODAL ---
function TaskDetailModal({ task, onClose, onUpdate, users, teams, onCreateSubtask, onSelectSubtask }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editForm, setEditForm] = useState({
     ...task,
     assigneeId: task.assignee?._id || task.assignee || "",
     reporterId: task.reporter?._id || task.reporter || "",
     teamId: task.team?._id || task.team || "",
     startDate: task.startDate ? task.startDate.split('T')[0] : "",
     deadline: task.deadline ? task.deadline.split('T')[0] : "",
  });

  const handleSave = async () => {
    if (!editForm.assigneeId || !editForm.reporterId || !editForm.startDate || !editForm.deadline || !editForm.teamId || !editForm.pod) {
        alert("Please fill all mandatory fields.");
        return;
    }
    setLoading(true);
    try {
        await axios.put(`${API_URL}/tasks/${task._id}`, editForm);
        onUpdate();
        onClose();
    } catch (err) { alert("Failed to update task"); }
    finally { setLoading(false); }
  };

  const handleCopyId = () => {
      navigator.clipboard.writeText(task.taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[85vh] flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
                {/* <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-200 uppercase tracking-wider">
                    {task.taskId}
                </span> */}

                <button 
                    onClick={handleCopyId}
                    className="flex items-center gap-2 bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-200 uppercase tracking-wider hover:bg-slate-200 transition"
                    title="Click to Copy ID"
                >
                    {task.taskId}
                    {copied ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                </button>
                {task.parentTask && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Subtask</span>}
                <input 
                    className="font-bold text-lg text-slate-800 placeholder:text-slate-300 outline-none bg-transparent w-96 hover:bg-slate-50 rounded px-1 transition" 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})} 
                />
            </div>
            <div className="flex gap-4 items-center">
                <button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-slate-900 text-white px-5 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={14} />} Save
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
            </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><FileText size={14} /> Description <span className="text-red-500">*</span></label>
                    <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-40 outline-none focus:ring-2 focus:ring-yellow-400/50 text-slate-700 resize-none text-sm leading-relaxed" 
                        value={editForm.description} 
                        onChange={e => setEditForm({...editForm, description: e.target.value})} 
                    />
                 </div>

                 {/* SUBTASKS (Real Objects) */}
                 <div className="mb-8">
                     <div className="flex justify-between items-center mb-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase"><CheckCircle2 size={14} /> Child Tasks</label>
                        <button onClick={onCreateSubtask} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Plus size={12}/> Add Child Task</button>
                     </div>
                     
                     <div className="space-y-2">
                         {task.subtasks && task.subtasks.length > 0 ? task.subtasks.map((sub, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition group cursor-pointer" onClick={() => onSelectSubtask && onSelectSubtask(sub)}>
                                 <div className="flex items-center gap-3">
                                     <span className="text-xs font-bold text-slate-400">{sub.taskId}</span>
                                     <span className="text-sm font-medium text-slate-700">{sub.title}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className="text-[10px] uppercase font-bold bg-white px-2 py-1 rounded border border-slate-200">{sub.status}</span>
                                     <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold">{sub.assignee?.username?.[0] || 'U'}</div>
                                     <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500"/>
                                 </div>
                             </div>
                         )) : <div className="text-sm text-slate-400 italic p-4 border border-dashed rounded text-center">No subtasks yet.</div>}
                     </div>
                 </div>

                 {/* Attachments */}
                 <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><Paperclip size={14} /> Attachments</label>
                    {task.attachments?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {task.attachments.map((file, idx) => (
                                <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition group bg-white">
                                    <div className="bg-red-50 p-2.5 rounded-lg text-red-500"><FileText size={20}/></div>
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-bold text-slate-700 truncate">{file.name}</div>
                                    </div>
                                    <ExternalLink size={14} className="ml-auto text-slate-300 group-hover:text-slate-600"/>
                                </a>
                            ))}
                        </div>
                    ) : <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-lg text-center">No attachments found.</div>}
                 </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-80 bg-slate-50/80 p-6 overflow-y-auto custom-scrollbar space-y-6 border-l border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status <span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                            <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority <span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
                            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Timeline <span className="text-red-500">*</span></label>
                     <div className="mb-2">
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Start Date</label>
                        <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} required />
                     </div>
                     <div className="pt-2 border-t border-slate-100">
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Due Date</label>
                        <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} required />
                     </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.teamId} onChange={e => setEditForm({...editForm, teamId: e.target.value})}>
                        <option value="">Select Team</option>
                        {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Category <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.pod} onChange={e => setEditForm({...editForm, pod: e.target.value})}>
                        {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.assigneeId} onChange={e => setEditForm({...editForm, assigneeId: e.target.value})}>
                        <option value="">Unassigned</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.reporterId} onChange={e => setEditForm({...editForm, reporterId: e.target.value})}>
                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- CREATE TASK MODAL (Used for both Parent and Subtasks) ---
function CreateTaskModal({ onClose, onSuccess, currentUser, users, teams, activeTeam, parentTask }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', 
    status: 'To Do',
    priority: 'Medium', 
    teamId: activeTeam ? activeTeam._id : (parentTask ? parentTask.team._id : ''), // Inherit team if subtask
    pod: parentTask ? parentTask.pod : 'Development', // Inherit pod if subtask
    assigneeId: '',
    startDate: new Date().toISOString().split('T')[0], 
    deadline: '', 
    files: [],
    reporterId: currentUser._id,
    taskId: generateTaskId(),
    parentTaskId: parentTask ? parentTask._id : null
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if(!formData.teamId || !formData.assigneeId || !formData.reporterId || !formData.deadline || !formData.title || !formData.description || !formData.pod) {
        alert("Please fill all mandatory fields marked with *");
        return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if(key === 'files') { for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); } 
        else { data.append(key, formData[key]); }
    });
    
    try { 
        await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
        onSuccess(); 
        onClose(); 
    } 
    catch(err) { alert("Failed to create task."); } finally { setLoading(false); }
  };

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-800">
                {parentTask ? `New Subtask for ${parentTask.taskId}` : 'New Task'} 
                <span className="text-slate-400 font-normal ml-2">{formData.taskId}</span>
            </h2>
            <div className="flex gap-4 items-center">
                <button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin" size={14} />} Create
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
                 <input className="w-full text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-6 bg-transparent" placeholder="Issue Title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus required />

                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><FileText size={14} /> Description <span className="text-red-500">*</span></label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-40 outline-none" placeholder="Add details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                 </div>

                 <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><Paperclip size={14} /> Attachments</label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 relative">
                        <span className="text-sm">Click to upload new files</span>
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} />
                    </div>
                 </div>
            </div>

            <div className="w-80 bg-slate-50 p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                        <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                    </select>
                </div>
                
                {/* TEAM: Inherit if child, else select */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.teamId} onChange={e => setFormData({...formData, teamId: e.target.value})} disabled={!!parentTask}>
                        <option value="">Select Team</option>
                        {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>

                {/* POD */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Category <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.pod} onChange={e => setFormData({...formData, pod: e.target.value})}>
                        {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}>
                        <option value="">Select Assignee</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter <span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.reporterId} onChange={e => setFormData({...formData, reporterId: e.target.value})}>
                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                    </select>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Timeline <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                    <input type="date" className="w-full text-sm" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- TASK CARD ---
// --- TASK CARD (Updated with Copy Icon) ---
function TaskCard({ task, index, onClick }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
      e.stopPropagation(); // Prevent opening the modal
      navigator.clipboard.writeText(task.taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={onClick} className={`bg-white p-4 rounded-lg border border-slate-200 mb-3 shadow-sm hover:shadow-md transition group relative cursor-pointer ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-yellow-400 z-50' : ''}`}>
          
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-1 group/id">
                 <span className="text-[10px] font-bold text-slate-500 group-hover/id:text-blue-600 transition">
                    {task.taskId}
                 </span>
                 {/* COPY ICON BUTTON */}
                 <button 
                    onClick={handleCopy} 
                    className="opacity-0 group-hover/id:opacity-100 text-slate-400 hover:text-blue-600 transition p-0.5"
                    title="Copy Task ID"
                 >
                    {copied ? <Check size={10} className="text-green-500"/> : <Copy size={10}/>}
                 </button>
             </div>
             <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'Low' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{task.priority}</span>
          </div>

          <h4 className="font-semibold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[120px]">{task.pod}</span>
            {task.status === 'Blocked' && <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-red-100 text-red-600 border-red-200">Blocked</span>}
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
            
            {task.subtasks?.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    <CheckCircle2 size={12}/> {task.subtasks.filter(s => s.status === 'Done').length}/{task.subtasks.length}
                </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ... (TeamView, AuthScreen, CreateTeamModal, Sidebar remain similar to before)
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in duration-200">
         <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-900">Create New Team</h2><button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button></div>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Name</label><input className="w-full border border-slate-200 rounded-lg p-3 outline-none" placeholder="e.g. Secret Project X" value={name} onChange={e => setName(e.target.value)} required /></div>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} /><div><span className="block text-sm font-bold text-slate-800 flex items-center gap-2"><Lock size={14} /> Private Team?</span><span className="block text-xs text-slate-500">Only selected members see this.</span></div></label>
            {isPrivate && (
                <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Members</label>
                    <div className="h-64 overflow-y-auto border border-slate-200 rounded-lg p-2 custom-scrollbar bg-slate-50">
                        {users.map(u => (
                            <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded cursor-pointer transition">
                                <input type="checkbox" checked={selectedMembers.includes(u._id)} onChange={() => toggleMember(u._id)} className="accent-slate-900 w-4 h-4"/>
                                <span className="text-sm font-medium text-slate-700">{u.username}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">{loading && <Loader2 className="animate-spin" size={16}/>} Create Team</button></div>
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

function Sidebar({ user, setToken, activeView, setActiveView, activeTeam, setActiveTeam }) {
  const [teams, setTeams] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/teams`).then(res => setTeams(res.data)); }, []);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100"><img src={logo} alt="Logo" className="w-8 h-8 object-contain" /><span className="text-lg font-black tracking-tighter text-slate-900">BeeBark</span></div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="mb-4">
            <button onClick={() => { setActiveView('board'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'board' && !activeTeam ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutGrid size={18}/> All Tasks
            </button>
            <button onClick={() => { setActiveView('my-tasks'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'my-tasks' ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
                <CheckCircle2 size={18}/> My Tasks
            </button>
            <button onClick={() => { setActiveView('team-list'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'team-list' ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Users size={18}/> Team Members
            </button>
        </div>
        <div className="mt-6">
            <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Teams</div>
            {teams.map(team => (
                <button key={team._id} onClick={() => { setActiveView('board'); setActiveTeam(team); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1 ${activeTeam?._id === team._id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {team.isPrivate ? <Lock size={14} className="text-red-400"/> : <Users size={14} className="text-blue-400"/>}
                    <span className="truncate">{team.name}</span>
                </button>
            ))}
        </div>
      </nav>
      <div className="p-4 border-t border-slate-100 bg-slate-50"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-sm">{user?.username?.[0]?.toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-900">{user?.username}</div><div className="text-xs text-slate-500 truncate">{user?.email}</div></div></div><button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs font-bold w-full transition-colors p-2 rounded hover:bg-red-50"><LogOut size={14} /> Sign Out</button></div>
    </aside>
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
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8"><h1 className="text-4xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Agile project management.</p></div>
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