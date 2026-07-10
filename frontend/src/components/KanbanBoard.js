import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api';
import { Trash2, Calendar, X, AlignLeft } from 'lucide-react';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = ({ tasks, fetchTasks }) => {
    const [localTasks, setLocalTasks] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);
    
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        
        const updatedTasks = localTasks.map(t => 
            String(t._id) === draggableId ? { ...t, status: newStatus } : t
        );
        setLocalTasks(updatedTasks);

        if (destination.droppableId !== source.droppableId) {
            try {
                await api.put(`/tasks/${draggableId}`, { status: newStatus });
                fetchTasks(); 
            } catch (error) {
                alert("Failed to update status. Reverting.");
                setLocalTasks(tasks); 
            }
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); 
        await api.delete(`/tasks/${id}`);
        fetchTasks();
        if (selectedTask && selectedTask._id === id) {
            setSelectedTask(null);
        }
    };

    const priorityColors = {
        'Low': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        'Medium': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        'High': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
    };

    // Helper function to determine dot and border colors based on status and due date
    const getTaskIndicators = (task) => {
        const now = new Date();
        // Remove the time portion to strictly compare dates
        now.setHours(0, 0, 0, 0); 
        
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (dueDate) dueDate.setHours(0, 0, 0, 0);

        const isOverdue = dueDate && dueDate < now && task.status !== 'Done';

        if (isOverdue) return { dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]', border: 'border-red-400/60 dark:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]' };
        if (task.status === 'Done') return { dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]', border: 'border-emerald-400/50 dark:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' };
       if (task.status === 'In Progress') return { dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]', border: 'border-yellow-400/50 dark:border-yellow-500/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' };
       // Default for To Do
        return { dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]', border: 'border-blue-400/50 dark:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' };
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {COLUMNS.map((status) => {
                        const columnTasks = localTasks.filter(t => t.status === status);
                        
                        return (
                            <div key={status} className="bg-white/40 dark:bg-black/40 border border-white/40 dark:border-gray-700/50 shadow-xl p-4 rounded-2xl flex flex-col h-full min-h-[500px]">
                                
                                <h3 className="font-extrabold text-lg mb-4 text-center opacity-80 uppercase tracking-wider border-b border-gray-300/30 dark:border-gray-600/30 pb-3">
                                    {status} <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">{columnTasks.length}</span>
                                </h3>

                                <Droppable droppableId={String(status)}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.droppableProps}
                                            className={`flex-1 transition-colors rounded-xl min-h-[400px] ${snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5' : ''}`}
                                        >
                                            {columnTasks.map((task, index) => {
                                                const indicators = getTaskIndicators(task);
                                                
                                                return (
                                                    <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                                className="pb-3"
                                                            >
                                                                <div 
                                                                    onClick={() => setSelectedTask(task)}
                                                                    className={`relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl border group cursor-pointer
                                                                    ${indicators.border}
                                                                    ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-indigo-500 scale-105 z-50' : 'hover:scale-[1.02]'} transition-all duration-200`}
                                                                >
                                                                    
                                                                    {/* Glowing Status Dot */}
                                                                    <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${indicators.dot}`} />

                                                                    <div className="flex justify-between items-start mb-2 pr-6">
                                                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                                                            {task.title}
                                                                        </h4>
                                                                    </div>
                                                                    
                                                                    <p className="text-sm opacity-70 mb-4 line-clamp-2">
                                                                        {task.description}
                                                                    </p>
                                                                    
                                                                    <div className="flex items-center justify-between mt-auto">
                                                                        <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${priorityColors[task.priority]}`}>
                                                                            {task.priority}
                                                                        </span>
                                                                        
                                                                        <div className="flex items-center gap-3">
                                                                            {task.dueDate && (
                                                                                <div className={`flex items-center gap-1 text-xs font-medium ${
                                                                                    getTaskIndicators(task).dot.includes('red') ? 'text-red-500 dark:text-red-400 font-bold' : 'opacity-60'
                                                                                }`}>
                                                                                    <Calendar size={12} />
                                                                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                                </div>
                                                                            )}
                                                                            <button onClick={(e) => handleDelete(e, task._id)} 
                                                                                    className="text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* --- Pop-up Modal Implementation --- */}
            {selectedTask && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                     onClick={() => setSelectedTask(null)} 
                >
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col"
                         onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="flex justify-between items-start p-6 border-b border-gray-200/50 dark:border-gray-700/50 relative">
                            {/* Dot inside the modal as well for continuity */}
                            <div className={`absolute top-6 right-12 w-3 h-3 rounded-full ${getTaskIndicators(selectedTask).dot}`} />
                            
                            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400 pr-12">
                                {selectedTask.title}
                            </h2>
                            <button onClick={() => setSelectedTask(null)} 
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className={`text-sm px-3 py-1 rounded-md font-bold ${priorityColors[selectedTask.priority]}`}>
                                    Priority: {selectedTask.priority}
                                </span>
                                <span className="text-sm px-3 py-1 rounded-md font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    Status: {selectedTask.status}
                                </span>
                                {selectedTask.dueDate && (
                                    <span className={`text-sm px-3 py-1 rounded-md font-bold flex items-center gap-2 ${
                                        getTaskIndicators(selectedTask).dot.includes('red') 
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                    }`}>
                                        <Calendar size={14} />
                                        Due: {new Date(selectedTask.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider flex items-center gap-2">
                                    <AlignLeft size={16} /> Description
                                </h3>
                                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {selectedTask.description || "No description provided."}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end">
                            <button onClick={() => setSelectedTask(null)}
                                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KanbanBoard;