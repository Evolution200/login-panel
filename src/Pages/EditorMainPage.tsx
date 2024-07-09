import React from 'react';
import { useHistory } from 'react-router-dom';
import '../Style/EditorMain.css';
import { useUserStore } from '../Store/UserStore';

export function EditorMainPage() {
    const history = useHistory();
    const { username, role, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-content">
                    <h1 className="header-title">Socratic</h1>
                    <div className="header-nav">
                        <span className="user-info">Username: {username}</span>
                        <button className="nav-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </header>
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li>MainPage</li>
                        <li onClick={() => history.push("/EditorMain/EditorInfo")}>Editor Information</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>Welcome to the Main Page, {username}!</h2>
                <p>Use the sidebar to navigate to other pages.</p>
            </main>
        </div>
    );
}
