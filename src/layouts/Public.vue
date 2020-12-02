<template>
  <v-app
    id="publica"
  >
    <AppNavPublic />
    <v-main
      class="mdc-top-app-bar--fixed-adjust mdc-layout-grid"
    >
      <transition
        name="slide-fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </v-main>
    <v-footer
      padless
    >
      <v-col
        cols="12"
      >2020 / <a href="https://github.com/EdgarVaguencia/Gatada-Vatos" target="_blank">GitHub</a></v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AppNavPublic from '@/components/AppNavPublic.vue'

@Component({
  components: {
    AppNavPublic
  }
})
export default class App extends Vue {}
</script>

<style lang="stylus">
body
  margin 0
  padding 0

div
  margin 0
  padding 0

#publica
  background-color #1c1c1c
  -moz-osx-font-smoothing grayscale
  -webkit-font-smoothing antialiased
  font-family Avenir, Helvetica, Arial, sans-serif
  text-align center
  color #c1c1c1
</style>
