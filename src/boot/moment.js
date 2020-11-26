import Vue from 'vue'
import axios from "axios";
import {axiosInstance} from "boot/axios";

const moment = require('moment')
require('moment/locale/sl')

Vue.use(require('vue-moment'), {
  moment
})
