import React, { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useHistory } from 'react-router-dom';
import '../Style/Login.css';
import { API } from 'Plugins/CommonUtils/API'
import { UserLoginMessage } from 'Plugins/UserAPI/UserLoginMessage'
import { EditorLoginMessage } from 'Plugins/EditorAPI/EditorLoginMessage'
import { SuperuserLoginMessage } from 'Plugins/SuperuserAPI/SuperuserLoginMessage'
import { ManagerLoginMessage } from 'Plugins/ManagerAPI/ManagerLoginMessage'
import { SendPostRequest } from '../Common/SendPost'

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [role, setRole] = useState('user');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        const savedRole = localStorage.getItem('role');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRole(savedRole);
            setRememberMe(true);
        }
    }, []);

    const getLoginMessage = (): API => {
        switch (role) {
            case 'superuser':
                return new SuperuserLoginMessage(username, password);
            case 'manager':
                return new ManagerLoginMessage(username, password);
            case 'editor':
                return new EditorLoginMessage(username, password);
            case 'user':
            default:
                return new UserLoginMessage(username, password);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); // 清空之前的错误消息
        const message = getLoginMessage();//获取登录对象的信息
        try {
            const response = await SendPostRequest(message);
            if (response && response.status === 200) {
                if (response.data === "Valid user"){
                    if (rememberMe) {
                        localStorage.setItem('username', username);
                        localStorage.setItem('password', password);
                        localStorage.setItem('role', role);
                    } else {
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');
                        localStorage.removeItem('role');
                    }
                    history.push('/SuperuserMain');
                } else {
                    setErrorMessage('The username or password is incorrect');
                }
            } else {
                setErrorMessage('Unexpected error occurred');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                if (error.response.status === 400) {
                    if (error.response.data && error.response.data.includes("操作符不存在: text = boolean")) {
                        setErrorMessage('您申请的账户还在审批中，请耐心等待');
                    } else {
                        setErrorMessage('Invalid username or password');
                    }
                } else if (error.response.status === 500) {
                    setErrorMessage('Server error. Please try again later.');
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
            } else if (error.request) {
                setErrorMessage('No response from server. Please check your network connection.');
            } else {
                setErrorMessage('An error occurred while sending the request.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="role">登录身份：</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="superuser">Superuser</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="user">User</option>
                </select>
                <label htmlFor="username">username：</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password">密码：</label>
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
                    <label htmlFor="rememberMe">记住密码</label>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">登录</button>
                <button type="button" onClick={() => history.push('/Register')}>注册</button>
            </form>
        </div>
    );
};
