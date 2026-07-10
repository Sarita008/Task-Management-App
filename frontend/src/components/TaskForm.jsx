import React, { useState } from 'react';
import api from '../api';
import { Sparkles, Plus } from 'lucide-react';

const TaskForm = ({ fetchTasks }) => {
    const [task, setTask] = useState({ title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '' });
    const [loadingAI, setLoadingAI] = useState(false);

    const handleAI = async () => {
        if (!task.title) return alert("Please enter a rough title first.");
        setLoadingAI(true);
        try {
            const { data } = await api.post('/tasks/ai-suggest', { title: task.title });
            setTask({ ...task, description: data.description, priority: data.priority });
        } catch (error) {
            console.error("AI Error:", error);
            alert("Failed to fetch AI suggestion.");
        }
        setLoadingAI(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/tasks', task);
        setTask({ title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '' });
        fetchTasks();
    };

    return (
        <div className="glass-panel p-6 rounded-2xl sticky top-8">
            <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                <Plus size={24} className="text-indigo-500" /> Create Task
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-sm font-bold opacity-80 mb-1 block">Title</label>
                    <input type="text" required value={task.title} 
                           onChange={e => setTask({...task, title: e.target.value})} 
                           className="w-full glass-input p-2.5 rounded-xl dark:text-white" 
                           placeholder="e.g., fix login bug" />
                </div>
                
                <button type="button" onClick={handleAI} disabled={loadingAI}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 p-2.5 rounded-xl text-sm font-extrabold hover:shadow-md transition">
                    <Sparkles size={18} className={loadingAI ? "animate-spin" : ""} /> 
                    {loadingAI ? "Generating Magic..." : "AI Suggest Details"}
                </button>

                <div>
                    <label className="text-sm font-bold opacity-80 mb-1 block">Description</label>
                    <textarea value={task.description} 
                              onChange={e => setTask({...task, description: e.target.value})}
                              className="w-full glass-input p-2.5 rounded-xl h-24 resize-none dark:text-white" />
                </div>

                <div className="flex gap-3">
                    <div className="w-1/2">
                        <label className="text-sm font-bold opacity-80 mb-1 block">Priority</label>
                        <select value={task.priority} 
                                onChange={e => setTask({...task, priority: e.target.value})} 
                                className="w-full glass-input p-2.5 rounded-xl dark:text-white cursor-pointer">
                            <option className="dark:bg-gray-800">Low</option>
                            <option className="dark:bg-gray-800">Medium</option>
                            <option className="dark:bg-gray-800">High</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="text-sm font-bold opacity-80 mb-1 block">Due Date</label>
                        <input type="date" value={task.dueDate} 
                               onChange={e => setTask({...task, dueDate: e.target.value})} 
                               className="w-full glass-input p-2.5 rounded-xl dark:text-white cursor-pointer" />
                    </div>
                </div>

                <button type="submit" 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 mt-2">
                    Save Task
                </button>
            </form>
        </div>
    );
};

export default TaskForm;