<template>
  <div id="q-app" class="home-view">
    <q-layout view="hHh lpR fFf">
      <q-header></q-header>
      <q-drawer></q-drawer>
      <q-page-container class="q-ml-md q-mt-md">
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>

import Drawer from "components/app/Drawer";
import Header from "components/app/Header";

export default {
  name: 'App',
  components: {
    'q-drawer': Drawer,
    'q-header': Header
  }
}
</script>
