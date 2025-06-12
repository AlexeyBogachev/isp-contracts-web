import React from 'react';
import StaffLayout from '../layouts/staff/Layout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import EmployeeHomePage from '../features/staff/menu/MenuPage';
import NewApplicationsPage from '../features/staff/applications/new/NewApplicationsPage';
import HistoryApplicationsPage from '../features/staff/applications/history/HistoryApplicationsPage';
import ContractsLegalEntitiesPage from '../features/staff/contracts/legal-entities/ContractsLegalEntitiesPage';
import ContractsNaturalPersonsPage from '../features/staff/contracts/natural-persons/ContractsNaturalPersonsPage';
import UserRegistrationPage from '../features/staff/user/register/UserRegistrationPage';
import ViewUsersPage from '../features/staff/user/view/ViewUsersPage';
import CreateApplicationPage from '../features/staff/user/create-application/CreateApplicationPage';

const STAFF_ROUTES = {
  MENU: '/menu',
  NEW_APPLICATIONS: '/new-applications',
  HISTORY_APPLICATIONS: '/history-applications',
  CONTRACTS_LEGAL_ENTITIES: '/contract-management-legal-entities',
  CONTRACTS_NATURAL_PERSONS: '/contract-management-natural-persons',
  USER_REGISTRATION: '/user-registration',
  VIEW_USERS: '/view-users',
  CREATE_APPLICATION: '/create-application',
};

const ROLES = {
  EMPLOYEE: 'employee',
};


const withStaffProtection = (component) => (
  <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
    <StaffLayout>{component}</StaffLayout>
  </ProtectedRoute>
);


export const staffRoutes = [
  {
    path: STAFF_ROUTES.MENU,
    element: withStaffProtection(<EmployeeHomePage />)
  },
  {
    path: STAFF_ROUTES.NEW_APPLICATIONS,
    element: withStaffProtection(<NewApplicationsPage />)
  },
  {
    path: STAFF_ROUTES.HISTORY_APPLICATIONS,
    element: withStaffProtection(<HistoryApplicationsPage />)
  },
  {
    path: STAFF_ROUTES.CONTRACTS_LEGAL_ENTITIES,
    element: withStaffProtection(<ContractsLegalEntitiesPage />)
  },
  {
    path: STAFF_ROUTES.CONTRACTS_NATURAL_PERSONS,
    element: withStaffProtection(<ContractsNaturalPersonsPage />)
  },
  {
    path: STAFF_ROUTES.USER_REGISTRATION,
    element: withStaffProtection(<UserRegistrationPage />)
  },
  {
    path: STAFF_ROUTES.VIEW_USERS,
    element: withStaffProtection(<ViewUsersPage />)
  },
  {
    path: STAFF_ROUTES.CREATE_APPLICATION,
    element: withStaffProtection(<CreateApplicationPage />)
  }
]; 