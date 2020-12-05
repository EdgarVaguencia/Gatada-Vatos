<template>
  <v-app-bar
    app
  >
    <v-spacer></v-spacer>
    <template
      v-for="(item, index) in temporadas"
    >
      <router-link
        :key="index"
        :to="{ name: 'Temporada', params: { temporada: temporadaLink(item.Nombre) }}"
      >
        <v-btn
          text
        >
          {{ item.Nombre }}
        </v-btn>
      </router-link>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppNavPublic extends Vue {
  get temporadas() {
    return this.$store.getters.getTemporadas
  }

  temporadaLink(name:string) {
    if (!name) return ''
    return name.replaceAll(' ', '-')
  }
}
</script>

<style lang="stylus" scoped>
a
  text-decoration none

.theme--light.v-app-bar.v-toolbar.v-sheet
  background-color #272727

.v-btn
  color #fff
</style>
