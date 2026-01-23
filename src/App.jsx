


// //================================================================================================================================//

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { 
//   Trash2, Plus, LogOut, User as UserIcon, Loader2, 
//   Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
//   Lock, X, Download, FileText, Clock, Edit2, Save, ExternalLink,
//   Search, AlertCircle, ChevronDown, CheckSquare, Square, ArrowRight, Copy, Check, Hexagon
// } from 'lucide-react';

// // --- CONFIGURATION ---
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
//       // FIX 4: Use replace() to avoid filling browser history (Login Loop Fix)
//       if (window.location.pathname !== '/') window.location.replace("/");
//     }
//     return Promise.reject(error);
//   }
// );

// const generateTaskId = () => `BB-${Math.floor(1000 + Math.random() * 9000)}`;

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
//   const [activeView, setActiveView] = useState('board'); 
//   const [activeTeam, setActiveTeam] = useState(null); 
  
//   // GLOBAL DATA STATE
//   const [users, setUsers] = useState([]);
//   const [teams, setTeams] = useState([]);

//   // Fetch Data Globally
//   const fetchGlobalData = () => {
//       if(!token) return;
//       axios.get(`${API_URL}/users`)
//         .then(res => setUsers(res.data || []))
//         .catch(err => console.error("User fetch error:", err));
      
//       axios.get(`${API_URL}/teams`)
//         .then(res => setTeams(res.data || []))
//         .catch(err => console.error("Team fetch error:", err));
//   };

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//       if(user) localStorage.setItem('user', JSON.stringify(user));
//       fetchGlobalData(); 
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }
//   }, [token, user]);

//   if (!token) return <AuthScreen setToken={setToken} setUser={setUser} />;

//   return (
//     <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
//       <Sidebar 
//         user={user} 
//         setToken={setToken} 
//         activeView={activeView} 
//         setActiveView={setActiveView} 
//         activeTeam={activeTeam}
//         setActiveTeam={setActiveTeam}
//         teams={teams} 
//       />
//       <main className="flex-1 overflow-hidden relative">
//         {activeView === 'board' && (
//             <BoardView 
//                 currentUser={user} 
//                 activeTeam={activeTeam} 
//                 filter={activeTeam ? 'team' : 'all'} 
//                 users={users} 
//                 teams={teams} 
//                 refreshData={fetchGlobalData}
//             />
//         )}
//         {activeView === 'my-tasks' && (
//             <BoardView 
//                 currentUser={user} 
//                 activeTeam={null} 
//                 filter="my-tasks" 
//                 users={users} 
//                 teams={teams} 
//                 refreshData={fetchGlobalData}
//             />
//         )}
//         {activeView === 'team-list' && <TeamView users={users} />}
//       </main>
//     </div>
//   );
// }

// // --- VIEW: KANBAN BOARD ---
// function BoardView({ currentUser, activeTeam, filter, users, teams, refreshData }) {
//   const [tasks, setTasks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // MODAL STATES
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [parentTaskForSubtask, setParentTaskForSubtask] = useState(null);
//   const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const fetchTasks = async () => {
//     let endpoint = `${API_URL}/tasks`;
//     if (filter === 'my-tasks') {
//         endpoint += `?filter=my-tasks`;
//     } else if (activeTeam) {
//         endpoint += `?teamId=${activeTeam._id}`;
//     }
    
//     try {
//         const { data } = await axios.get(endpoint);
//         const topLevelTasks = (data || []).filter(t => !t.parentTask);
//         setTasks(topLevelTasks);
        
//         // Refresh selected task if it's open
//         if(selectedTask) {
//              const updatedOpenTask = data.find(t => t._id === selectedTask._id);
//              if (updatedOpenTask) setSelectedTask(updatedOpenTask);
//         }
//     } catch (e) { console.error("Fetch error", e); }
//   };

//   useEffect(() => { fetchTasks(); }, [filter, activeTeam]);

//   const onDragEnd = async (result) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;
    
//     const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
//     setTasks(updated);
    
//     try {
//         await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
//     } catch (err) {
//         console.error("Drag update failed", err);
//         fetchTasks(); 
//     }
//   };

//   const filteredTasks = tasks.filter(task => {
//     const query = searchQuery.toLowerCase();
//     return (task.title || "").toLowerCase().includes(query) || (task.taskId || "").toLowerCase().includes(query);
//   });

//   const columns = ['To Do', 'In Progress', 'Blocked', 'Done'];

//   return (
//     <div className="h-full flex flex-col p-8 overflow-x-auto">
//       <header className="flex justify-between items-center mb-6">
//         <div>
//            <h1 className="text-2xl font-bold text-slate-900">
//                {filter === 'my-tasks' ? 'My Tasks' : activeTeam ? activeTeam.name : 'All Tasks'}
//            </h1>
//            <p className="text-slate-500 text-sm">
//                {activeTeam ? (activeTeam.isPrivate ? 'Private Team Board' : 'Public Team Board') : 'Overview of all accessible tasks'}
//            </p>
//         </div>

//         <div className="flex-1 max-w-md mx-6">
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input 
//                     type="text" 
//                     placeholder="Search by Title or Ticket ID..." 
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </div>
//         </div>

//         <div className="flex gap-3">
//             <button onClick={() => setIsTeamModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm">
//               <Users size={18} /> New Team
//             </button>
//             <button onClick={() => { setParentTaskForSubtask(null); setIsCreateModalOpen(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
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
//                    <div className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : status === 'Blocked' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
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

//       {/* CREATE MODAL */}
//       {isCreateModalOpen && (
//         <CreateTaskModal 
//             onClose={() => setIsCreateModalOpen(false)} 
//             onSuccess={fetchTasks} 
//             currentUser={currentUser} 
//             users={users} 
//             teams={teams} 
//             activeTeam={activeTeam}
//             parentTask={parentTaskForSubtask}
//         />
//       )}

