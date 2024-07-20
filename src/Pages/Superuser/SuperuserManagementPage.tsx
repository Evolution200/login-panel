import React from 'react';
import { SuperuserLayout } from './SuperuserLayout';
import { ReadTasksMessage } from 'Plugins/SuperuserAPI/ReadTasksMessage';
import { FinishManagerMessage } from 'Plugins/SuperuserAPI/FinishManagerMessage';
import { ApplicationManagementPage } from '../../Common/ApplicationManagement';

export function SuperuserManagementPage() {
    return (
        <ApplicationManagementPage
            Layout={SuperuserLayout}
            ReadTasksMessage={ReadTasksMessage}
            FinishMessage={FinishManagerMessage}
            pageTitle="Manager Applications"
            currentPage="management"
        />
    );
}