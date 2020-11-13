<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row
      justify="center"
    >
      <v-col
        v-if="isLogin"
        cols="12"
        sm="2"
      >
        <v-btn
          @click="logOut"
        >Salir</v-btn>
      </v-col>
      <v-col
        v-else
        cols="12"
        md="6"
      >
        <v-text-field
          label="Correo"
          v-model="email"
        ></v-text-field>
        <v-text-field
          label="Password"
          v-model="password"
          :type="showPsw ? 'text' : 'password'"
          :append-icon="showPsw ? 'visibility' : 'visibility_off'"
          @click:append="showPsw = !showPsw"
          @keydown="login"
        ></v-text-field>
        <v-btn
          :loading="isLoading"
          @click="login"
        >Entrar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import UserMixins from '@/mixins/userMixins'

@Component
export default class Login extends Mixins(UserMixins) {
  email: string = ''
  password: string = ''
  showPsw: boolean = false
  isLoading:boolean = false

  login(evt = null) {
    if(evt && (evt.type === 'keydown' && evt.keyCode !== 13)) return
    if (this.email.length === 0 || this.password.length === 0) return
    this.isLoading = true
    this.$store.dispatch('logIn', { email: this.email, password: this.password })
      .then(complete => {
        this.isLoading = false
        if (complete) {
          this.email = ''
          this.password = ''
        }
      })
  }
}
</script>