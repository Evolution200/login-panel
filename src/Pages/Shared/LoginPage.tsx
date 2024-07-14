import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginMessage } from 'Plugins/UserManagementAPI/LoginMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const setUser = useUserStore(state => state.setUser);

    const loadSavedCredentials = useCallback(() => {
        try {
            const savedUsername = localStorage.getItem('username');
            const savedPassword = localStorage.getItem('password');
            if (savedUsername && savedPassword) {
                setUsername(savedUsername);
                setPassword(savedPassword);
                setRememberMe(true);
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
        }
    }, []);

    useEffect(() => {
        loadSavedCredentials();

        return () => {
            setUsername('');
            setPassword('');
            setRememberMe(false);
            setErrorMessage('');
        };
    }, [loadSavedCredentials]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        const message = new LoginMessage(username, password);
        try {
            const response = await SendPostRequest(message);
            if (response && response.status === 200) {
                switch (response.data) {
                    case "Invalid user":
                        setErrorMessage('Invalid username. Please check your username and try again.');
                        break;
                    case "Wrong password":
                        setErrorMessage('Incorrect password. Please try again.');
                        break;
                    default:
                        const userRole = response.data;
                        setUser(username, userRole);
                        if (rememberMe) {
                            localStorage.setItem('username', username);
                            localStorage.setItem('password', password);
                        } else {
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                        }
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
                }
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [username, password, rememberMe, history, setUser]);

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleRememberMeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    }, []);

    const handleRegister = useCallback(() => {
        history.push('/Register');
    }, [history]);

    const buttonClass = useMemo(() => `group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`, [isLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Socratic
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to continue your review work
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={handleRegister}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Register new account
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={buttonClass}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};