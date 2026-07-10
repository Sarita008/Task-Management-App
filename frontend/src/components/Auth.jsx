import React, { useState } from 'react';
import api from '../api';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const { data } = await api.post(endpoint, formData);
            if (isLogin) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert("Signup successful! Please login.");
                setIsLogin(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="glass-panel p-10 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm mt-2 opacity-80">
                        {isLogin ? 'Log in to manage your tasks.' : 'Sign up to get started.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input type="email" placeholder="Email" required 
                           className="glass-input p-3 rounded-xl dark:text-white"
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    
                    <input type="password" placeholder="Password" required 
                           className="glass-input p-3 rounded-xl dark:text-white"
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    
                    <button type="submit" disabled={loading}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-xl font-bold shadow-lg transition-transform transform hover:-translate-y-0.5">
                        {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center cursor-pointer font-medium hover:opacity-70 transition-opacity" 
                   onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
                </p>
            </div>
        </div>
    );
};

export default Auth;