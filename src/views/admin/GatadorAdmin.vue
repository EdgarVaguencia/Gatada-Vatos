<template>
  <v-container
    fluid
  >
    <v-row
      class="justify-center"
    >
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          label="Filtra temporada"
          :items="temporadas"
          v-model="temporadaSelect"
          item-text="Nombre"
          item-value="Uuid"
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="10"
      >
        <v-list
          flat
        >
          <v-list-item
            v-for="(item, index) in gatadores"
            :key="index"
            :value="item.Uuid"
          >
            <v-list-item-action
              @click="updateActivo(item)"
            >
              <v-icon
                v-if="item.Activo"
              >
                star
              </v-icon>
              <v-icon
                v-else
              >
                star_outline
              </v-icon>
            </v-list-item-action>
            <v-list-item-avatar>
              <v-img
                :src="item.Imagen"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.Nombre"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-if="!item.Activo"
              >== RIP ==</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                @click="editGatador(item.Uuid)"
              >
                <v-icon>create</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-btn
          fab
          bottom
          right
          fixed
          large
          @click="dialog = true"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title
            v-text="tituloDialog"
          ></v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  label="Nombre"
                  v-model="gatador.Nombre"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  label="Url img"
                  v-model="gatador.Imagen"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col
                cols="4"
              >
                <v-text-field
                  label="Twitter"
                  v-model="gatador.Redes.Twitter"
                ></v-text-field>
              </v-col>
              <v-col
                cols="4"
              >
                <v-text-field
                  label="Instagram"
                  v-model="gatador.Redes.Instagram"
                ></v-text-field>
              </v-col>
              <v-col
                cols="4"
              >
                <v-text-field
                  label="YouTube"
                  v-model="gatador.Redes.Youtube"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col>
                <v-autocomplete
                  multiple
                  chips
                  label="Temporadas"
                  v-model="gatador.Temporadas"
                  :items="temporadas"
                  item-text="Nombre"
                  item-value="Uuid"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col
                cols="12"
              >
                <v-switch
                  v-model="gatador.Activo"
                  label="Activo"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="error"
              @click="closeDialog"
            >
              Cancelar
            </v-btn>
            <v-btn
              text
              color="success"
              :loading="isLoading"
              @click="saveGatador"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { gatadorType, sedeType } from '@/typings'
import { compile } from 'vue/types/umd'

@Component
export default class GatadorAdmin extends Vue {
  dialog:boolean = false
  isLoading:boolean = false
  tituloDialog: string = 'Nuevo Gatador'
  temporadaSelect:string = ''
  temporadasGatador:string[] = []
  activos:string[] = []
  gatadores:gatadorType[] = []
  gatador:gatadorType = {
    Nombre: '',
    Imagen: '',
    Redes: {},
    Temporadas: []
  }

  get getGatadores():gatadorType[] {
    return this.$store.getters.getGatadores
  }

  get temporadas():sedeType[] {
    return this.$store.getters.getSedes
  }

  @Watch('getGatadores', { immediate:true })
  updateListGatadores() {
    this.gatadores = this.getGatadores
    if (this.temporadaSelect.length > 0) this.filtroTemporada(this.temporadaSelect,'')
  }

  @Watch('temporadaSelect')
  filtroTemporada(value:string, oldValue:string) {
    if (value.length > 0) {
      this.gatadores = this.getGatadores.filter(g => {
        return g.Temporadas.indexOf(value) >= 0
      })
      return
    }
    this.gatadores = this.getGatadores
  }

  updateActivo(gatador:gatadorType) {
    let changeGatador = gatador
    changeGatador.Activo = !gatador.Activo
    this.$store.dispatch('updateGatador', changeGatador)
      .then(complete => {
        console.info('Actualizado activos')
      })
  }

  closeDialog () {
    this.dialog = false
    this.gatador = {
      Nombre: '',
      Imagen: '',
      Redes: {},
      Temporadas: []
    }
    this.tituloDialog = 'Nuevo Gatador'
  }

  editGatador(idGatador:string) {
    this.gatador = this.gatadores.find(g => g.Uuid === idGatador)
    if (this.gatador) {
      this.dialog = true
      this.tituloDialog = 'Edita Gatador #' + this.gatador.Id
      if (!this.gatador.Redes) this.gatador.Redes = {}
      if (!this.gatador.Temporadas) this.gatador.Temporadas = []
    }
  }

  saveGatador() {
    this.isLoading = true
    if (this.gatador.Id) {
      this.$store.dispatch('updateGatador', this.gatador)
        .then(complete => {
          this.isLoading = false
          this.closeDialog()
        })
    } else {
      this.isLoading = true
      this.$store.dispatch('saveGatador', {
        Id: this.getGatadores.length + 1,
        Nombre: this.gatador.Nombre,
        Imagen: this.gatador.Imagen,
        Activo: true,
        Redes: this.gatador.Redes,
        Temporadas: this.gatador.Temporadas
      }).then(complete => {
        this.isLoading = false
        this.closeDialog()
      })
    }
  }
}
</script>
