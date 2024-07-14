import React, { useState, useEffect } from 'react';
import { usePeriodicalStore } from '../../Store/PeriodicalStore';
import { AddPeriodicalMessage } from 'Plugins/ManagerAPI/AddPeriodicalMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { ManagerLayout } from './ManagerLayout';

export function PeriodicalList() {
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
        <ManagerLayout currentPage="periodical">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Periodical List</h2>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {!loading && !error && (
                <table className="min-w-full divide-y divide-gray-200 mb-8">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editors</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {periodicals.map((periodical, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{periodical.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {periodical.editors.length > 0 ? periodical.editors.join(', ') : 'No editors'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Periodical</h3>
                <form onSubmit={handleAddPeriodical} className="space-y-4">
                    <div>
                        <label htmlFor="newPeriodicalName" className="block text-sm font-medium text-gray-700">Periodical Name:</label>
                        <input
                            type="text"
                            id="newPeriodicalName"
                            value={newPeriodicalName}
                            onChange={(e) => setNewPeriodicalName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{successMessage}</span>
                        </div>
                    )}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Periodical
                    </button>
                </form>
            </div>
        </ManagerLayout>
    );
}