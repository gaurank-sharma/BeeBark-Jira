// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
// import { Trash2, Plus, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
// import logo from './assets/logo.png'; // Ensure you have a logo or this will use the fallback 'B'

// const API_URL = 'https://bee-bark-jira-backend.vercel.app/api';

// // --- AXIOS CONFIGURATION ---
// // Automatically attach token to every request if it exists
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

//   // Sync state with LocalStorage on logout/login changes
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }
//   }, [token, user]);

//   if (!token) {
//     return <AuthScreen setToken={setToken} setUser={setUser} />;
//   }

//   return (
//     <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
//         <div className="p-6 flex items-center gap-3">
//           {/* Logo Fallback included if image fails */}
//           {logo ? (
//             <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
//           ) : (
//              <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center font-bold">B</div>
//           )}
//           <span className="text-xl font-bold tracking-tight text-brand-black">Beebark Jira</span>
//         </div>
        
//         <nav className="flex-1 px-4 space-y-2 mt-4">
//           <NavItem active>Kanban Board</NavItem>
//           <NavItem>My Tasks</NavItem>
//           <NavItem>Team Members</NavItem>
//         </nav>

//         <div className="p-4 border-t border-slate-100">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center font-bold text-brand-black shadow-sm">
//               {user?.username?.[0]?.toUpperCase() || 'U'}
//             </div>
//             <div className="text-sm font-medium truncate">{user?.username}</div>
//           </div>
//           <button 
//             onClick={() => setToken(null)}
//             className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm w-full transition-colors p-2 rounded-md hover:bg-red-50"
//           >
//             <LogOut size={16} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Board Area */}
//       <BoardArea />
//     </div>
//   );
// }

// // --- SUB-COMPONENTS ---

// function AuthScreen({ setToken, setUser }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     const endpoint = isLogin ? '/login' : '/register';
    
//     try {
//       const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
//       if (isLogin) {
//         setToken(data.token);
//         setUser(data.user);
//       } else {
//         setIsLogin(true);
//         setError("Account created! You can now log in."); // Using error state for success msg
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Connection failed. Is the backend running?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-slate-50">
//       <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-brand-yellow rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
//              <span className="text-3xl font-black text-brand-black">B</span>
//           </div>
//           <h2 className="text-3xl font-bold text-brand-black">{isLogin ? 'Welcome Back' : 'Join Beebark Jira'}</h2>
//           <p className="text-slate-500 mt-2">Manage your projects efficiently.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Username</label>
//             <input 
//               type="text" 
//               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
//               value={formData.username} 
//               onChange={e => setFormData({...formData, username: e.target.value})}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Password</label>
//             <input 
//               type="password" 
//               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
//               value={formData.password} 
//               onChange={e => setFormData({...formData, password: e.target.value})}
//               required
//             />
//           </div>
          
//           {error && <div className={`text-sm text-center p-2 rounded ${error.includes('created') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{error}</div>}

//           <button disabled={loading} type="submit" className="w-full bg-brand-black text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex justify-center items-center gap-2">
//             {loading && <Loader2 className="animate-spin" size={18} />}
//             {isLogin ? 'Log In' : 'Create Account'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-slate-500">
//           {isLogin ? "New to Beebark Jira?" : "Already have an account?"} 
//           <button 
//             className="ml-2 text-brand-black font-bold hover:underline"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? 'Sign Up' : 'Log In'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function BoardArea() {
//   const [tasks, setTasks] = useState([]);
//   const [users, setUsers] = useState([]);
  
//   // Filter State
//   const [filterUser, setFilterUser] = useState('');
  
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [assignee, setAssignee] = useState('');

//   // Initial Data Fetch
//   useEffect(() => {
//     const loadData = async () => {
//         try {
//             const [tasksRes, usersRes] = await Promise.all([
//                 axios.get(`${API_URL}/tasks`),
//                 axios.get(`${API_URL}/users`)
//             ]);
//             setTasks(tasksRes.data);
//             setUsers(usersRes.data);
//         } catch (error) {
//             console.error("Failed to load board data", error);
//         }
//     };
//     loadData();
//   }, []);

