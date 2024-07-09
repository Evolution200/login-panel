import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SuperuserMainPage } from 'Pages/SuperuserMainPage';
import { LoginPage } from 'Pages/LoginPage';
import { RegisterPage } from 'Pages/RegisterPage';
import { SuperuserManagementPage } from 'Pages/SuperuserManagementPage';
import { ManagerMainPage } from 'Pages/ManagerMainPage'
import { ManagerManagementPage } from 'Pages/ManagerManagementPage';
import { EditorMainPage } from 'Pages/EditorMainPage'
import { UserMainPage } from 'Pages/UserMainPage'
import { UserInfoPage} from 'Pages/UserInfoPage'
import { EditorInfoPage } from 'Pages/EditorInfoPage'

const Layout: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={LoginPage} />
                <Route path="/Register" exact component={RegisterPage} />
                <Route path="/SuperuserMain" exact component={SuperuserMainPage} />
                <Route path="/SuperuserMain/SuperuserManagement" exact component={SuperuserManagementPage} />
                <Route path="/ManagerMain" exact component={ManagerMainPage} />
                <Route path="/ManagerMain/ManagerManagement" exact component={ManagerManagementPage} />
                <Route path="/EditorMain" exact component={EditorMainPage} />
                <Route path="/EditorMain/EditorInfo" exact component={EditorInfoPage} />
                <Route path="/UserMain" exact component={UserMainPage} />
                <Route path="/UserMain/UserInfo" exact component={UserInfoPage} />
            </Switch>
        </HashRouter>
    );
};

render(<Layout />, document.getElementById('root'));
