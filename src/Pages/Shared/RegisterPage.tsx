import React, { useState, useEffect } from 'react';
import { API } from 'Plugins/CommonUtils/API';
import { ManagerRegisterMessage } from 'Plugins/ManagerAPI/ManagerRegisterMessage';
import { UserRegisterMessage, UserRegisterInfo } from 'Plugins/UserAPI/UserRegisterMessage';
import { EditorRegisterMessage, EditorRegisterInfo } from 'Plugins/EditorAPI/EditorRegisterMessage';
import { ReadPeriodicalsMessage } from 'Plugins/ManagerAPI/ReadPeriodicalsMessage';
import { useHistory } from 'react-router-dom';
import { SendPostRequest } from '../../Common/SendPost';

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [surname, setSurname] = useState('');
    const [lastName, setLastName] = useState('');
    const [institute, setInstitute] = useState('');
    const [expertise, setExpertise] = useState('');
    const [email, setEmail] = useState('');
    const [periodical, setPeriodical] = useState('');
    const [periodicals, setPeriodicals] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (role === 'editor') {
            fetchPeriodicals();
        }
    }, [role]);

    const fetchPeriodicals = async () => {
        try {
            const message = new ReadPeriodicalsMessage();
            const response = await SendPostRequest(message);
            if (response && response.data) {
                const periodicalsData = JSON.parse(response.data);
                if (Array.isArray(periodicalsData)) {
                    const periodicalsList = periodicalsData.map(item => item.periodical);
                    setPeriodicals(periodicalsList);
                    if (periodicalsList.length > 0) {
                        setPeriodical(periodicalsList[0]);
                    }
                } else {
                    throw new Error('Unexpected data format');
                }
            }
        } catch (error) {
            console.error('Failed to fetch periodicals:', error);
            setErrorMessage('Failed to load periodicals. Please try again.');
        }
    };

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
        if (!role) {
            setErrorMessage('Please select a role');
            return;
        }
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
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl relative">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register for Socratic
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create an account to start your review work
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative mb-6">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Select your role
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                onFocus={() => setIsOpen(true)}
                                onBlur={() => setIsOpen(false)}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            >
                                <option value="" disabled selected>Choose your role</option>
                                <option value="manager">Manager</option>
                                <option value="editor">Editor</option>
                                <option value="user">User</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                    className={`fill-current h-4 w-4 transform ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {(role === 'user' || role === 'editor') && (
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="surname" className="sr-only">First Name</label>
                                <input
                                    type="text"
                                    id="surname"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="sr-only">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Last Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="institute" className="sr-only">Institute</label>
                                <input
                                    type="text"
                                    id="institute"
                                    value={institute}
                                    onChange={(e) => setInstitute(e.target.value)}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Institute"
                                />
                            </div>
                            <div>
                                <label htmlFor="expertise" className="sr-only">Expertise</label>
                                <input
                                    type="text"
                                    id="expertise"
                                    value={expertise}
                                    onChange={(e) => setExpertise(e.target.value)}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Expertise"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                    )}

                    {role === 'editor' && (
                        <div>
                            <label htmlFor="periodical" className="sr-only">Journal</label>
                            <select
                                id="periodical"
                                value={periodical}
                                onChange={(e) => setPeriodical(e.target.value)}
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            >
                                {periodicals.map((p, index) => (
                                    <option key={index} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => history.push('/')}
                            className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                        >
                            Back to Login
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};