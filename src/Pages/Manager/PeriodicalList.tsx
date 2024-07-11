import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../Style/Manager/PeriodicalList.css';
import { useUserStore } from '../../Store/UserStore';
import { usePeriodicalStore } from '../../Store/PeriodicalStore';
import { AddPeriodicalMessage } from 'Plugins/ManagerAPI/AddPeriodicalMessage';
import { SendPostRequest } from '../../Common/SendPost';

export function PeriodicalList() {
    const history = useHistory();
    const { username, role, clearUser } = useUserStore();
    const { periodicals, error, loading, fetchPeriodicals, fetchEditors, setError } = usePeriodicalStore();
    const [newPeriodicalName, setNewPeriodicalName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadPeriodicalsAndEditors();
    }, []);

    const loadPeriodicalsAndEditors = async () => {
        await fetchPeriodicals();
        const { periodicals } = usePeriodicalStore.getState();
        for (const periodical of periodicals) {
            await fetchEditors(periodical.name);
        }
    };

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const handleAddPeriodical = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPeriodicalName.trim()) {
            try {
                const message = new AddPeriodicalMessage(newPeriodicalName.trim());
                const response = await SendPostRequest(message);
                if (response && response.status === 200) {
                    await loadPeriodicalsAndEditors();
                    setNewPeriodicalName('');
                    setSuccessMessage('Periodical added successfully');
                    setTimeout(() => setSuccessMessage(''), 3000);
                } else {
                    throw new Error('Failed to add periodical');
                }
            } catch (error) {
                console.error('Error adding periodical:', error);
                setError('Failed to add periodical. Please try again.');
            }
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
                        <li onClick={() => history.push("/ManagerMain")}>MainPage</li>
                        <li onClick={() => history.push("/ManagerMain/ManagerManagement")}>Authority Management</li>
                        <li>Periodical List</li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <h2>Periodical List</h2>
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <table className="periodical-table">
                        <thead>
                        <tr>
                            <th>Periodical Name</th>
                            <th>Editors</th>
                        </tr>
                        </thead>
                        <tbody>
                        {periodicals.map((periodical, index) => (
                            <tr key={index}>
                                <td>{periodical.name}</td>
                                <td>{periodical.editors.length > 0 ? periodical.editors.join(', ') : 'No editors'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <h3>Add New Periodical</h3>
                <form onSubmit={handleAddPeriodical} className="add-periodical-form">
                    <div className="form-group">
                        <label htmlFor="newPeriodicalName">Periodical Name:</label>
                        <input
                            type="text"
                            id="newPeriodicalName"
                            value={newPeriodicalName}
                            onChange={(e) => setNewPeriodicalName(e.target.value)}
                            required
                        />
                    </div>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit" className="submit-button">Add Periodical</button>
                </form>
            </main>
        </div>
    );
}