import React, { useState } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { ManagerRegisterMessage } from 'Plugins/ManagerAPI/ManagerRegisterMessage';
import { UserRegisterMessage, UserRegisterInfo } from 'Plugins/UserAPI/UserRegisterMessage';
import { EditorRegisterMessage, EditorRegisterInfo } from 'Plugins/EditorAPI/EditorRegisterMessage';
import { useHistory } from 'react-router-dom';
import '../Style/Register.css';
import { SendPostRequest } from '../Common/SendPost'

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [errorMessage, setErrorMessage] = useState('');
    const [surname, setSurname] = useState('');
    const [lastName, setLastName] = useState('');
    const [institute, setInstitute] = useState('');
    const [expertise, setExpertise] = useState('');
    const [email, setEmail] = useState('');
    const [periodical, setPeriodical] = useState('');
    const history = useHistory();

    const getRegisterMessage = (): API => {
        switch (role) {
            case 'manager':
                return new ManagerRegisterMessage(username, password);
            case 'editor':
                const editorInfo: EditorRegisterInfo = {
                    userName: username,
                    password: password,
                    surName: surname,
                    lastName: lastName,
                    institute: institute,
                    expertise: expertise,
                    email: email,
                    periodical: periodical
                };
                return new EditorRegisterMessage(editorInfo);
            case 'user':
                const userInfo: UserRegisterInfo = {
                    userName: username,
                    password: password,
                    surName: surname,
                    lastName: lastName,
                    institute: institute,
                    expertise: expertise,
                    email: email
                };
                return new UserRegisterMessage(userInfo);
            default:
                throw new Error('Invalid role');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        setErrorMessage('');
        const message: API = getRegisterMessage();
        try {
            const response = await SendPostRequest(message);
            if (response.status === 200) {
                if (response.data === "already registered") {
                    setErrorMessage('The username already exists');
                } else {
                    alert('Please wait a moment. Your registration is being processed!');
                    history.push('/');
                }
            } else {
                setErrorMessage('Unexpected error occurred');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>注册界面</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="role">申请权限：</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="user">User</option>
                </select>
                <label htmlFor="username">用户名：</label>
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
                <label htmlFor="confirmPassword">确认密码：</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {(role === 'user' || role === 'editor') && (
                    <>
                        <label htmlFor="surname">姓：</label>
                        <input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                        <label htmlFor="lastName">名：</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <label htmlFor="institute">研究所：</label>
                        <input
                            type="text"
                            id="institute"
                            value={institute}
                            onChange={(e) => setInstitute(e.target.value)}
                            required
                        />
                        <label htmlFor="expertise">专业：</label>
                        <input
                            type="text"
                            id="expertise"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            required
                        />
                        <label htmlFor="email">邮箱：</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </>
                )}
                {role === 'editor' && (
                    <>
                        <label htmlFor="periodical">期刊：</label>
                        <input
                            type="text"
                            id="periodical"
                            value={periodical}
                            onChange={(e) => setPeriodical(e.target.value)}
                            required
                        />
                    </>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">注册</button>
                <button type="button" onClick={() => history.push('/')}>返回登录</button>
            </form>
        </div>
    );
};