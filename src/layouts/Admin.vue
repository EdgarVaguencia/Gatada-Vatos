<template>
  <div>
    <AppNav />
    <v-snackbar
      top
      :value="true"
      v-for="(item, index) in notificaciones"
      :key="index"
      :color="item.type"
      @input="destroyNotification(index)"
    >
      {{ item.text }}
    </v-snackbar>
    <v-container
      fluid
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth } from 'firebase/app'
import AppNav from '@/components/AppNav.vue'

@Component({
  components: {
    AppNav
  }
})
export default class Layout extends Vue {
  viewSnack: boolean = false

  created() {
    this.$store.dispatch('getUser')
  }

  get notificaciones() {
    return this.$store.getters.getNotificaciones
  }

  destroyNotification(index) {
    this.$store.dispatch('removeNotificacion', index)
  }
}
</script>