//       {isTeamModalOpen && <CreateTeamModal onClose={() => setIsTeamModalOpen(false)} onSuccess={() => { refreshData(); alert("Team Created!"); }} users={users} />}
      
//       {/* DETAIL MODAL */}
//       {selectedTask && (
//         <TaskDetailModal 
//             task={selectedTask} 
//             users={users} 
//             teams={teams} 
//             onClose={() => setSelectedTask(null)} 
//             onUpdate={fetchTasks}
//             onCreateSubtask={() => {
//                 setParentTaskForSubtask(selectedTask);
//                 setIsCreateModalOpen(true);
//             }}
//             // FIX 3: Fetch full subtask details to prevent crash ("Removes up" bug)
//             onSelectSubtask={async (sub) => {
//                 try {
//                     const subId = sub._id || sub;
//                     const { data } = await axios.get(`${API_URL}/tasks/${subId}`);
//                     setSelectedTask(data);
//                 } catch (e) {
//                     console.error("Failed to fetch subtask", e);
//                 }
//             }}
//         />
//       )}
//     </div>
//   );
// }

// // --- COMPONENT: TASK CARD ---
// function TaskCard({ task, index, onClick }) {
//     const getPriorityColor = (p) => {
//         if (p === 'Critical') return 'bg-red-100 text-red-600 border-red-200';
//         if (p === 'High') return 'bg-orange-100 text-orange-600 border-orange-200';
//         if (p === 'Medium') return 'bg-blue-100 text-blue-600 border-blue-200';
//         return 'bg-slate-100 text-slate-500 border-slate-200';
//     };

//     return (
//         <Draggable draggableId={task._id} index={index}>
//             {(provided, snapshot) => (
//                 <div
//                     ref={provided.innerRef}
//                     {...provided.draggableProps}
//                     {...provided.dragHandleProps}
//                     onClick={onClick}
//                     className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 group hover:shadow-md hover:border-slate-300 transition cursor-pointer relative overflow-hidden ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-yellow-400 z-50' : ''}`}
//                     style={provided.draggableProps.style}
//                 >
//                     <div className="flex justify-between items-start mb-2">
//                         <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-wider">{task.taskId}</span>
//                         {task.subtasks && task.subtasks.length > 0 && (
//                             <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
//                                 <LayoutGrid size={10} /> {task.subtasks.length}
//                             </span>
//                         )}
//                     </div>
//                     <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
                    
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                              <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
//                                 {task.priority}
//                              </div>
//                              {task.attachments && task.attachments.length > 0 && (
//                                 <Paperclip size={12} className="text-slate-400" />
//                              )}
//                         </div>
//                         {task.assignee ? (
//                             <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-slate-900 border border-white shadow-sm" title={task.assignee.username}>
//                                 {task.assignee.username.charAt(0).toUpperCase()}
//                             </div>
//                         ) : (
//                             <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
//                                 <UserIcon size={12} />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </Draggable>
//     );
// }

// // --- CREATE TASK MODAL ---
// function CreateTaskModal({ onClose, onSuccess, currentUser, users, teams, activeTeam, parentTask }) {
//   const [loading, setLoading] = useState(false);
  
//   const getInitialTeamId = () => {
//       if (parentTask) {
//           return typeof parentTask.team === 'object' ? parentTask.team?._id : parentTask.team; 
//       }
//       if (activeTeam && activeTeam._id) {
//           return activeTeam._id;
//       }
//       return teams.length > 0 ? teams[0]._id : '';
//   };

//   const getInitialPod = () => {
//       if (parentTask) return parentTask.pod;
//       return 'Development'; 
//   };

//   const [formData, setFormData] = useState({
//     title: '', description: '', 
//     status: 'To Do',
//     priority: 'Medium', 
//     teamId: getInitialTeamId(),
//     pod: getInitialPod(),
//     assigneeId: currentUser?._id || '', 
//     reporterId: currentUser?._id || '', 
//     startDate: new Date().toISOString().split('T')[0], 
//     deadline: new Date().toISOString().split('T')[0], 
//     files: [],
//     taskId: generateTaskId(),
//     parentTaskId: parentTask ? parentTask._id : null
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
    
//     const missingFields = [];
//     if (!formData.title) missingFields.push("Title");
//     if (!formData.description) missingFields.push("Description");
//     if (!formData.teamId) missingFields.push("Team");
//     if (!formData.reporterId) missingFields.push("Reporter");
//     if (!formData.startDate) missingFields.push("Start Date");
//     if (!formData.deadline) missingFields.push("Due Date");

//     if (missingFields.length > 0) {
//         alert(`Please fill mandatory fields:\n- ${missingFields.join('\n- ')}`);
//         return;
//     }

//     setLoading(true);
//     const data = new FormData();
//     Object.keys(formData).forEach(key => {
//         if(key === 'files') { 
//             for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); 
//         } else { 
//             data.append(key, formData[key]); 
//         }
//     });
    
//     try { 
//         await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
//         onSuccess(); 
//         onClose(); 
//     } 
//     catch(err) { 
//         console.error(err);
//         alert("Failed to create task."); 
//     } finally { setLoading(false); }
//   };

//   const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[80vh] flex flex-col">
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
//             <h2 className="text-lg font-bold text-slate-800">
//                 {parentTask ? `New Subtask for ${parentTask.taskId}` : 'New Task'} 
//                 <span className="text-slate-400 font-normal ml-2">{formData.taskId}</span>
//             </h2>
//             <div className="flex gap-4 items-center">
//                 <button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2">
//                     {loading && <Loader2 className="animate-spin" size={14} />} Create
//                 </button>
//                 <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
//             </div>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
//                  <input className="w-full text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-6 bg-transparent" placeholder="Issue Title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus required />

