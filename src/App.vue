<template>
  <v-app>
    <v-main class="mdc-top-app-bar--fixed-adjust mdc-layout-grid">
      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {}
</script>

<style lang="stylus">
body
  margin 0
  padding 0

div
  margin 0
  padding 0
</style>
