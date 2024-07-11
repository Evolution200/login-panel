import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../Style/Shared/Login.css';
import { LoginMessage } from 'Plugins/UserManagementAPI/LoginMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        const message = new LoginMessage(username, password);
        try {
            const response = await SendPostRequest(message);
            if (response && response.status === 200) {
                const userRole = response.data; // 后端返回的用户角色
                setUser(username, userRole);
                if (rememberMe) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', password);
                } else {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                // 根据用户角色重定向到不同的主页
                switch (userRole) {
                    case 'superuser':
                        history.push('/SuperuserMain');
                        break;
                    case 'manager':
                        history.push('/ManagerMain');
                        break;
                    case 'editor':
                        history.push('/EditorMain');
                        break;
                    case 'user':
                        history.push('/UserMain');
                        break;
                    default:
                        history.push('/');
                }
            } else if (response.data === "Invalid user") {
                setErrorMessage('Invalid username');
            } else if (response.data === "Wrong password") {
                setErrorMessage('Incorrect password');
            } else {
                setErrorMessage('Unexpected error occurred');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username：</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">Password：</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="remember-me">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
                <button type="button" onClick={() => history.push('/Register')}>Register</button>
            </form>
        </div>
    );
};