//   // Filter Logic: If filterUser is set, show only their tasks. Otherwise show all.
//   const filteredTasks = filterUser 
//     ? tasks.filter(task => task.assignee?._id === filterUser) 
//     : tasks;

//   const addTask = async () => {
//     if (!newTaskTitle.trim()) return;
    
//     // Optimistic UI Update
//     const tempId = Date.now().toString();
//     const newTask = { 
//         _id: tempId, 
//         title: newTaskTitle, 
//         status: 'To Do', 
//         assignee: users.find(u => u._id === assignee) || null 
//     };
    
//     setTasks(prev => [...prev, newTask]);
//     setNewTaskTitle('');
//     setAssignee('');

//     try {
//         await axios.post(`${API_URL}/tasks`, { title: newTaskTitle, assignee: assignee || null });
//         const res = await axios.get(`${API_URL}/tasks`); 
//         setTasks(res.data);
//     } catch (err) {
//         setTasks(prev => prev.filter(t => t._id !== tempId));
//         alert("Failed to add task");
//     }
//   };

//   const deleteTask = async (id) => {
//     if(!window.confirm("Are you sure?")) return;
    
//     const originalTasks = [...tasks];
//     setTasks(prev => prev.filter(t => t._id !== id)); 

//     try {
//         await axios.delete(`${API_URL}/tasks/${id}`);
//     } catch (err) {
//         setTasks(originalTasks);
//     }
//   };

//   const onDragEnd = async (result) => {
//     if (!result.destination) return;
//     const { source, destination, draggableId } = result;

//     if (source.droppableId !== destination.droppableId) {
//       // Update local state immediately
//       const updatedTasks = tasks.map(t => 
//         t._id === draggableId ? { ...t, status: destination.droppableId } : t
//       );
//       setTasks(updatedTasks);

//       // Send update to server
//       try {
//         await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
//       } catch (err) {
//         console.error("Failed to move task");
//       }
//     }
//   };

//   const columns = ['To Do', 'In Progress', 'Done'];

//   return (
//     <main className="flex-1 overflow-x-auto p-8 h-full flex flex-col">
//       <header className="flex justify-between items-center mb-8">
//         <div className="flex items-center gap-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-brand-black">Project Board</h1>
//                 <p className="text-slate-500 text-sm">Sprint 24 • Active</p>
//             </div>
            
//             {/* --- FILTER DROPDOWN --- */}
//             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
//                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
//                 <select 
//                     className="text-sm outline-none bg-transparent font-medium text-slate-700 cursor-pointer"
//                     value={filterUser}
//                     onChange={(e) => setFilterUser(e.target.value)}
//                 >
//                     <option value="">All Members</option>
//                     {users.map(u => (
//                         <option key={u._id} value={u._id}>{u.username}</option>
//                     ))}
//                 </select>
//             </div>
//         </div>
        
//         {/* Quick Add Task Bar */}
//         <div className="flex gap-2 bg-white p-1.5 rounded-lg shadow-sm border border-slate-200">
//           <input 
//             type="text" 
//             placeholder="New task..." 
//             className="outline-none px-3 text-sm w-48 bg-transparent"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && addTask()}
//           />
//           <div className="w-px bg-slate-200 my-1"></div>
//           <select 
//             className="text-sm px-2 outline-none text-slate-600 bg-transparent cursor-pointer hover:text-brand-black"
//             value={assignee}
//             onChange={(e) => setAssignee(e.target.value)}
//           >
//             <option value="">Assign To...</option>
//             {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
//           </select>
//           <button 
//             onClick={addTask}
//             className="bg-brand-yellow hover:bg-yellow-400 text-brand-black p-2 rounded-md transition shadow-sm"
//           >
//             <Plus size={18} />
//           </button>
//         </div>
//       </header>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="flex gap-6 h-[calc(100%-80px)] items-start">
//           {columns.map(status => {
//             // Apply the filter to each column
//             const columnTasks = filteredTasks.filter(t => t.status === status);
            
