import Vue from 'vue'
import {Bootstrap, InvoiceCSS} from 'src/global/variables'
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    Bootstrap,
    InvoiceCSS
  ]
}

Vue.use(VueHtmlToPaper, options);
