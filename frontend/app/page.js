"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, TextField, Button, Avatar, IconButton, InputAdornment, Switch } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GrassIcon from '@mui/icons-material/Grass';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import BugReportIcon from '@mui/icons-material/BugReport';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';

export default function Home() {
  // --- STATE VARIABLES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. Fetch Data
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Backend not running!", err));
  }, []);

  // 2. Handle Login
  const handleLogin = () => {
    if(email === "johnsmith@agromind.com" && password === "admin123") {
        setIsLoggedIn(true);
    } else {
        alert("Access Denied! Wrong Email or Password.");
    }
  };

  // 3. Handle Chat
  const sendMessage = async () => {
    if (!input) return;
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    const currentInput = input;
    setInput("");
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', { message: currentInput });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
    } catch (error) {
      console.error("Error chatting", error);
    }
  };

  // --- LOGIN SCREEN (Hybrid: Light Background + DARK Card) ---
  if (!isLoggedIn) {
    return (
      // Background is Light Blue-Grey (Not White)
      <div className="flex h-screen items-center justify-center bg-slate-200 relative overflow-hidden">
        
        {/* The Card is DARK (Like your screenshot) */}
        <div className="relative z-10 w-96 bg-[#1e293b] border border-slate-600 p-8 rounded-2xl shadow-2xl text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
             <GrassIcon sx={{ fontSize: 32, color: 'white' }} />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">AgroMind</h1>
           <p className="text-slate-400 mb-8">Smart Farming Companion</p>
           
           <div className="space-y-4">
             {/* Inputs are Dark to match the card */}
             <TextField 
                fullWidth placeholder="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'gray' }}/></InputAdornment> }}
                sx={{ bgcolor: '#0f172a', borderRadius: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' } } }}
             />
             <TextField 
                fullWidth type="password" placeholder="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'gray' }}/></InputAdornment> }}
                sx={{ bgcolor: '#0f172a', borderRadius: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#334155' } } }}
             />
             <Button fullWidth variant="contained" size="large" onClick={handleLogin} sx={{ bgcolor: '#4ade80', color: '#0f172a', fontWeight: 'bold', '&:hover': { bgcolor: '#22c55e' } }}>
                Login to Dashboard
             </Button>
           </div>
        </div>
        
        <div className="absolute bottom-6 flex flex-col items-center text-slate-500 text-sm z-10">
            <p className="mb-2">Powered by AgroTech Solutions & AI Technology</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP (Light Theme Dashboard) ---
  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR (Royal Purple) */}
      <div className="w-64 bg-[#1e1b4b] flex flex-col p-6 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
             <GrassIcon className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">AgroMind</h1>
        </div>
        <nav className="flex-1 space-y-2">
           <SidebarItem icon={<DashboardIcon />} text="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
           <SidebarItem icon={<SchoolIcon />} text="Learning" active={activeTab === "Learning"} onClick={() => setActiveTab("Learning")} />
           <SidebarItem icon={<GrassIcon />} text="My Crops" active={activeTab === "My Crops"} onClick={() => setActiveTab("My Crops")} />
           <SidebarItem icon={<PeopleIcon />} text="Community" active={activeTab === "Community"} onClick={() => setActiveTab("Community")} />
           <SidebarItem icon={<SettingsIcon />} text="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
        </nav>
        <div className="mt-auto pt-6 border-t border-indigo-900/50 flex items-center gap-3">
           <Avatar sx={{ bgcolor: '#818cf8' }}>T</Avatar>
           <div><p className="text-sm font-semibold text-white">Tharini</p><p className="text-xs text-indigo-300">Farmer Pro</p></div>
           <IconButton onClick={() => setIsLoggedIn(false)} sx={{ color: '#818cf8', marginLeft: 'auto' }}><LogoutIcon /></IconButton>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden relative">

        {/* CENTER COLUMN */}
        <div className="w-2/3 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-800">{activeTab}</h2>
                <p className="text-slate-500 text-sm mt-1">Manage your farm efficiently</p>
            </div>
            <div className="text-slate-500 text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">Dec 9, 2025 • Nuwara Eliya</div>
          </div>

          {/* === DASHBOARD === */}
          {activeTab === "Dashboard" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <WhiteCard title="Soil Moisture" value={`${stats ? stats.soil_moisture : 0}%`} color="#10b981" icon={<GrassIcon sx={{color:'white'}}/>} />
                 <WhiteCard title="Active Alerts" value={stats ? stats.alerts : 0} color="#f43f5e" icon={<NotificationsIcon sx={{color:'white'}}/>} />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex-1 min-h-[300px]">
                  <Typography variant="h6" className="mb-6 font-bold text-slate-700">Harvest Yield Trends</Typography>
                  <div style={{ height: '80%', width: '100%' }}>
                    {stats && (
                      <ResponsiveContainer>
                        <LineChart data={stats.harvest_history}>
                          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                          <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }} itemStyle={{ color: '#1e293b' }} />
                          <Line type="monotone" dataKey="yield" stroke="#6366f1" strokeWidth={4} dot={{r: 4, fill: '#fff', stroke:'#6366f1', strokeWidth:3}} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
              </div>
            </>
          )}

          {/* === LEARNING === */}
          {activeTab === "Learning" && (
            <div className="space-y-6">
               <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-indigo-100/50">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-indigo-100 flex justify-between items-center">
                     <span className="text-indigo-600 font-bold uppercase text-xs tracking-wider">Basics • Rice Cultivation</span>
                     <div className="p-2 bg-white rounded-full shadow-sm"><SchoolIcon sx={{ color: '#6366f1' }}/></div>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Understanding Plant Nutrition</h2>
                      <div className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold mb-6">The Nitrogen Cycle</div>
                      <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                         <div className="absolute inset-0 border-2 border-dashed border-indigo-200 rounded-full animate-spin-slow"></div>
                         <GrassIcon sx={{ fontSize: 60, color: '#10b981' }} />
                         <div className="absolute top-0 bg-white border border-indigo-100 shadow-sm px-2 rounded text-xs font-bold text-indigo-800">N2</div>
                         <div className="absolute bottom-0 bg-white border border-indigo-100 shadow-sm px-2 rounded text-xs font-bold text-indigo-800">NH3</div>
                      </div>
                      <p className="text-slate-500 text-sm max-w-md">Nitrogen is essential for leafy growth. Bacteria in the soil fix atmospheric Nitrogen into Ammonia for roots to absorb.</p>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-orange-100/50">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-b border-orange-100 flex justify-between items-center">
                     <span className="text-orange-600 font-bold uppercase text-xs tracking-wider">Alert • Tea Plantation</span>
                     <div className="p-2 bg-white rounded-full shadow-sm"><CoronavirusIcon sx={{ color: '#f97316' }}/></div>
                  </div>
                  <div className="p-6">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">Identifying Blister Blight</h2>
                      <div className="flex gap-4">
                          <div className="w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center">
                              <CoronavirusIcon sx={{ fontSize: 40, color: '#f97316' }} />
                          </div>
                          <div className="flex-1 text-sm text-slate-500 space-y-2">
                              <p><strong className="text-slate-700">Symptoms:</strong> Translucent blisters on young leaves.</p>
                              <p><strong className="text-slate-700">Control:</strong> Spray Copper-based fungicides.</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          )}

          {/* === MY CROPS === */}
          {activeTab === "My Crops" && (
            <div className="grid grid-cols-2 gap-4">
              <CropCard name="Carrots" stage="Harvesting" health="Good" date="Planted: Aug 12" />
              <CropCard name="Leeks" stage="Growing" health="Needs Water" date="Planted: Sep 05" />
              <div className="border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center p-10 cursor-pointer hover:border-indigo-500 hover:text-indigo-500 text-slate-400 font-medium transition bg-white">+ Add New Crop</div>
            </div>
          )}

          {/* === COMMUNITY (Added 3rd Question) === */}
          {activeTab === "Community" && (
            <div className="space-y-4">
               <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-slate-200/50">
                  <div className="flex gap-3 mb-3">
                    <Avatar sx={{ bgcolor: '#f59e0b' }}>S</Avatar>
                    <div><p className="font-bold text-slate-800">Sunil Perera</p><p className="text-xs text-slate-400">2 hours ago</p></div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">Has anyone seen the new fertilizer prices in Dambulla? Are they going down?</p>
               </div>
               
               <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-slate-200/50">
                  <div className="flex gap-3 mb-3">
                    <Avatar sx={{ bgcolor: '#8b5cf6' }}>K</Avatar>
                    <div><p className="font-bold text-slate-800">Kamal Dias</p><p className="text-xs text-slate-400">5 hours ago</p></div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">My tomatoes have black spots. Is it blight or fungus? Need help!</p>
               </div>

               {/* NEW 3RD QUESTION */}
               <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-slate-200/50">
                  <div className="flex gap-3 mb-3">
                    <Avatar sx={{ bgcolor: '#10b981' }}>N</Avatar>
                    <div><p className="font-bold text-slate-800">Nimali Silva</p><p className="text-xs text-slate-400">1 day ago</p></div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">Where can I buy good quality Pumpkin seeds in Kandy area?</p>
               </div>
            </div>
          )}

          {/* === SETTINGS === */}
          {activeTab === "Settings" && (
            <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-xl shadow-slate-200/50">
               <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center text-slate-700"><NotificationsIcon /><span className="text-lg font-medium">Notifications</span></div>
                  <Switch defaultChecked color="primary" />
               </div>
               <Button variant="outlined" color="error" fullWidth sx={{borderRadius: 3, py: 1.5}}>Delete Account</Button>
            </div>
          )}

        </div>

        {/* CHAT AREA (Updated Colors) */}
        <div className="w-1/3 bg-white border border-slate-200 rounded-3xl flex flex-col shadow-2xl shadow-indigo-100/50 overflow-hidden z-10">
           <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl"><SmartToyIcon sx={{ color: '#4f46e5' }} /></div>
              <div><h3 className="font-bold text-slate-800">AI Agronomist</h3><p className="text-xs text-green-500 flex items-center gap-1">● Online</p></div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
                      <SmartToyIcon sx={{ fontSize: 40, color: '#4f46e5' }} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Welcome to AgroMind</h3>
                    <p className="text-sm text-slate-500 max-w-[250px] leading-relaxed">
                      Ask me about <span className="text-indigo-600 font-bold">pest control</span>, <span className="text-blue-600 font-bold">fertilizers</span>, or <span className="text-orange-500 font-bold">diseases</span>.
                    </p>
                </div>
              )}
              {messages.map((m, index) => (
                <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Changed User Chat Bubble to be Dark Blue-Purple for better contrast */}
                  <div className={`p-3 text-sm rounded-2xl max-w-[85%] shadow-sm ${
                      m.role === 'user' 
                      ? 'bg-[#1e1b4b] text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}>{m.content}</div>
                </div>
              ))}
           </div>

           <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
              <IconButton sx={{ color: '#4f46e5', bgcolor: '#e0e7ff', borderRadius: 2 }} onClick={() => alert("Image Upload coming soon!")}>
                 <PhotoCameraIcon fontSize="small" />
              </IconButton>
              
              <input 
                  className="flex-1 min-w-0 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400"
                  placeholder="Type a question..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30 flex-shrink-0 transition-all">
                  <SmartToyIcon fontSize="small" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPERS ---
function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-indigo-200 hover:bg-indigo-900/50 hover:text-white'
    }`}>
       {icon} <span className="font-medium">{text}</span>
    </div>
  );
}

function WhiteCard({ title, value, color, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex items-center justify-between transition-all hover:-translate-y-1">
       <div><p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</p><h3 className="text-4xl font-extrabold text-slate-800">{value}</h3></div>
       <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: color }}>
          {icon}
       </div>
    </div>
  );
}

function CropCard({ name, stage, health, date }) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
            <div className="flex justify-between mb-4">
                <h3 className="font-bold text-xl text-slate-800">{name}</h3>
                <span className={`text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold border border-green-200`}>{health}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Stage: <span className="text-indigo-600">{stage}</span></p>
            <p className="text-slate-400 text-xs mt-3 font-medium uppercase tracking-wide">{date}</p>
        </div>
    )
}