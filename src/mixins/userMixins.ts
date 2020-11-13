import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UserMixins extends Vue {
  get isLogin() {
    return this.$store.getters.isLogin
  }

  logOut() {
    this.$store.dispatch('logOut')
      .then(() => {
        this.$router.push({ name: 'Login' }).catch(err => {})
      })
  }
}
