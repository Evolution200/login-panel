import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../Style/User/UserInfo.css';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';

interface UserInfoData {
    user_name: string;
    sur_name: string;
    last_name: string;
    institute: string;
    expertise: string;
    email: string;
}

const userProperties: (keyof UserInfoData)[] = ['user_name', 'sur_name', 'last_name', 'institute', 'expertise', 'email'];

const propertyDisplayNames: Record<keyof UserInfoData, string> = {
    user_name: 'Username',
    sur_name: 'First name',
    last_name: 'Last Name',
    institute: 'Institute',
    expertise: 'Expertise',
    email: 'Email'
};

export function UserInfoPage() {
    const history = useHistory();
    const { username, clearUser } = useUserStore();
    const [userInfo, setUserInfo] = useState<Partial<UserInfoData>>({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadUserInfo();
    }, []);

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const loadUserInfo = async () => {
        try {
            const infoPromises = userProperties.map(property =>
                SendPostRequest(new UserReadInfoMessage(username, property))
            );
            const results = await Promise.all(infoPromises);

            const newUserInfo: Partial<UserInfoData> = {};
            results.forEach((result, index) => {
                if (result && result.data) {
                    newUserInfo[userProperties[index]] = result.data;
                }
            });

            setUserInfo(newUserInfo);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load user info:', error);
            setErrorMessage('Failed to load user information. Please try again later.');
        }
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
                        <li onClick={() => history.push("/UserMain")}>MainPage</li>
                        <li>User Information</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>User Information</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {Object.keys(userInfo).length > 0 ? (
                    <table className="user-info-table">
                        <tbody>
                        {userProperties.map(prop => (
                            <tr key={prop}>
                                <th>{propertyDisplayNames[prop]}</th>
                                <td>{userInfo[prop] || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading user information...</p>
                )}
            </main>
        </div>
    );
}