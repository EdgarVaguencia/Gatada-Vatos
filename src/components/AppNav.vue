<template>
  <div>
    <v-app-bar
      app
    >
      <template
        v-if="isLogin"
      >
        <v-app-bar-nav-icon
          class="hidden-md-and-up"
          @click="draw=true"
        >
          <v-icon>menu</v-icon>
        </v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <template
       v-if="isLogin"
    >
      <v-navigation-drawer
        app
        v-model="draw"
        :temporary="isTemporary"
        :expand-on-hover="expandHover"
        :permanent="isPermanent"
      >
        <v-list>
          <v-list-item
            link
            :to="{ name: 'AdminGatadores'}"
          >
            <v-list-item-icon>
              <v-icon>directions_walk</v-icon>
            </v-list-item-icon>
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
            <v-list-item-icon>
              <v-icon>connect_without_contact</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Gatadas
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            link
            :to="{ name: 'AdminTemporada'}"
          >
            <v-list-item-icon>
              <v-icon>military_tech</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Temporadas
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
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import UserMixins from '@/mixins/userMixins'

@Component
export default class AppNav extends Mixins(UserMixins) {
  draw: boolean = false
  isTemporary: boolean = true
  expandHover: boolean = false
  isPermanent: boolean = false

  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize, { passive: true })
  }

  beforeDestroy() {
    window.addEventListener('resize', this.resize, { passive: true })
  }

  resize() {
    if (window.innerWidth < 960) {
      this.isTemporary = true
      this.expandHover = false
      this.isPermanent = false
    } else {
      this.isTemporary = false
      this.expandHover = true
      this.isPermanent = true
    }
  }
}
</script>
