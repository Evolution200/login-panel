import React from 'react';
import { useHistory } from 'react-router-dom';
import '../Style/EditorMain.css'; // 引入你的 CSS 文件

export function EditorMainPage() {
    const history = useHistory();

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-content">
                    <h1 className="header-title">Socratic</h1>
                    <div className="header-nav">
                        <button className="nav-button" onClick={() => history.push("/")}>Login</button>
                    </div>
                </div>
            </header>
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li>MainPage</li>
                        <li onClick={() => history.push("/EditorMain/EditorManagement")}>Review submitted articles</li>
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


