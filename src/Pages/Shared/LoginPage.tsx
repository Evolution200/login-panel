import React, { useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginMessage } from 'Plugins/UserManagementAPI/LoginMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore, UserRole } from '../../Store/UserStore';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { setUser } = useUserStore();

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        const message = new LoginMessage(username, password); // 直接使用password，而不是hashedPassword
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
                        const userRole = response.data as UserRole;
                        setUser(username, userRole);
                        if (rememberMe) {
                            localStorage.setItem('username', username);
                        } else {
                            localStorage.removeItem('username');
                        }
                        switch (userRole) {
                            case UserRole.SuperUser:
                                history.push('/SuperuserMain');
                                break;
                            case UserRole.Manager:
                                history.push('/ManagerMain');
                                break;
                            case UserRole.Editor:
                                history.push('/EditorMain');
                                break;
                            case UserRole.User:
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
    }, [username, password, rememberMe, history, setUser /*hashPassword*/]);

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const buttonClass = useMemo(() => `
        group relative w-full flex justify-center py-2 px-4 border border-transparent 
        text-sm font-medium rounded-md text-white bg-indigo-600 
        hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-indigo-500 transition duration-150 ease-in-out 
        transform hover:scale-105 // 添加这一行来实现悬停时放大效果
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    `, [isLoading]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* 背景图案 */}
            <div className="absolute inset-0 z-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                    <path d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/>
                </svg>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl relative z-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome to Socratic
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to continue your review work
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                <svg fill="#2563eb" height="18px" width="18px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                     viewBox="0 0 480 480" xmlSpace="preserve">
                                    <g>
                                        <g>
                                            <g>
                                                <path d="M158.801,223.903c2.594,9.058,10.898,32.088,31.182,46.224l-0.3,15.949c-19.329,6.437-74.239,25.182-97.5,37.935
                                                    c-2.087,1.144-3.697,2.995-4.541,5.22c-0.788,2.075-19.2,51.253-11.157,88.098c1.003,4.593,5.069,7.867,9.77,7.867h307.266
                                                    c4.699,0,8.764-3.271,9.769-7.861c8.04-36.721-8.996-85.777-9.725-87.847c-0.817-2.32-2.461-4.258-4.617-5.443
                                                    c-23.061-12.669-74.724-31.526-93.284-38.151v-16.052c14.154-14.143,23.933-37.174,27.071-45.224
                                                    c6.943-5.642,25.121-22.62,25.121-45.726c0-16.123-7.03-24.187-15.279-26.985c1.671-18.179,1.728-54.269-19.256-79.817
                                                    c-14.985-18.245-37.465-27.496-66.813-27.496H234.16c-29.349,0-51.804,9.25-66.743,27.493
                                                    c-20.82,25.426-20.763,61.295-19.061,79.569c-8.02,2.698-14.887,10.619-14.887,26.563
                                                    C133.47,200.891,151.386,217.854,158.801,223.903z M318.323,315.551c19.813,7.506,43.223,16.854,57.553,24.199
                                                    c3.205,10.293,11.674,40.538,9.114,65.445H94.817c-2.393-24.93,6.88-55.266,10.302-65.393
                                                    c12.283-6.221,31.848-13.86,50.242-20.576c8.363,8.724,36.747,35.034,76.216,36.632c1.262,0.051,2.522,0.077,3.78,0.077
                                                    c28.445,0,55.919-13.06,81.718-38.861C317.549,316.599,317.964,316.088,318.323,315.551z M154.843,170.583
                                                    c0.075-0.013,0.197-0.027,0.375-0.027c0.449,0,0.889,0.089,1.115,0.147c3.387,1.435,7.058,0.793,9.931-1.52
                                                    c2.905-2.34,4.023-6.202,3.288-9.859c-0.094-0.468-9.151-47.101,13.341-74.568c10.956-13.38,28.206-20.164,51.269-20.164h12.346
                                                    c23.042,0,40.305,6.773,51.31,20.132c22.517,27.332,13.704,74.174,13.615,74.629c-0.709,3.579,0.34,7.35,3.135,9.694
                                                    c2.763,2.317,6.315,3.052,9.681,1.793c0.183-0.039,0.578-0.11,1.043-0.11c0.182,0,0.791,0.015,0.976,0.204
                                                    c0.59,0.604,1.589,2.958,1.589,7.956c0,17.479-19.057,31.241-19.222,31.359c-1.697,1.19-2.985,2.885-3.68,4.838
                                                    c-2.975,8.357-13.4,32.326-25.739,42.739c-2.251,1.9-3.55,4.696-3.55,7.642v27.492c0,4.253,2.69,8.041,6.705,9.442
                                                    c0.204,0.071,6.25,2.186,15.363,5.503c-21.168,19.408-43.061,28.827-65.175,27.974c-25.05-0.956-45.262-14.919-56.019-24.192
                                                    c14.874-5.17,25.816-8.734,26.1-8.827c4.055-1.317,6.829-5.06,6.909-9.323l0.539-28.675c0.069-3.679-1.888-7.099-5.094-8.903
                                                    c-21.355-12.015-27.524-39.679-27.578-39.927c-0.518-2.481-1.985-4.692-4.057-6.151c-0.199-0.14-19.885-14.206-19.885-31.666
                                                    C153.47,172.78,154.578,170.943,154.843,170.583z" />
                                                <path d="M39.993,69.998c5.523,0,10-4.477,10-10V20h40.006c5.523,0,10-4.477,10-10s-4.477-10-10-10H39.993
                                                    c-5.523,0-10,4.477-10,10v49.998C29.993,65.521,34.47,69.998,39.993,69.998z" />
                                                <path d="M440.007,0h-50.006c-5.523,0-10,4.477-10,10s4.477,10,10,10h40.006v39.998c0,5.523,4.477,10,10,10s10-4.477,10-10V10
                                                    C450.007,4.477,445.53,0,440.007,0z" />
                                                <path d="M89.999,460H49.993v-39.998c0-5.523-4.477-10-10-10c-5.523,0-10,4.477-10,10V470c0,5.523,4.477,10,10,10h50.006
                                                    c5.523,0,10-4.477,10-10S95.522,460,89.999,460z" />
                                                <path d="M440.007,410.002c-5.523,0-10,4.477-10,10V460h-40.006c-5.523,0-10,4.477-10,10s4.477,10,10,10h50.006
                                                    c5.523,0,10-4.477,10-10v-49.998C450.007,414.479,445.53,410.002,440.007,410.002z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
                                <svg fill="#2563eb" height="18px" width="18px" version="1.1" id="Layer_1"
                                     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                     viewBox="0 0 485.017 485.017" xmlSpace="preserve">
                                    <g>
                                        <path d="M361.205,68.899c-14.663,0-28.447,5.71-38.816,16.078c-21.402,21.403-21.402,56.228,0,77.631
		                                    c10.368,10.368,24.153,16.078,38.815,16.078s28.447-5.71,38.816-16.078c21.402-21.403,21.402-56.228,0-77.631
		                                    C389.652,74.609,375.867,68.899,361.205,68.899z M378.807,141.394c-4.702,4.702-10.953,7.292-17.603,7.292
		                                    s-12.901-2.59-17.603-7.291c-9.706-9.706-9.706-25.499,0-35.205c4.702-4.702,10.953-7.291,17.603-7.291s12.9,2.589,17.603,7.291
		                                    C388.513,115.896,388.513,131.688,378.807,141.394z" />
                                        <path d="M441.961,43.036C414.21,15.284,377.311,0,338.064,0c-39.248,0-76.146,15.284-103.897,43.036
		                                    c-42.226,42.226-54.491,105.179-32.065,159.698L0.254,404.584l-0.165,80.268l144.562,0.165v-55.722h55.705l0-55.705h55.705v-64.492
                                            l26.212-26.212c17.615,7.203,36.698,10.976,55.799,10.976c39.244,0,76.14-15.282,103.889-43.032
                                            C499.25,193.541,499.25,100.325,441.961,43.036z M420.748,229.617c-22.083,22.083-51.445,34.245-82.676,34.245
                                            c-18.133,0-36.237-4.265-52.353-12.333l-9.672-4.842l-49.986,49.985v46.918h-55.705l0,55.705h-55.705v55.688l-84.5-0.096
                                            l0.078-37.85L238.311,208.95l-4.842-9.672c-22.572-45.087-13.767-99.351,21.911-135.029C277.466,42.163,306.83,30,338.064,30
                                            c31.234,0,60.598,12.163,82.684,34.249C466.34,109.841,466.34,184.025,420.748,229.617z" />
                                    </g>
                                </svg>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => history.push('/Register')}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Register new account
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                             role="alert">
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
                                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                     aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                          clipRule="evenodd" />
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