//             return (
//                 <div key={status} className="w-80 flex-shrink-0 flex flex-col max-h-full">
//                 <div className="flex items-center justify-between mb-4 px-1">
//                     <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
//                         <span className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
//                         {status}
//                     </h3>
//                     <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
//                     {columnTasks.length}
//                     </span>
//                 </div>
                
//                 <Droppable droppableId={status}>
//                     {(provided, snapshot) => (
//                     <div 
//                         {...provided.droppableProps} 
//                         ref={provided.innerRef}
//                         className={`rounded-xl p-3 min-h-[150px] transition-colors duration-200 flex-1 overflow-y-auto custom-scrollbar 
//                             ${snapshot.isDraggingOver ? 'bg-brand-yellow/10 border-brand-yellow/30' : 'bg-slate-100/80 border-transparent'} border-2`}
//                     >
//                         {columnTasks.map((task, index) => (
//                         <Draggable key={task._id} draggableId={task._id} index={index}>
//                             {(provided, snapshot) => (
//                             <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 className={`bg-white p-4 rounded-lg border mb-3 group transition-all
//                                     ${snapshot.isDragging ? 'shadow-lg rotate-2 border-brand-yellow' : 'shadow-sm border-slate-200 hover:border-brand-yellow/60 hover:shadow-md'}
//                                 `}
//                             >
//                                 <p className="font-medium text-slate-800 text-sm mb-3 leading-snug">{task.title}</p>
//                                 <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
//                                 {task.assignee ? (
//                                     <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
//                                     <UserIcon size={10} />
//                                     {task.assignee.username}
//                                     </div>
//                                 ) : (
//                                     <span className="text-[10px] text-slate-400 italic">Unassigned</span>
//                                 )}
                                
//                                 <button 
//                                     onClick={() => deleteTask(task._id)}
//                                     className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
//                                 >
//                                     <Trash2 size={14} />
//                                 </button>
//                                 </div>
//                             </div>
//                             )}
//                         </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                     )}
//                 </Droppable>
//                 </div>
//             );
//           })}
//         </div>
//       </DragDropContext>
//     </main>
//   );
// }

// function NavItem({ children, active }) {
//   return (
//     <div className={`p-2.5 rounded-lg text-sm font-medium cursor-pointer transition flex items-center gap-3 ${active ? 'bg-slate-100 text-brand-black' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-black'}`}>
//       <span className={`w-2 h-2 rounded-full transition-all ${active ? 'bg-brand-yellow scale-110' : 'bg-transparent border border-slate-300'}`}></span>
//       {children}
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Trash2, Plus, LogOut, User as UserIcon, Loader2, 
  Paperclip, AlertCircle, CheckCircle2, Users 
} from 'lucide-react';
import logo from './assets/logo.png'; 

const API_URL = 'localhost:5000/api';

// --- AXIOS INTERCEPTOR (Fixes "Already Logged In" Bug) ---
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = "/"; // Force refresh to Auth Screen
    }
    return Promise.reject(error);
  }
);

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

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
      <Sidebar user={user} setToken={setToken} />
      <BoardArea user={user} />
    </div>
  );
}

