import Vue from 'vue'
import Vuex from 'vuex'

import auth from "src/store/modules/auth";
import general from "src/store/modules/general";
import invoices from "src/store/modules/invoices";
import users from "src/store/modules/users";
import customers from "src/store/modules/customers";
import post from "src/store/modules/post";
import klavzule from "src/store/modules/klavzule";
import final from "src/store/modules/final";
import company from "src/store/modules/company";
import statistics from "src/store/modules/statistics";
import months from "src/store/modules/months";
import employees from "src/store/modules/employees";
import sklad from "src/store/modules/sklad"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    general,
    invoices,
    users,
    customers,
    post,
    klavzule,
    final,
    company,
    statistics,
    months,
    employees,
    sklad
  }
})

export default store