//                  <div className="mb-6">
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><FileText size={14} /> Description <span className="text-red-500">*</span></label>
//                     <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-40 outline-none" placeholder="Add details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
//                  </div>

//                  <div>
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><Paperclip size={14} /> Attachments</label>
//                     <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 relative">
//                         <span className="text-sm">Click to upload new files</span>
//                         <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} />
//                     </div>
//                     {formData.files.length > 0 && <div className="mt-2 text-green-600 font-bold text-xs">{formData.files.length} files selected</div>}
//                  </div>
//             </div>

//             <div className="w-80 bg-slate-50 p-6 overflow-y-auto custom-scrollbar space-y-6">
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status <span className="text-red-500">*</span></label>
//                     <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
//                         <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
//                     </select>
//                 </div>
                
//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team <span className="text-red-500">*</span></label>
//                     <select 
//                         className="w-full bg-white border border-slate-200 rounded p-2 text-sm" 
//                         value={formData.teamId} 
//                         onChange={e => setFormData({...formData, teamId: e.target.value})} 
//                         disabled={!!parentTask}
//                     >
//                         <option value="">Select Team</option>
//                         {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//                     </select>
//                     {!formData.teamId && <p className="text-[10px] text-red-500 mt-1">Please create/select a team first.</p>}
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod <span className="text-red-500">*</span></label>
//                     <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.pod} onChange={e => setFormData({...formData, pod: e.target.value})} disabled={!!parentTask}>
//                         {PODS.map(p => <option key={p} value={p}>{p}</option>)}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
//                     <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}>
//                         <option value="">Unassigned</option>
//                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter <span className="text-red-500">*</span></label>
//                     <select className="w-full bg-white border border-slate-200 rounded p-2 text-sm" value={formData.reporterId} onChange={e => setFormData({...formData, reporterId: e.target.value})}>
//                          {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                     </select>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-lg p-2 space-y-2">
//                     <label className="block text-xs font-bold text-slate-500 uppercase">Timeline <span className="text-red-500">*</span></label>
//                     <input type="date" className="w-full text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
//                     <input type="date" className="w-full text-sm" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
//                 </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- TASK DETAIL MODAL ---
// function TaskDetailModal({ task, onClose, onUpdate, users, teams, onCreateSubtask, onSelectSubtask }) {
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [editForm, setEditForm] = useState({
//      ...task,
//      assigneeId: task.assignee?._id || task.assignee || "",
//      reporterId: task.reporter?._id || task.reporter || "",
//      teamId: task.team?._id || task.team || "",
//      startDate: task.startDate ? task.startDate.split('T')[0] : "",
//      deadline: task.deadline ? task.deadline.split('T')[0] : "",
//   });

//   const handleSave = async () => {
//     if (!editForm.teamId || !editForm.reporterId) {
//         alert("Team and Reporter are required.");
//         return;
//     }
//     setLoading(true);
//     try {
//         // FIX 2: Exclude 'subtasks' from the payload to avoid overwriting/removing new subtasks on the server
//         const { subtasks, _id, createdAt, updatedAt, ...payload } = editForm;
        
//         await axios.put(`${API_URL}/tasks/${task._id}`, payload);
//         onUpdate();
//         onClose();
//     } catch (err) { alert("Failed to update task"); }
//     finally { setLoading(false); }
//   };

//   const handleCopyId = () => {
//       navigator.clipboard.writeText(task.taskId);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//   };

//   // FIX 1: Removed logic that replaced Cloudinary URLs. Now uses the raw URL from the DB.
//   const getCorrectUrl = (fileUrl) => {
//     if (!fileUrl) return '';
//     return fileUrl;
//   };

//   const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[100]">
//       <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 h-[85vh] flex flex-col">
//         {/* HEADER */}
//         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
//             <div className="flex items-center gap-3">
//                 <button onClick={handleCopyId} className="flex items-center gap-2 bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-200 uppercase tracking-wider hover:bg-slate-200 transition" title="Click to Copy ID">
//                     {task.taskId}
//                     {copied ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
//                 </button>
//                 {task.parentTask && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Subtask</span>}
//                 <input className="font-bold text-lg text-slate-800 placeholder:text-slate-300 outline-none bg-transparent w-96 hover:bg-slate-50 rounded px-1 transition" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
//             </div>
//             <div className="flex gap-4 items-center">
//                 <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-5 py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2">
//                     {loading && <Loader2 className="animate-spin" size={14} />} Save
//                 </button>
//                 <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
//             </div>
//         </div>

//         {/* BODY */}
//         <div className="flex flex-1 overflow-hidden">
//             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100">
//                  <div className="mb-6">
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><FileText size={14} /> Description</label>
//                     <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 h-40 outline-none focus:ring-2 focus:ring-yellow-400/50 text-slate-700 resize-none text-sm leading-relaxed" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
//                  </div>

//                  <div className="mb-8">
//                       <div className="flex justify-between items-center mb-3">
//                         <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase"><CheckCircle2 size={14} /> Child Tasks</label>
//                         <button onClick={onCreateSubtask} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Plus size={12}/> Add Child Task</button>
//                       </div>
//                       <div className="space-y-2">
//                           {task.subtasks && task.subtasks.length > 0 ? task.subtasks.map((sub, idx) => (
//                              <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition group cursor-pointer" onClick={() => onSelectSubtask && onSelectSubtask(sub)}>
//                                  <div className="flex items-center gap-3">
//                                      <span className="text-xs font-bold text-slate-400">{sub.taskId}</span>
//                                      <span className="text-sm font-medium text-slate-700">{sub.title}</span>
//                                  </div>
//                                  <div className="flex items-center gap-3">
//                                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${sub.status === 'Blocked' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-600 border-slate-200'}`}>{sub.status}</span>
//                                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold">{sub.assignee?.username?.[0] || 'U'}</div>
//                                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500"/>
//                                  </div>
//                              </div>
//                           )) : <div className="text-sm text-slate-400 italic p-4 border border-dashed rounded text-center">No child tasks.</div>}
//                       </div>
//                  </div>

//                  <div>
//                     <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><Paperclip size={14} /> Attachments</label>
//                     {task.attachments?.length > 0 ? (
//                         <div className="grid grid-cols-2 gap-4">
//                             {task.attachments.map((file, idx) => {
//                                 let safeUrl = getCorrectUrl(file.url);
//                                 if (safeUrl && safeUrl.startsWith('http://')) safeUrl = safeUrl.replace('http://', 'https://');
//                                 return (
//                                     <a key={idx} href={safeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition group bg-white">
//                                         <div className="bg-red-50 p-2.5 rounded-lg text-red-500"><FileText size={20}/></div>
//                                         <div className="overflow-hidden"><div className="text-sm font-bold text-slate-700 truncate">{file.name}</div></div>
//                                         <ExternalLink size={14} className="ml-auto text-slate-300 group-hover:text-slate-600"/>
//                                     </a>
//                                 );
//                             })}
//                         </div>
//                     ) : <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-lg text-center">No attachments found.</div>}
//                  </div>
//             </div>

//             {/* RIGHT SIDEBAR */}
//             <div className="w-80 bg-slate-50/80 p-6 overflow-y-auto custom-scrollbar space-y-6 border-l border-slate-100">
//                 <div className="grid grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
//                         <select className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
//                             <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
//                         <select className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
//                             <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
//                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Timeline</label>
//                       <div className="mb-2">
//                         <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Start Date</label>
//                         <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} required />
//                       </div>
//                       <div className="pt-2 border-t border-slate-100">
//                         <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Due Date</label>
//                         <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} required />
//                       </div>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team</label>
//                     <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.teamId} onChange={e => setEditForm({...editForm, teamId: e.target.value})}>
//                         <option value="">Select Team</option>
//                         {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod</label>
//                     <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.pod} onChange={e => setEditForm({...editForm, pod: e.target.value})}>
//                         {PODS.map(p => <option key={p} value={p}>{p}</option>)}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
//                     <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.assigneeId} onChange={e => setEditForm({...editForm, assigneeId: e.target.value})}>
//                         <option value="">Unassigned</option>
//                         {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter</label>
//                     <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.reporterId} onChange={e => setEditForm({...editForm, reporterId: e.target.value})}>
//                          {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//                     </select>
//                 </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CreateTeamModal({ onClose, onSuccess, users }) {
//   const [name, setName] = useState('');
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const toggleMember = (id) => setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   const handleSubmit = async (e) => {
//     e.preventDefault(); setLoading(true);
//     try { await axios.post(`${API_URL}/teams`, { name, isPrivate, members: selectedMembers }); onSuccess(); onClose(); } catch(err) { alert("Failed."); } finally { setLoading(false); }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in duration-200">
//          <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-900">Create New Team</h2><button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button></div>
//          <form onSubmit={handleSubmit} className="space-y-4">
//             <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team Name</label><input className="w-full border border-slate-200 rounded-lg p-3 outline-none" placeholder="e.g. Secret Project X" value={name} onChange={e => setName(e.target.value)} required /></div>
//             <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-yellow-400" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} /><div><span className="block text-sm font-bold text-slate-800 flex items-center gap-2"><Lock size={14} /> Private Team?</span><span className="block text-xs text-slate-500">Only selected members see this.</span></div></label>
//             {isPrivate && (
//                 <div className="mt-4">
//                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Members</label>
//                     <div className="h-64 overflow-y-auto border border-slate-200 rounded-lg p-2 custom-scrollbar bg-slate-50">
//                         {users.map(u => (
//                             <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded cursor-pointer transition">
//                                 <input type="checkbox" checked={selectedMembers.includes(u._id)} onChange={() => toggleMember(u._id)} className="accent-slate-900 w-4 h-4"/>
//                                 <span className="text-sm font-medium text-slate-700">{u.username}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             )}
//             <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancel</button><button type="submit" disabled={loading} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800">{loading && <Loader2 className="animate-spin" size={16}/>} Create Team</button></div>
//          </form>
//       </div>
      
//     </div>
//   );
// }

// function TeamView({ users }) {
//     return (
//         <div className="p-8 h-full overflow-y-auto">
//             <h1 className="text-2xl font-bold text-slate-900 mb-6">Team Members</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {users.map(u => <div key={u._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition"><div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-slate-900">{u.username[0].toUpperCase()}</div><div className="overflow-hidden"><h3 className="font-bold text-slate-800 truncate">{u.username}</h3><p className="text-sm text-slate-500 truncate">{u.email}</p><span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span></div></div>)}
//             </div>
//         </div>
//     );
// }

// function Sidebar({ user, setToken, activeView, setActiveView, activeTeam, setActiveTeam, teams }) {
//   return (
//     <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
//        <div className="p-3 flex items-center gap-1 border-b border-slate-100">
    
//     <img 
//         src="/logo.png"   
//         alt="BeeBark Logo" 
//         className="w-12 h-10 object-contain"
//     />
    
//     <span className="text-2xl font-black tracking-tighter text-slate-900">BeeBark</span>
// </div>
//       <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
//         <div className="mb-4">
//             <button onClick={() => { setActiveView('board'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'board' && !activeTeam ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
//                 <LayoutGrid size={18}/> All Tasks
//             </button>
//             <button onClick={() => { setActiveView('my-tasks'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'my-tasks' ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
//                 <CheckCircle2 size={18}/> My Tasks
//             </button>
//             <button onClick={() => { setActiveView('team-list'); setActiveTeam(null); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'team-list' ? 'bg-yellow-50 text-slate-900 shadow-sm ring-1 ring-yellow-400' : 'text-slate-500 hover:bg-slate-50'}`}>
//                 <Users size={18}/> Team Members
//             </button>
//         </div>
//         <div className="mt-6">
//             <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Teams</div>
//             {teams.map(team => (
//                 <button key={team._id} onClick={() => { setActiveView('board'); setActiveTeam(team); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1 ${activeTeam?._id === team._id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
//                     {team.isPrivate ? <Lock size={14} className="text-red-400"/> : <Users size={14} className="text-blue-400"/>}
//                     <span className="truncate">{team.name}</span>
//                 </button>
//             ))}
//         </div>
//       </nav>
//       <div className="p-4 border-t border-slate-100 bg-slate-50"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-sm">{user?.username?.[0]?.toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-900">{user?.username}</div><div className="text-xs text-slate-500 truncate">{user?.email}</div></div></div><button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs font-bold w-full transition-colors p-2 rounded hover:bg-red-50"><LogOut size={14} /> Sign Out</button></div>
//     </aside>
//   );
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
//         <div className="text-center mb-8"><h1 className="text-4xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Agile project management.</p></div>
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







//================================================================================================================================//
// BEEBARK JIRA CLONE - FULLY RESPONSIVE & FIXED
//================================================================================================================================//

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Trash2, Plus, LogOut, User as UserIcon, Loader2, 
  Calendar, Paperclip, LayoutGrid, Users, CheckCircle2, 
  Lock, X, Download, FileText, Clock, Edit2, Save, ExternalLink,
  Search, AlertCircle, ChevronDown, CheckSquare, Square, ArrowRight, Copy, Check, Hexagon, Menu
} from 'lucide-react';

// --- CONFIGURATION ---
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
      if (window.location.pathname !== '/') window.location.replace("/");
    }
    return Promise.reject(error);
  }
);

