<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col
        cols=12
        class="d-flex"
      >
        <router-link
          :to="{ name: 'Home'}"
        >
          <v-icon
            large
            color="white"
          >keyboard_backspace</v-icon>
        </router-link>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          class="pa-sm-1"
          color="grey lighten-3"
          v-if="gatador"
        >
          <v-row
            class="d-flex flex-wrap justify-space-between"
          >
            <v-col
              cols="12"
              sm="8"
              md="4"
            >
              <v-avatar
                rounded
                size="250"
              >
                <v-img :src="gatador.Imagen"></v-img>
              </v-avatar>
              <v-row
                class="justify-center"
              >
                <v-col
                  cols="4"
                >
                  <v-avatar
                    v-if="gatador.Redes.Twitter"
                  >
                    <v-tooltip
                      top
                    >
                      <template
                        v-slot:activator="{ on, attrs }"
                      >
                        <v-img
                          v-bind="attrs"
                          v-on="on"
                          max-width="50"
                          max-height="50"
                          src="https://img.icons8.com/color/72/twitter.png"
                          @click="openRedSocial('twitter')"
                          :alt="gatador.Redes.Twitter"
                        ></v-img>
                      </template>
                      <span>@{{ gatador.Redes.Twitter }}</span>
                    </v-tooltip>
                  </v-avatar>
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-avatar
                    v-if="gatador.Redes.Instagram"
                  >
                    <v-tooltip
                      top
                    >
                      <template
                        v-slot:activator="{ on, attrs }"
                      >
                        <v-img
                          v-bind="attrs"
                          v-on="on"
                          max-width="50"
                          max-height="50"
                          src="https://img.icons8.com/fluent/2x/instagram-new.png"
                          :alt="gatador.Redes.Instagram"
                          @click="openRedSocial('instagram')"
                        ></v-img>
                      </template>
                      <span>@{{ gatador.Redes.Instagram }}</span>
                    </v-tooltip>
                  </v-avatar>
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-avatar
                    v-if="gatador.Redes.Youtube"
                  >
                    <v-tooltip
                      top
                    >
                      <template
                        v-slot:activator="{ on, attrs }"
                      >
                        <v-img
                          v-bind="attrs"
                          v-on="on"
                          max-width="50"
                          max-height="50"
                          src="https://img.icons8.com/color/2x/youtube.png"
                          :alt="gatador.Redes.Youtube"
                          @click="openRedSocial('youtube')"
                        ></v-img>
                      </template>
                      <span>{{ gatador.Redes.Youtube }}</span>
                    </v-tooltip>
                  </v-avatar>
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="3"
              sm="4"
            >
              <v-card-title
                class="headline"
                v-text="gatador.Nombre"
              ></v-card-title>
              <v-list
                color="grey lighten-3"
              >
                <v-list-item>Gatadas: {{ numGatadas }}</v-list-item>
                <v-list-item>Victorias: {{ numGatadasVictoria }}</v-list-item>
                <v-list-item>Derrotas: {{ numGatadasDerrota }}</v-list-item>
                <v-list-item>Puntos: {{ puntosGatador }}</v-list-item>
              </v-list>
            </v-col>
            <v-col
              class="flex-sm-grow-1 flex-shrink-0"
            >
              <v-simple-table
                fixed-header
              >
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th
                      class="text-center"
                    >Vs</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(gatada, index) in gatadas"
                    :key="index"
                  >
                    <td>{{ gatada.Jornada }}</td>
                    <td>
                      <v-avatar>
                        <v-img
                          :src="imgGatador(gatada.PrimerGatador)"
                        ></v-img>
                      </v-avatar>
                    </td>
                    <td>{{gatada.Resultado.PrimerGatador}} - {{gatada.Resultado.SegundoGatador}}</td>
                    <td>
                      <v-avatar>
                        <v-img
                          :src="imgGatador(gatada.SegundoGatador)"
                        ></v-img>
                      </v-avatar>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { gatadorType } from '@/typings'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  metaInfo () {
    return {
      title: 'Gatador :: ' + this.gatador.Nombre
    }
  }
})
export default class Gatador extends Vue {
  get gatador ():gatadorType {
    return this.$store.getters.getGatador()
  }

  get gatadas () {
    return this.$store.getters.getGatadas(this.gatador.Id)
      .sort((a, b) => {
        return new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      })
  }

  get numGatadas () {
    return this.$store.getters.getNumGatadas
  }

  get numGatadasVictoria () {
    return this.$store.getters.getNumGatadasVictoria
  }

  get numGatadasDerrota () {
    return this.$store.getters.getNumGatadasDerrota
  }

  get puntosGatador() {
    return this.$store.getters.getPuntosGatador
  }

  imgGatador (idGatador:number) {
    let gatador = this.$store.getters.getGatador(idGatador)
    return gatador.Imagen
  }

  openRedSocial (redSocial:string) {
    let url = ''
    switch(redSocial) {
      case 'twitter':
        url = 'https://twitter.com/' + this.gatador.Redes.Twitter
        break
      case 'instagram':
        url = 'https://www.instagram.com/' + this.gatador.Redes.Instagram
        break
      case 'youtube':
        url = 'https://www.youtube.com/results?search_query=' + this.gatador.Redes.Youtube
        break
      default:
        url = 'https://duckduckgo.com/?q=' + this.gatador.Nombre
        break
    }
    window.open(url,'_blank')
  }
}
</script>