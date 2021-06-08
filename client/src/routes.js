import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { OrganizationsPage } from './pages/OrganizationsPage'
import { OrganizationPage } from './pages/OrganizationPage'
import { GroupsPage } from './pages/GroupsPage'
import { GroupPage } from './pages/GroupPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { ProgramPage } from './pages/ProgramPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { ResultPage } from './pages/ResultPage'
import { DetailingPage } from './pages/DetailingPage'
import { UserPage } from './pages/UserPage'
import { AuthPage } from './pages/AuthPage'
import { UsersPage } from './pages/UsersPage'
import { HomePage } from './pages/user/HomePage'
import { CoursePage } from './pages/user/CoursePage'
import { QuizPage } from './pages/user/QuizPage'

export const useRoutes = (isAuthenticated, privileges) => {
  if (isAuthenticated && privileges !== '1') {
    return (
      <Switch>
        <Route path="/dashboard" exact>
          <DashboardPage />
        </Route>
        <Route path="/users" exact>
          <UsersPage />
        </Route>
        <Route path="/create/user" exact>
          <UserPage />
        </Route>
        <Route path="/user/:_id">
          <UserPage />
        </Route>
        <Route path="/organizations" exact>
          <OrganizationsPage />
        </Route>
        <Route path="/create/organization" exact>
          <OrganizationPage />
        </Route>
        <Route path="/organization/:_id">
          <OrganizationPage />
        </Route>
        <Route path="/groups" exact>
          <GroupsPage />
        </Route>
        <Route path="/create/group" exact>
          <GroupPage />
        </Route>
        <Route path="/group/:_id" exact>
          <GroupPage />
        </Route>
        <Route path="/programs" exact>
          <ProgramsPage />
        </Route>
        <Route path="/create/program" exact>
          <ProgramPage />
        </Route>
        <Route path="/program/:_id" exact>
          <ProgramPage />
        </Route>
        <Route path="/questions/:_id" exact>
          <QuestionsPage />
        </Route>
        <Route path="/result" exact>
          <ResultPage />
        </Route>
        <Route path="/result/:groupID/:programID/:userID/:attempt">
          <DetailingPage />
        </Route>
        <Redirect to="/dashboard" />
      </Switch>
    )
  }

  if (isAuthenticated && privileges === '1') {
    return (
      <Switch>
        <Route path="/home" exact>
          <HomePage />
        </Route>
        <Route path="/program/:_id">
          <CoursePage />
        </Route>
        <Route path="/quiz/:groupID/:programID">
          <QuizPage />
        </Route>
        <Redirect to="/home" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/">
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
