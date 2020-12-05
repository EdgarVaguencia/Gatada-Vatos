<template>
  <v-container
    fluid
    id="home"
    class="fill-height"
  >
    <v-row
      class="justify-center"
    >
      <v-col
        cols="10"
        id="header"
      >
      </v-col>
    </v-row>
    <v-row
      id="content"
    >
      <v-col
        cols="3"
        class="d-none d-md-block"
      >
        <v-card
          dark
          elevation="0"
        >
          <v-img
            :src="imgSelect"
            class="white--text align-end"
            :class="{ grey: !gatadorActivo }"
          >
            <v-card-title
              v-text="nameSelect"
              class="gatadorName"
            ></v-card-title>
          </v-img>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="9"
        class="d-flex align-content-end flex-wrap justify-center"
      >
        <v-card
          dark
          v-for="(g, i) in gatadores"
          :key="i"
          @mouseover="updateGatador(i)"
        >
          <router-link
            :to="{ name: 'Gatador', params: { id: g.Id, temporada: temporadaLink }}"
          >
            <v-avatar
              tile
              class="ma-1"
              size="110"
              :class="{ grey: !g.Activo }"
            >
              <v-img
                :src="g.Imagen"
              ></v-img>
            </v-avatar>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { gatadaType, gatadorType, temporadaType } from '@/typings'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  metaInfo () {
    return {
      title: 'Gatada de Vatos'
    }
  }
})
export default class Home extends Vue {
  selectGatador:number = 0
  gatadores:gatadorType[] = []

  get getGatadores():gatadorType[] {
    return this.$store.getters.getGatadores
  }

  get imgSelect():string {
    if (this.gatadores.length > 0) return this.gatadores[this.selectGatador].Imagen
    return ''
  }

  get nameSelect():string {
    let name = this.gatadores[this.selectGatador] ? this.gatadores[this.selectGatador].Nombre : ''

    if (this.gatadores[this.selectGatador] && !this.gatadores[this.selectGatador].Activo) name += ' / == RIP =='

    return name
  }

  get gatadorActivo():boolean {
    if (this.gatadores.length > 0) {
      return this.gatadores[this.selectGatador].Activo
    }
    return false
  }

  get temporadaSelect():temporadaType {
    return this.$store.getters.getTemporada
  }

  get temporadaLink() {
    return this.temporadaSelect.Nombre.replaceAll(' ', '-')
  }

  @Watch('getGatadores', { immediate:true })
  updateListaGatadores() {
    let temporada:string = this.temporadaSelect ? this.temporadaSelect.Uuid : ''

    this.gatadores = this.getGatadores.filter(g => {
      return g.Temporadas.indexOf(temporada) >= 0
    })
  }

  @Watch('$route', { immediate:true })
  beforeRouteUpdate(to, from) {
    this.$store.dispatch('setTemporada', to.params.temporada)
      .then(_ => {
        this.selectGatador = 0
        this.updateListaGatadores()
      })
  }

  updateGatador(index:any) {
    this.selectGatador = index
  }
}
</script>

<style lang="stylus" scoped>
#header
  background-image url('../assets/header.png')
  background-position center
  height 400px

.gatadorName
  background rgba(0,0,0,.3)

.grey
  filter grayscale(2)
  &.v-avatar::after
    color red
    content "RIP"
    font-size 2rem
    position absolute
    top 25%
</style>
