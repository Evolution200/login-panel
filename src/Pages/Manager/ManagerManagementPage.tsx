import React from 'react';
import { ManagerLayout } from './ManagerLayout';
import { ReadTasksMessage } from 'Plugins/ManagerAPI/ReadTasksMessage';
import { FinishEditorMessage } from 'Plugins/ManagerAPI/FinishEditorMessage';
import { ApplicationManagementPage } from '../../Common/ApplicationManagement';

export function ManagerManagementPage() {
    return (
        <ApplicationManagementPage
            Layout={ManagerLayout}
            ReadTasksMessage={ReadTasksMessage}
            FinishMessage={FinishEditorMessage}
            pageTitle="Editor Applications"
            currentPage="management"
        />
    );
}