const generateTaskId = () => `BB-${Math.floor(1000 + Math.random() * 9000)}`;

// --- MAIN APP COMPONENT ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // SAFE PARSING: Prevents crash if 'user' in localStorage is undefined/corrupted
  const [user, setUser] = useState(() => {
      try {
          return JSON.parse(localStorage.getItem('user'));
      } catch (e) {
          return null;
      }
  });
  
  const [activeView, setActiveView] = useState('board'); 
  const [activeTeam, setActiveTeam] = useState(null); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  // GLOBAL DATA STATE
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  // FIX: Use useCallback to prevent infinite fetch loops
  const fetchGlobalData = useCallback(() => {
      if(!token) return;
      
      axios.get(`${API_URL}/users`)
        .then(res => setUsers(res.data || []))
        .catch(err => console.error("User fetch error:", err));
      
      axios.get(`${API_URL}/teams`)
        .then(res => setTeams(res.data || []))
        .catch(err => console.error("Team fetch error:", err));
  }, [token]);

  // FIX: Split useEffect to ensure Token is saved BEFORE fetching
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if(user) localStorage.setItem('user', JSON.stringify(user));
      
      // Small delay to ensure localStorage is ready for the axios interceptor
      const timer = setTimeout(() => fetchGlobalData(), 100);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user, fetchGlobalData]);

  if (!token) return <AuthScreen setToken={setToken} setUser={setUser} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r border-slate-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          user={user} 
          setToken={setToken} 
          activeView={activeView} 
          setActiveView={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }}
          activeTeam={activeTeam}
          setActiveTeam={(team) => { setActiveTeam(team); setIsMobileMenuOpen(false); }}
          teams={teams} 
        />
      </div>

      <main className="flex-1 overflow-hidden relative flex flex-col w-full">
        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
           <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-700">
               <Menu size={24} />
             </button>
             <span className="font-bold text-lg text-slate-900">BeeBark</span>
           </div>
           {user && (
             <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 text-xs">
               {user.username?.[0]?.toUpperCase()}
             </div>
           )}
        </div>

        {activeView === 'board' && (
            <BoardView 
                currentUser={user} 
                activeTeam={activeTeam} 
                filter={activeTeam ? 'team' : 'all'} 
                users={users} 
                teams={teams} 
                refreshData={fetchGlobalData}
            />
        )}
        {activeView === 'my-tasks' && (
            <BoardView 
                currentUser={user} 
                activeTeam={null} 
                filter="my-tasks" 
                users={users} 
                teams={teams} 
                refreshData={fetchGlobalData}
            />
        )}
        {activeView === 'team-list' && <TeamView users={users} />}
      </main>
    </div>
  );
}

