import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UserMixins extends Vue {
  get isLogin (): boolean {
    return this.$store.getters.isLogin
  }

  logOut (): void {
    this.$store.dispatch('logOut')
      .then(_ => {
        this.$router.push({ name: 'Login' }).catch(err => console.info(err))
      })
      .catch(err => console.info(err))
  }
}
