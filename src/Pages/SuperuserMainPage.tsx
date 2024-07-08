import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../Style/SuperuserMain.css';

export function SuperuserMainPage() {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        // 从 localStorage 获取用户名和角色
        const savedUsername = localStorage.getItem('username');
        const savedRole = localStorage.getItem('role');
        if (savedUsername) setUsername(savedUsername);
        if (savedRole) setRole(savedRole);
    }, []);

    const handleLogout = () => {
        // 清除 localStorage 中的用户信息
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('role');
        // 重定向到登录页面
        history.push('/');
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-content">
                    <h1 className="header-title">Socratic</h1>
                    <div className="header-nav">
                        <span className="user-role">Current Role:</span>
                        <button className="nav-button" onClick={handleLogout}>Login</button>
                    </div>
                </div>
            </header>
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li>MainPage</li>
                        <li onClick={() => history.push("/SuperuserMain/SuperuserManagement")}>Authority Management</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>Welcome to the Main Page</h2>
                <p>Use the sidebar to navigate to other pages.</p>
            </main>
        </div>
    );
}