// --- VIEW: KANBAN BOARD ---
function BoardView({ currentUser, activeTeam, filter, users, teams, refreshData }) {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // MODAL STATES
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [parentTaskForSubtask, setParentTaskForSubtask] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    let endpoint = `${API_URL}/tasks`;
    if (filter === 'my-tasks') {
        endpoint += `?filter=my-tasks`;
    } else if (activeTeam) {
        endpoint += `?teamId=${activeTeam._id}`;
    }
    
    try {
        const { data } = await axios.get(endpoint);
        const topLevelTasks = (data || []).filter(t => !t.parentTask);
        setTasks(topLevelTasks);
        
        if(selectedTask) {
             const updatedOpenTask = data.find(t => t._id === selectedTask._id);
             if (updatedOpenTask) setSelectedTask(updatedOpenTask);
        }
    } catch (e) { console.error("Fetch error", e); }
  };

  useEffect(() => { fetchTasks(); }, [filter, activeTeam]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    
    const updated = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTasks(updated);
    
    try {
        await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
    } catch (err) {
        console.error("Drag update failed", err);
        fetchTasks(); 
    }
  };

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (task.title || "").toLowerCase().includes(query) || (task.taskId || "").toLowerCase().includes(query);
  });

  const columns = ['To Do', 'In Progress', 'Blocked', 'Done'];

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6 shrink-0">
        <div>
           <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
               {filter === 'my-tasks' ? 'My Tasks' : activeTeam ? activeTeam.name : 'All Tasks'}
           </h1>
           <p className="text-slate-500 text-xs md:text-sm hidden md:block">
               {activeTeam ? (activeTeam.isPrivate ? 'Private Team Board' : 'Public Team Board') : 'Overview of all accessible tasks'}
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2">
                <button onClick={() => setIsTeamModalOpen(true)} className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg font-bold hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap">
                   <Users size={16} /> <span className="hidden md:inline">New Team</span>
                </button>
                <button onClick={() => { setParentTaskForSubtask(null); setIsCreateModalOpen(true); }} className="flex-1 md:flex-none bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg text-sm whitespace-nowrap">
                   <Plus size={16} /> Create Task
                </button>
            </div>
        </div>
      </header>

      {/* KANBAN BOARD AREA */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden md:pb-2 custom-scrollbar">
          <div className="flex h-full gap-4 md:gap-6 min-w-full px-1 pb-2">
            {columns.map(status => (
              <div key={status} className="w-[85vw] md:w-80 flex-shrink-0 flex flex-col h-full snap-center md:snap-none">
                <div className="flex justify-between items-center mb-3 px-1 shrink-0">
                  <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : status === 'Blocked' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                     {status}
                  </h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200 text-slate-500">{filteredTasks.filter(t => t.status === status).length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 rounded-xl p-2 md:p-3 overflow-y-auto custom-scrollbar transition-colors border-2 ${snapshot.isDraggingOver ? 'bg-yellow-50/50 border-yellow-400/50' : 'bg-slate-100/50 border-transparent'}`}>
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
        </div>
      </DragDropContext>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <CreateTaskModal 
            onClose={() => setIsCreateModalOpen(false)} 
            onSuccess={fetchTasks} 
            currentUser={currentUser} 
            users={users} 
            teams={teams} 
            activeTeam={activeTeam}
            parentTask={parentTaskForSubtask}
        />
      )}

      {isTeamModalOpen && <CreateTeamModal onClose={() => setIsTeamModalOpen(false)} onSuccess={() => { refreshData(); alert("Team Created!"); }} users={users} />}
      
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
            onSelectSubtask={async (sub) => {
                try {
                    const subId = sub._id || sub;
                    const { data } = await axios.get(`${API_URL}/tasks/${subId}`);
                    setSelectedTask(data);
                } catch (e) {
                    console.error("Failed to fetch subtask", e);
                }
            }}
        />
      )}
    </div>
  );
}