// --- SIDEBAR ---
function Sidebar({ user, setToken }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
      <div className="p-6 flex items-center gap-3">
        {logo ? (
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
        ) : (
          <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center font-bold">B</div>
        )}
        <span className="text-xl font-bold tracking-tight text-brand-black">BeeBark Jira</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem active>Kanban Board</NavItem>
        <NavItem>My Tasks</NavItem>
        <NavItem>Team Members</NavItem>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center font-bold text-brand-black shadow-sm">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium truncate">{user?.username}</div>
            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button 
          onClick={() => setToken(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm w-full transition-colors p-2 rounded-md hover:bg-red-50"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ children, active }) {
  return (
    <div className={`p-2.5 rounded-lg text-sm font-medium cursor-pointer transition flex items-center gap-3 ${active ? 'bg-slate-100 text-brand-black' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-black'}`}>
      <span className={`w-2 h-2 rounded-full transition-all ${active ? 'bg-brand-yellow scale-110' : 'bg-transparent border border-slate-300'}`}></span>
      {children}
    </div>
  );
}

// --- MAIN BOARD AREA ---
function BoardArea({ user }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  
  // State for Selection
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes, teamsRes] = await Promise.all([
        axios.get(`${API_URL}/tasks`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/teams`)
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
      setTeams(teamsRes.data);
      
      // Auto-select first team if available
      if (teamsRes.data.length > 0 && !selectedTeam) {
        setSelectedTeam(teamsRes.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to load board data", error);
    }
  };

  const handleTaskCreated = () => {
    fetchData(); // Refresh everything
    setIsTaskModalOpen(false);
  };

  const handleTeamCreated = () => {
    fetchData();
    setIsTeamModalOpen(false);
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== id)); 
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (err) {
      setTasks(originalTasks);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const updatedTasks = tasks.map(t => 
        t._id === draggableId ? { ...t, status: destination.droppableId } : t
      );
      setTasks(updatedTasks);
      try {
        await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId });
      } catch (err) {
        console.error("Failed to move task");
      }
    }
  };

  // Filter Tasks by Team
  const teamTasks = selectedTeam 
    ? tasks.filter(t => t.team?._id === selectedTeam || t.team === selectedTeam)
    : [];

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <main className="flex-1 overflow-x-auto p-8 h-full flex flex-col relative">
      <header className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-brand-black">Project Board</h1>
           <p className="text-slate-500 text-sm">Manage tasks for your pods</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Team Selector */}
          <div className="flex items-center gap-2">
             <select 
               className="bg-white border border-slate-200 text-sm font-medium p-2 rounded-lg outline-none focus:ring-2 focus:ring-brand-yellow"
               value={selectedTeam}
               onChange={(e) => setSelectedTeam(e.target.value)}
             >
               <option value="" disabled>Select Team / Pod</option>
               {teams.map(t => <option key={t._id} value={t._id}>{t.name} {t.isPrivate ? '(🔒)' : ''}</option>)}
             </select>
             <button 
               onClick={() => setIsTeamModalOpen(true)}
               className="p-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition" 
               title="Create New Team"
             >
               <Users size={18} />
             </button>
          </div>

          <button 
            onClick={() => setIsTaskModalOpen(true)}
            disabled={!selectedTeam}
            className="bg-brand-black text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      {/* --- KANBAN BOARD --- */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
           <Users size={48} className="mb-4 opacity-50"/>
           <p>No teams found. Create a team (Pod) to get started.</p>
           <button onClick={() => setIsTeamModalOpen(true)} className="mt-4 text-brand-black underline font-bold">Create Team</button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-[calc(100%-80px)] items-start">
            {columns.map(status => {
              const columnTasks = teamTasks.filter(t => t.status === status);
              return (
                <div key={status} className="w-80 flex-shrink-0 flex flex-col max-h-full">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status === 'Done' ? 'bg-green-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                        {status}
                    </h3>
                    <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className={`rounded-xl p-3 min-h-[150px] transition-colors duration-200 flex-1 overflow-y-auto custom-scrollbar 
                            ${snapshot.isDraggingOver ? 'bg-brand-yellow/10 border-brand-yellow/30' : 'bg-slate-100/80 border-transparent'} border-2`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-lg border mb-3 group transition-all relative
                                    ${snapshot.isDragging ? 'shadow-lg rotate-2 border-brand-yellow' : 'shadow-sm border-slate-200 hover:border-brand-yellow/60 hover:shadow-md'}
                                `}
                              >
                                {/* Priority Tag */}
                                <div className="flex justify-between items-start mb-2">
                                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase
                                     ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                       task.priority === 'Low' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                     {task.priority || 'Medium'}
                                   </span>
                                   {task.attachments?.length > 0 && (
                                     <span className="text-slate-400 flex items-center text-xs gap-0.5">
                                       <Paperclip size={12}/> {task.attachments.length}
                                     </span>
                                   )}
                                </div>

                                <p className="font-medium text-slate-800 text-sm mb-3 leading-snug">{task.title}</p>
                                
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">
                                  {task.assignee ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                      <UserIcon size={10} />
                                      {task.assignee.username}
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                                  )}
                                  
                                  <button 
                                    onClick={() => deleteTask(task._id)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* --- MODALS --- */}
      {isTaskModalOpen && (
        <CreateTaskModal 
          users={users} 
          teams={teams}
          selectedTeamId={selectedTeam}
          onClose={() => setIsTaskModalOpen(false)}
          onSuccess={handleTaskCreated}
        />
      )}

      {isTeamModalOpen && (
        <CreateTeamModal 
          onClose={() => setIsTeamModalOpen(false)}
          onSuccess={handleTeamCreated}
        />
      )}

    </main>
  );
}

// --- CREATE TASK MODAL (With File Upload) ---
function CreateTaskModal({ users, teams, selectedTeamId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    teamId: selectedTeamId || teams[0]?._id,
    assigneeId: '',
    files: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('priority', form.priority);
    formData.append('teamId', form.teamId);
    if(form.assigneeId) formData.append('assigneeId', form.assigneeId);
    
    // Append Files
    if (form.files) {
      for (let i = 0; i < form.files.length; i++) {
        formData.append('files', form.files[i]);
      }
    }

    try {
      await axios.post(`${API_URL}/tasks`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch (err) {
      alert("Failed to create task. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-brand-black">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
            <input 
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-yellow outline-none text-sm"
              placeholder="e.g. Fix Homepage Banner"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pod / Team</label>
              <select 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                value={form.teamId}
                onChange={e => setForm({...form, teamId: e.target.value})}
              >
                {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
              <select 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                value={form.priority}
                onChange={e => setForm({...form, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
             <select 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                value={form.assigneeId}
                onChange={e => setForm({...form, assigneeId: e.target.value})}
              >
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
              </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-yellow outline-none text-sm h-24 resize-none"
              placeholder="Add details..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Attachments</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-brand-yellow/50 transition relative">
               <input 
                  type="file" 
                  multiple 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setForm({...form, files: e.target.files})}
               />
               <Paperclip className="mx-auto text-slate-400 mb-2" size={20} />
               <span className="text-xs text-slate-500">
                  {form.files.length > 0 ? `${form.files.length} files selected` : "Drag files or click to upload"}
               </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
             <button 
               type="submit" 
               disabled={loading}
               className="px-6 py-2 bg-brand-black text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
             >
               {loading && <Loader2 className="animate-spin" size={14} />}
               Create Task
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CREATE TEAM MODAL ---
function CreateTeamModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/teams`, { name, isPrivate, members: [] }); // Add members logic later if needed
      onSuccess();
    } catch(err) {
      alert("Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
         <h2 className="text-lg font-bold text-brand-black mb-4">Create New Team (Pod)</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" 
              placeholder="Team Name (e.g. Design)" 
              value={name} onChange={e => setName(e.target.value)} required 
            />
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
              Private Team (Members Only)
            </label>
            <div className="flex justify-end gap-2 mt-4">
               <button type="button" onClick={onClose} className="px-3 py-2 text-slate-500 text-sm">Cancel</button>
               <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-yellow rounded-lg text-sm font-bold">
                 {loading ? 'Creating...' : 'Create Team'}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
}

// --- AUTH SCREEN (Login/Register) ---
function AuthScreen({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    
    try {
      const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        setToken(data.token);
        setUser(data.user);
      } else {
        setIsLogin(true);
        setError("Account created! Please log in.");
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
             <span className="text-3xl font-black text-brand-black">B</span>
          </div>
          <h2 className="text-3xl font-bold text-brand-black">{isLogin ? 'Welcome Back' : 'Join BeeBark'}</h2>
          <p className="text-slate-500 mt-2">Agile project management for teams.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none"
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          
          {/* Email Field (Required for Notifications) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-yellow outline-none"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          {error && <div className={`text-sm text-center p-2 rounded flex items-center justify-center gap-2 ${error.includes('created') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {error.includes('created') ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>} {error}
          </div>}

          <button disabled={loading} type="submit" className="w-full bg-brand-black text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex justify-center items-center gap-2">
            {loading && <Loader2 className="animate-spin" size={18} />}
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "New to BeeBark?" : "Already have an account?"} 
          <button 
            className="ml-2 text-brand-black font-bold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}