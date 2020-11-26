import Home from "layouts/Home";
import LoginRegister from "src/components/auth/LoginRegister";
import NewPassword from "src/pages/NewPassword";
import Customers from "src/pages/Customers";
import FinalInvoices from "src/pages/FinalInvoices";
import Statistics from "src/pages/Statistics";
import Website from "src/pages/Website";
import Users from "src/pages/Users";
import Company from "src/pages/Company";
import Klavzule from "src/pages/Klavzule";
import Months from "src/pages/Months";

const routes = [
  {
    path: '/',
    component: Home,
    meta: {requiresAuth: true}

  },
  {
    path: '/customers',
    component: Customers,
    meta: {requiresAuth: true}

  },
  {
    path: '/final-invoices',
    component: FinalInvoices,
    meta: {requiresAuth: true}
  },
  {
    path: '/statistics',
    component: Statistics,
    meta: {requiresAuth: true}
  },
  {
    path: '/website',
    component: Website,
    meta: {requiresAuth: true}
  },
  {
    path: '/users',
    component: Users,
    meta: {requiresAuth: true}
  },
  {
    path: '/login-register',
    component: LoginRegister
  },
  {
    path: '/new-password',
    component: NewPassword
  },
  {
    path: '/company',
    component: Company,
    meta: {requiresAuth: true}
  },
  {
    path: '/months',
    component: Months,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/klavzule',
    component: Klavzule,
    meta: {requiresAuth: true}
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
