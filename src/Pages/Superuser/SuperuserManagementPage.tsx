import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../Style/Superuser/SuperuserManagement.css';
import { Application, fetchApplications } from '../../Common/FetchApplication';
import { FinishManagerMessage } from 'Plugins/SuperuserAPI/FinishManagerMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { ReadTasksMessage } from 'Plugins/SuperuserAPI/ReadTasksMessage';
import { useUserStore } from '../../Store/UserStore';

export function SuperuserManagementPage() {
    const history = useHistory();
    const [applications, setApplications] = useState<Application[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { username, role, clearUser } = useUserStore();

    useEffect(() => {
        loadApplications();
    }, []);

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const loadApplications = async () => {
        try {
            const message = new ReadTasksMessage();
            const data = await fetchApplications(message);
            setApplications(data);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load applications:', error);
            setErrorMessage('Failed to load applications. Please try again later.');
        }
    };

    const sendFinishManagerMessage = async (userName: string, allowed: boolean) => {
        const message = new FinishManagerMessage(userName, allowed);
        try {
            const response = await SendPostRequest(message);
            if (response && response.data) {
                return response.data;
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Failed to send FinishManagerMessage:', error);
            throw error;
        }
    };

    const handleApprove = async (userName: string) => {
        try {
            await sendFinishManagerMessage(userName, true);
            setErrorMessage('');
            await loadApplications(); // 重新加载应用列表
        } catch (error) {
            console.error('Failed to approve application:', error);
            setErrorMessage('Failed to approve application. Please try again later.');
        }
    };

    const handleReject = async (userName: string) => {
        try {
            await sendFinishManagerMessage(userName, false);
            setErrorMessage('');
            await loadApplications(); // 重新加载应用列表
        } catch (error) {
            console.error('Failed to reject application:', error);
            setErrorMessage('Failed to reject application. Please try again later.');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-content">
                    <h1 className="header-title">Socratic</h1>
                    <div className="header-nav">
                        <span className="user-info">Username: {username}</span>
                        <span className="user-info">Current Role: {role}</span>
                        <button className="nav-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </header>
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li onClick={() => history.push("/SuperuserMain")}>MainPage</li>
                        <li>Authority Management</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>Manager Applications</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {applications.length > 0 ? (
                    <table className="manager-table">
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>User Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications.map((application, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{application.userName}</td>
                                <td>
                                    <button onClick={() => handleApprove(application.userName)}>Approve</button>
                                    <button onClick={() => handleReject(application.userName)}>Reject</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No applications available.</p>
                )}
            </main>
        </div>
    );
}