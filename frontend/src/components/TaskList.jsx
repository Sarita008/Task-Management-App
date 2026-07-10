import React from 'react';
import api from '../api';
import { Trash2 } from 'lucide-react';

const TaskList = ({ tasks, fetchTasks }) => {
    
    const handleDelete = async (id) => {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
    };

    const handleStatusChange = async (id, newStatus) => {
        await api.put(`/tasks/${id}`, { status: newStatus });
        fetchTasks();
    };

    const priorityColors = {
        'Low': 'bg-green-100 text-green-700',
        'Medium': 'bg-yellow-100 text-yellow-700',
        'High': 'bg-red-100 text-red-700'
    };

    if (tasks.length === 0) return <p className="text-gray-500">No tasks found.</p>;

    return (
        <div className="flex flex-col gap-4">
            {tasks.map(task => (
                <div key={task._id} className="bg-white p-5 rounded-lg shadow-sm border flex justify-between items-start">
                    <div className="w-3/4">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${priorityColors[task.priority]}`}>
                                {task.priority}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        {task.dueDate && (
                            <p className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                        <select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className="text-sm border p-1 rounded bg-gray-50 cursor-pointer">
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                        </select>
                        <button onClick={() => handleDelete(task._id)} className="text-red-400 hover:text-red-600 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;