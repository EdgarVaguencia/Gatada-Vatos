<template>
  <v-app-bar
    app
  >
    <v-spacer></v-spacer>
    <template
      v-for="(item, index) in sedes"
    >
      <v-btn
        text
        :key="index"
      >
        {{ item.Nombre }}
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppNavPublic extends Vue {
  get sedes() {
    return this.$store.getters.getSedes.filter(s => s.Actual)
  }
}
</script>

<style lang="stylus" scoped>
.theme--light.v-app-bar.v-toolbar.v-sheet
  background-color #272727

.v-btn
  color #fff
</style>
