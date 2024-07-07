import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SuperuserMainPage } from 'Pages/SuperuserMainPage';
import { LoginPage } from 'Pages/LoginPage';
import { RegisterPage } from 'Pages/RegisterPage';
import { SuperuserManagementPage } from 'Pages/SuperuserManagementPage';
import { ManagerMainPage } from 'Pages/ManagerMainPage'
import { ManagerManagementPage } from 'Pages/ManagerManagementPage';

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
            </Switch>
        </HashRouter>
    );
};

render(<Layout />, document.getElementById('root'));