// --- COMPONENT: TASK CARD ---
function TaskCard({ task, index, onClick }) {
    const getPriorityColor = (p) => {
        if (p === 'Critical') return 'bg-red-100 text-red-600 border-red-200';
        if (p === 'High') return 'bg-orange-100 text-orange-600 border-orange-200';
        if (p === 'Medium') return 'bg-blue-100 text-blue-600 border-blue-200';
        return 'bg-slate-100 text-slate-500 border-slate-200';
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    className={`bg-white p-3 md:p-4 rounded-lg shadow-sm border border-slate-200 mb-2 md:mb-3 group hover:shadow-md hover:border-slate-300 transition cursor-pointer relative overflow-hidden ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-yellow-400 z-50' : ''}`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition uppercase tracking-wider">{task.taskId}</span>
                        {task.subtasks && task.subtasks.length > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                <LayoutGrid size={10} /> {task.subtasks.length}
                            </span>
                        )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug line-clamp-2">{task.title}</h4>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                             </div>
                             {task.attachments && task.attachments.length > 0 && (
                                <Paperclip size={12} className="text-slate-400" />
                             )}
                        </div>
                        {task.assignee ? (
                            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-slate-900 border border-white shadow-sm" title={task.assignee.username}>
                                {task.assignee.username.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                                <UserIcon size={12} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}

// --- CREATE TASK MODAL (FIXED MOBILE SCROLLING) ---
function CreateTaskModal({ onClose, onSuccess, currentUser, users, teams, activeTeam, parentTask }) {
  const [loading, setLoading] = useState(false);
  
  const getInitialTeamId = () => {
      if (parentTask) {
          return typeof parentTask.team === 'object' ? parentTask.team?._id : parentTask.team; 
      }
      if (activeTeam && activeTeam._id) {
          return activeTeam._id;
      }
      return teams.length > 0 ? teams[0]._id : '';
  };

  const getInitialPod = () => {
      if (parentTask) return parentTask.pod;
      return 'Development'; 
  };

  const [formData, setFormData] = useState({
    title: '', description: '', 
    status: 'To Do',
    priority: 'Medium', 
    teamId: getInitialTeamId(),
    pod: getInitialPod(),
    assigneeId: currentUser?._id || '', 
    reporterId: currentUser?._id || '', 
    startDate: new Date().toISOString().split('T')[0], 
    deadline: new Date().toISOString().split('T')[0], 
    files: [],
    taskId: generateTaskId(),
    parentTaskId: parentTask ? parentTask._id : null
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    const missingFields = [];
    if (!formData.title) missingFields.push("Title");
    if (!formData.description) missingFields.push("Description");
    if (!formData.teamId) missingFields.push("Team");
    if (!formData.reporterId) missingFields.push("Reporter");
    if (!formData.startDate) missingFields.push("Start Date");
    if (!formData.deadline) missingFields.push("Due Date");

    if (missingFields.length > 0) {
        alert(`Please fill mandatory fields:\n- ${missingFields.join('\n- ')}`);
        return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if(key === 'files') { 
            for(let i=0; i<formData.files.length; i++) data.append('files', formData.files[i]); 
        } else { 
            data.append(key, formData[key]); 
        }
    });
    
    try { 
        await axios.post(`${API_URL}/tasks`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
        onSuccess(); 
        onClose(); 
    } 
    catch(err) { 
        console.error(err);
        alert("Failed to create task."); 
    } finally { setLoading(false); }
  };

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center md:p-4">
      <div className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl md:rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
        {/* HEADER */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div>
                <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                    {parentTask ? 'New Subtask' : 'New Task'} 
                    <span className="text-slate-400 font-normal text-xs md:text-sm bg-slate-100 px-2 py-0.5 rounded">{formData.taskId}</span>
                </h2>
            </div>
            <div className="flex gap-3 items-center">
                <button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin" size={14} />} <span className="hidden md:inline">Create Task</span><span className="md:hidden">Save</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500"><X size={20} /></button>
            </div>
        </div>

        {/* BODY - Single Scroll on Mobile */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row custom-scrollbar">
            {/* MAIN CONTENT */}
            <div className="w-full md:flex-1 md:h-full md:overflow-y-auto p-4 md:p-8 order-1 md:order-1 border-b md:border-b-0 md:border-r border-slate-100 custom-scrollbar">
                 <input className="w-full text-2xl md:text-4xl font-bold text-slate-800 placeholder:text-slate-300 outline-none mb-4 md:mb-6 bg-transparent" placeholder="Task Title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} autoFocus required />

                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><FileText size={14} /> Description <span className="text-red-500">*</span></label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 md:p-4 h-32 md:h-40 outline-none text-sm" placeholder="Add details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                 </div>

                 <div className="mb-6 md:mb-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><Paperclip size={14} /> Attachments</label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 relative bg-slate-50 hover:bg-white transition">
                        <span className="text-sm">Tap to upload files</span>
                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, files: e.target.files})} />
                    </div>
                    {formData.files.length > 0 && <div className="mt-2 text-green-600 font-bold text-xs">{formData.files.length} files selected</div>}
                 </div>
            </div>

            {/* SIDEBAR INPUTS */}
            <div className="w-full md:w-80 md:h-full md:overflow-y-auto bg-slate-50 p-4 md:p-6 order-2 md:order-2 custom-scrollbar pb-10 md:pb-6">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status <span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                         <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team <span className="text-red-500">*</span></label>
                        <select 
                            className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" 
                            value={formData.teamId} 
                            onChange={e => setFormData({...formData, teamId: e.target.value})} 
                            disabled={!!parentTask}
                        >
                            <option value="">Select Team</option>
                            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod <span className="text-red-500">*</span></label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" value={formData.pod} onChange={e => setFormData({...formData, pod: e.target.value})} disabled={!!parentTask}>
                            {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
                            <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}>
                                <option value="">Unassigned</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter</label>
                            <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm" value={formData.reporterId} onChange={e => setFormData({...formData, reporterId: e.target.value})}>
                                 {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2 mt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Timeline</label>
                    <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
                        <input type="date" className="w-full text-sm border md:border-none rounded p-1" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                        <input type="date" className="w-full text-sm border md:border-none rounded p-1" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- TASK DETAIL MODAL (FIXED MOBILE SCROLLING) ---
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
    if (!editForm.teamId || !editForm.reporterId) {
        alert("Team and Reporter are required.");
        return;
    }
    setLoading(true);
    try {
        const { subtasks, _id, createdAt, updatedAt, ...payload } = editForm;
        await axios.put(`${API_URL}/tasks/${task._id}`, payload);
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

  const getCorrectUrl = (fileUrl) => {
    if (!fileUrl) return '';
    return fileUrl;
  };

  const PODS = ["Development", "Design Pod", "Marketing Pod", "Social Media & Community", "Sales / Partnerships", "Operations & Support"];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center md:p-4">
      <div className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl md:rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
        {/* HEADER - Fixed at top */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex justify-between items-start md:items-center bg-white shrink-0 gap-3">
            <div className="flex flex-col gap-1 md:gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <button onClick={handleCopyId} className="flex items-center gap-2 bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold border border-slate-200 uppercase tracking-wider hover:bg-slate-200 transition shrink-0" title="Click to Copy ID">
                        {task.taskId}
                        {copied ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
                    </button>
                    {task.parentTask && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded shrink-0">Subtask</span>}
                </div>
                {/* Title wraps on mobile, no truncate */}
                <input 
                    className="font-bold text-lg text-slate-800 placeholder:text-slate-300 outline-none bg-transparent w-full hover:bg-slate-50 rounded px-1 transition break-words whitespace-normal" 
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})} 
                />
            </div>
            <div className="flex gap-2 items-center shrink-0 pt-1 md:pt-0">
                <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-3 py-2 md:px-5 md:py-2 rounded hover:bg-slate-800 transition text-sm font-bold flex items-center gap-2">
                    {loading && <Loader2 className="animate-spin" size={14} />} <span className="hidden md:inline">Save</span><span className="md:hidden">Save</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition"><X size={24} /></button>
            </div>
        </div>

        {/* BODY - Single scroll on mobile, Split scroll on Desktop */}
        <div className="flex-1 overflow-y-auto md:overflow-hidden flex flex-col md:flex-row custom-scrollbar">
            
            {/* LEFT PANE (Main Content) */}
            <div className="w-full md:flex-1 md:h-full md:overflow-y-auto p-4 md:p-8 order-1 custom-scrollbar">
                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><FileText size={14} /> Description</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 md:p-4 h-32 md:h-40 outline-none focus:ring-2 focus:ring-yellow-400/50 text-slate-700 resize-none text-sm leading-relaxed" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                 </div>

                 <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase"><CheckCircle2 size={14} /> Child Tasks</label>
                        <button onClick={onCreateSubtask} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Plus size={12}/> Add Subtask</button>
                      </div>
                      <div className="space-y-2">
                          {task.subtasks && task.subtasks.length > 0 ? task.subtasks.map((sub, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition group cursor-pointer" onClick={() => onSelectSubtask && onSelectSubtask(sub)}>
                                 <div className="flex items-center gap-3 overflow-hidden">
                                     <span className="text-xs font-bold text-slate-400 shrink-0">{sub.taskId}</span>
                                     <span className="text-sm font-medium text-slate-700 truncate">{sub.title}</span>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                     <span className={`hidden md:inline text-[10px] uppercase font-bold px-2 py-1 rounded border ${sub.status === 'Blocked' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-600 border-slate-200'}`}>{sub.status}</span>
                                     <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500"/>
                                 </div>
                             </div>
                          )) : <div className="text-sm text-slate-400 italic p-4 border border-dashed rounded text-center">No child tasks.</div>}
                      </div>
                 </div>

                 <div className="mb-6 md:mb-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3"><Paperclip size={14} /> Attachments</label>
                    {task.attachments?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {task.attachments.map((file, idx) => {
                                let safeUrl = getCorrectUrl(file.url);
                                if (safeUrl && safeUrl.startsWith('http://')) safeUrl = safeUrl.replace('http://', 'https://');
                                return (
                                    <a key={idx} href={safeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition group bg-white">
                                        <div className="bg-red-50 p-2.5 rounded-lg text-red-500 shrink-0"><FileText size={20}/></div>
                                        <div className="overflow-hidden min-w-0"><div className="text-sm font-bold text-slate-700 truncate">{file.name}</div></div>
                                        <ExternalLink size={14} className="ml-auto text-slate-300 group-hover:text-slate-600 shrink-0"/>
                                    </a>
                                );
                            })}
                        </div>
                    ) : <div className="text-sm text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-lg text-center">No attachments found.</div>}
                 </div>
            </div>

            {/* RIGHT PANE (Sidebar Inputs) */}
            <div className="w-full md:w-80 md:h-full md:overflow-y-auto bg-slate-50 p-4 md:p-6 border-t md:border-t-0 md:border-l border-slate-200 order-2 custom-scrollbar pb-10 md:pb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-xs font-bold" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                            <option>To Do</option><option>In Progress</option><option>Blocked</option><option>Done</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                        <select className="w-full bg-white border border-slate-200 rounded p-2.5 text-xs font-bold" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
                            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Timeline</label>
                      <div className="grid grid-cols-2 gap-4 md:block">
                          <div className="mb-2">
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Start Date</label>
                            <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none bg-transparent" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} required />
                          </div>
                          <div className="pt-0 md:pt-2 md:border-t border-slate-100">
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Due Date</label>
                            <input type="date" className="w-full text-sm font-bold text-slate-700 outline-none bg-transparent" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} required />
                          </div>
                      </div>
                </div>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Team</label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.teamId} onChange={e => setEditForm({...editForm, teamId: e.target.value})}>
                            <option value="">Select Team</option>
                            {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod</label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.pod} onChange={e => setEditForm({...editForm, pod: e.target.value})}>
                            {PODS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
                            <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.assigneeId} onChange={e => setEditForm({...editForm, assigneeId: e.target.value})}>
                                <option value="">Unassigned</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reporter</label>
                            <select className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium" value={editForm.reporterId} onChange={e => setEditForm({...editForm, reporterId: e.target.value})}>
                                 {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function CreateTeamModal({ onClose, onSuccess, users }) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

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

function TeamView({ users }) {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Team Members</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {users.map(u => <div key={u._id} className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition"><div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-slate-900 shrink-0">{u.username[0].toUpperCase()}</div><div className="overflow-hidden"><h3 className="font-bold text-slate-800 truncate">{u.username}</h3><p className="text-sm text-slate-500 truncate">{u.email}</p><span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span></div></div>)}
            </div>
        </div>
    );
}

function Sidebar({ user, setToken, activeView, setActiveView, activeTeam, setActiveTeam, teams }) {
  return (
    <aside className="h-full flex flex-col">
       <div className="p-3 flex items-center gap-1 border-b border-slate-100">
           <img 
               src="/logo.png"   
               alt="BeeBark Logo" 
               className="w-12 h-10 object-contain"
           />
           <span className="text-2xl font-black tracking-tighter text-slate-900">BeeBark</span>
       </div>
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
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
      <div className="p-4 border-t border-slate-100 bg-slate-50"><div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-sm shrink-0">{user?.username?.[0]?.toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-bold truncate text-slate-900">{user?.username}</div><div className="text-xs text-slate-500 truncate">{user?.email}</div></div></div><button onClick={() => setToken(null)} className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs font-bold w-full transition-colors p-2 rounded hover:bg-red-50"><LogOut size={14} /> Sign Out</button></div>
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
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md p-6 md:p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8"><h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">BeeBark</h1><p className="text-slate-500">Agile project management.</p></div>
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