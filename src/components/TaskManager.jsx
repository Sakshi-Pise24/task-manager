import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit, Check, X, Calendar, Search, 
  Bell, Star, StarOff, Tag, Clock, AlertCircle
} from 'lucide-react';

const TaskManager = () => {
  // Enhanced state management
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [sortBy, setSortBy] = useState('date');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Categories with colors
  const categories = {
    personal: { label: 'Personal', color: 'bg-blue-100 text-blue-800' },
    work: { label: 'Work', color: 'bg-purple-100 text-purple-800' },
    shopping: { label: 'Shopping', color: 'bg-green-100 text-green-800' },
    health: { label: 'Health', color: 'bg-red-100 text-red-800' },
    education: { label: 'Education', color: 'bg-yellow-100 text-yellow-800' }
  };

  // Priority levels with colors
  const priorities = {
    low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'High', color: 'bg-red-100 text-red-800' }
  };

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    checkDueDates();
  }, [tasks]);

  // Check for due dates and show notifications
  const checkDueDates = () => {
    const now = new Date();
    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff > 0 && hoursDiff <= 24) {
          showNotificationMessage(`Task "${task.text}" is due in ${Math.round(hoursDiff)} hours!`);
        }
      }
    });
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        category: newTaskCategory,
        dueDate: newTaskDueDate,
        priority: newTaskPriority,
        createdAt: new Date().toISOString(),
        starred: false
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskDueDate('');
      showNotificationMessage('Task added successfully!');
    }
  };

  // Toggle task star status
  const handleToggleStar = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, starred: !task.starred } : task
    ));
  };

  // Delete task
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
      showNotificationMessage('Task deleted successfully!');
    }
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'completed' ? task.completed :
        filter === 'active' ? !task.completed :
        filter === 'starred' ? task.starred : true;

      const matchesCategory = 
        category === 'all' ? true : task.category === category;

      const matchesSearch = 
        task.text.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Bell size={20} />
          {notificationMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
        
        <div className="flex gap-3">
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          >
            {Object.entries(categories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          >
            {Object.entries(priorities).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          />
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-lg ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-lg ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('starred')}
          className={`px-3 py-1 rounded-lg ${filter === 'starred' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Starred
        </button>

        {Object.entries(categories).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-3 py-1 rounded-lg ${category === key ? 'bg-blue-500 text-white' : color}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.map(task => (
          <div
            key={task.id}
            className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => setTasks(tasks.map(t =>
                  t.id === task.id ? { ...t, completed: !t.completed } : t
                ))}
                className="w-5 h-5"
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 p-2 border rounded-lg"
                    />
                  ) : (
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.text}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStar(task.id)}
                      className={`${task.starred ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                    >
                      {task.starred ? <Star size={20} /> : <StarOff size={20} />}
                    </button>
                    {editingId === task.id ? (
                      <>
                        <button
                          onClick={() => {
                            setTasks(tasks.map(t =>
                              t.id === task.id ? { ...t, text: editValue } : t
                            ));
                            setEditingId(null);
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditValue(task.text);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className={categories[task.category].color + ' px-2 py-0.5 rounded-full'}>
                    <Tag size={14} className="inline mr-1" />
                    {categories[task.category].label}
                  </span>
                  <span className={priorities[task.priority].color + ' px-2 py-0.5 rounded-full'}>
                    <AlertCircle size={14} className="inline mr-1" />
                    {priorities[task.priority].label}
                  </span>
                  {task.dueDate && (
                    <span className="text-gray-500">
                      <Calendar size={14} className="inline mr-1" />
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </span>
                  )}
                  <span className="text-gray-500">
                    <Clock size={14} className="inline mr-1" />
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        {/* Task Statistics */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.starred).length}
            </div>
            <div className="text-sm text-gray-600">Starred</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categories).map(([key, { label, color }]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-semibold">
                {tasks.filter(t => t.category === key).length}
              </div>
              <div className={`text-sm ${color.replace('bg-', 'text-').replace('-100', '-600')}`}>
                {label} Tasks
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {Object.entries(priorities).map(([key, { label, color }]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-semibold">
                {tasks.filter(t => t.priority === key).length}
              </div>
              <div className={`text-sm ${color.replace('bg-', 'text-').replace('-100', '-600')}`}>
                {label} Priority
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {search 
              ? "No tasks match your search criteria" 
              : filter !== 'all' || category !== 'all'
                ? "No tasks match your filters"
                : "Start by adding a new task above"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;