import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../Style/EditorInfo.css';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';
import { SendPostRequest } from '../Common/SendPost';
import { useUserStore } from '../Store/UserStore';

interface EditorInfoData {
    user_name: string;
    sur_name: string;
    last_name: string;
    institute: string;
    expertise: string;
    email: string;
    periodical: string;
}

const editorProperties: (keyof EditorInfoData)[] = ['user_name', 'sur_name', 'last_name', 'institute', 'expertise', 'email', 'periodical'];

const propertyDisplayNames: Record<keyof EditorInfoData, string> = {
    user_name: 'Username',
    sur_name: 'First Name',
    last_name: 'Last Name',
    institute: 'Institute',
    expertise: 'Expertise',
    email: 'Email',
    periodical: 'Periodical'
};

export function EditorInfoPage() {
    const history = useHistory();
    const { username, clearUser } = useUserStore();
    const [editorInfo, setEditorInfo] = useState<Partial<EditorInfoData>>({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadEditorInfo();
    }, []);

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const loadEditorInfo = async () => {
        try {
            const infoPromises = editorProperties.map(property =>
                SendPostRequest(new EditorReadInfoMessage(username, property))
            );
            const results = await Promise.all(infoPromises);

            const newEditorInfo: Partial<EditorInfoData> = {};
            results.forEach((result, index) => {
                if (result && result.data) {
                    newEditorInfo[editorProperties[index]] = result.data;
                }
            });

            setEditorInfo(newEditorInfo);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load editor info:', error);
            setErrorMessage('Failed to load editor information. Please try again later.');
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
                        <li onClick={() => history.push("/EditorMain")}>MainPage</li>
                        <li>Editor Information</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>Editor Information</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {Object.keys(editorInfo).length > 0 ? (
                    <table className="editor-info-table">
                        <tbody>
                        {editorProperties.map(prop => (
                            <tr key={prop}>
                                <th>{propertyDisplayNames[prop]}</th>
                                <td>{editorInfo[prop] || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading editor information...</p>
                )}
            </main>
        </div>
    );
}