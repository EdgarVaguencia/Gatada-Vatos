<template>
  <div>
    <v-app-bar
      app
    >
      <template
        v-if="isLogin"
      >
        <v-app-bar-nav-icon
          @click="draw=true"
        >
          <v-icon>menu</v-icon>
        </v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      app
      temporary
      v-model="draw"
    >
      <v-list>
        <v-list-item
          link
          :to="{ name: 'AdminGatadores'}"
        >
          <v-list-item-content>
            <v-list-item-title>
              Gatadores
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          :to="{ name: 'AdminGatadas'}"
        >
          <v-list-item-content>
            <v-list-item-title>
              Gatadas
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="logOut"
        >
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Salir
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import UserMixins from '@/mixins/userMixins'

@Component
export default class AppNav extends Mixins(UserMixins) {
  draw: boolean = false
}
</script>
