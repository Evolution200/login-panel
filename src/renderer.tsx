import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { SuperuserMainPage } from 'Pages/Superuser/SuperuserMainPage';
import { LoginPage } from 'Pages/Shared/LoginPage';
import { RegisterPage } from 'Pages/Shared/RegisterPage';
import { SuperuserManagementPage } from 'Pages/Superuser/SuperuserManagementPage';
import { ManagerMainPage } from 'Pages/Manager/ManagerMainPage'
import { ManagerManagementPage } from 'Pages/Manager/ManagerManagementPage';
import { EditorMainPage } from 'Pages/Editor/EditorMainPage'
import { UserMainPage } from 'Pages/User/UserMainPage'
import { UserInfoPage} from 'Pages/User/UserInfoPage'
import { EditorInfoPage } from 'Pages/Editor/EditorInfoPage'
import { PeriodicalList } from 'Pages/Manager/PeriodicalList'
import { UserSubmitArticle} from 'Pages/User/UserSubmitArticle'
import { UserPersonalArticlePage } from 'Pages/User/UserPersonalArticleList'
import './index.css';
import { ArticleLogPage } from 'Pages/Shared/ArticleLogPage'

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
                <Route path="/ManagerMain/PeriodicalList" exact component={PeriodicalList} />
                <Route path="/EditorMain" exact component={EditorMainPage} />
                <Route path="/EditorMain/EditorInfo" exact component={EditorInfoPage} />
                <Route path="/UserMain" exact component={UserMainPage} />
                <Route path="/UserMain/UserInfo" exact component={UserInfoPage} />
                <Route path="/UserMain/UserSubmitArticle" exact component={UserSubmitArticle} />
                <Route path="/UserMain/UserPersonalPeriodical" exact component={UserPersonalArticlePage} />
                <Route path="/article-log/:taskName" component={ArticleLogPage} />
            </Switch>
        </HashRouter>
    );
};

render(<Layout />, document.getElementById('root'));
