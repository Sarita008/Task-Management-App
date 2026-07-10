import React, { useState, useEffect } from 'react';
import api from '../api';
import TaskForm from './TaskForm';
import KanbanBoard from './KanbanBoard';
import { Sun, Moon, LogOut } from 'lucide-react';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const { data } = await api.get('/tasks');
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <header className="glass-panel rounded-2xl p-4 sm:px-8 mb-8 flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
                    TaskFlow AI
                </h1>
                
                <div className="flex items-center gap-4 sm:gap-6">
                    <button onClick={toggleDarkMode} 
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="p-2 rounded-full bg-white/20 dark:bg-black/20 hover:scale-110 transition-transform shadow-sm">
                        {darkMode ? (
                            <Sun size={20} className="text-yellow-400" /> 
                        ) : (
                            <Moon size={20} className="text-indigo-600" />
                        )}
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700 transition">
                        <LogOut size={20} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <TaskForm fetchTasks={fetchTasks} />
                </div>
                <div className="lg:col-span-3">
                    {/* The Kanban Board replaces the simple TaskList */}
                    <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;