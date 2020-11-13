<template>
  <v-container
    fluid`
  >
    <v-row
      class="justify-center"
    >
      <v-col
        cols="12"
        md="2"
      >
        <v-autocomplete
          multiple
          clearable
          label="Filtra Gatadas"
          v-model="gatadorSelect"
          :items="gatadores"
          item-text="Nombre"
          item-value="Id"
        >
          <template
            v-slot:selection="data"
          >
            <v-chip
              close
              v-bind="data.attrs"
              :input-value="data.selected"
              @click="data.select"
              @click:close="removeFilter(data.item.Id)"
            >
              <v-avatar left>
                <v-img :src="data.item.Imagen"></v-img>
              </v-avatar>
              {{ data.item.Nombre }}
            </v-chip>
          </template>
          <template
            v-slot:item="data"
          >
            <v-list-item-avatar>
              <img :src="data.item.Imagen">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.Nombre"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col
        cols="12"
      >
        <v-simple-table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Gatador #1</th>
              <th
                class="text-center"
              >Resultado</th>
              <th>Gatador #2</th>
              <th>Jornada</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(gatada, index) in gatadas"
              :key="index"
            >
              <td>
                {{ gatada.Fecha }}
              </td>
              <td>
                <v-avatar
                  @click="sumaMarcador(gatada, 1)"
                >
                  <v-img
                    :src="imgGatador(gatada.PrimerGatador)"
                  ></v-img>
                </v-avatar>
              </td>
              <td>
                {{gatada.Resultado.PrimerGatador}} - {{gatada.Resultado.SegundoGatador}}
              </td>
              <td>
                <v-avatar
                  @click="sumaMarcador(gatada, 2)"
                >
                  <v-img
                    :src="imgGatador(gatada.SegundoGatador)"
                  ></v-img>
                </v-avatar>
              </td>
              <td>{{ gatada.Jornada }}</td>
              <td>
                <v-btn
                  icon
                  @click="editGatador(gatada.Uuid)"
                >
                  <v-icon>create</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
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
            v-text="titulo"
          ></v-card-title>
          <v-card-text>
            <v-menu
              v-model="fechaModal"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fecha"
                  label="Fecha gatada"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha"
                @input="fechaModal = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="jornada"
              label="Jornada #"
            ></v-text-field>
            <v-autocomplete
              v-model="gatador_1"
              label="Gatador 1"
              item-text="Id"
              :items="gatadores"
            >
              <template
                v-slot:selection="data"
              >
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  @click="data.select"
                >
                  <v-avatar left>
                    <v-img :src="data.item.Imagen"></v-img>
                  </v-avatar>
                  {{ data.item.Nombre }}
                </v-chip>
              </template>
              <template
                v-slot:item="data"
              >
                <v-list-item-avatar>
                  <img :src="data.item.Imagen">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.Nombre"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="gatador_2"
              label="Gatador 2"
              item-text="Id"
              :items="gatadores"
            >
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  @click="data.select"
                >
                  <v-avatar left>
                    <v-img :src="data.item.Imagen"></v-img>
                  </v-avatar>
                  {{ data.item.Nombre }}
                </v-chip>
              </template>
              <template
                v-slot:item="data"
              >
                <v-list-item-avatar>
                  <img :src="data.item.Imagen">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.Nombre"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
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
              @click="saveGatada"
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
import { gatadaType, gatadorType } from '@/typings'

@Component
export default class GatadaAdmin extends Vue {
  dialog: boolean = false
  isLoading: boolean = false
  fechaModal: boolean = false
  gatador_1: number = 0
  gatador_2: number = 0
  fecha: string = new Date().toISOString().substr(0, 10)
  titulo:string = 'Nueva Gatada'
  jornada:string = ""
  gatada: gatadaType = null
  gatadas: gatadaType[] = this.getGatadas
  gatadorSelect: number[] = []

  get gatadores(): gatadorType[] {
    return this.$store.getters.getGatadores
  }

  get getGatadas(): gatadaType[] {
    return this.$store.getters.getAllGatadas
      .sort((a, b) => {
        return new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      })
  }

  @Watch('gatadorSelect')
  filterGatadas(value, oldValue) {
    if (this.gatadorSelect.length > 0) {
      this.gatadas = this.getGatadas.filter(g => {
        if (this.gatadorSelect.indexOf(g.PrimerGatador) >= 0 || this.gatadorSelect.indexOf(g.SegundoGatador) >= 0) {
          return g
        }
      })
      return
    }
    this.gatadas = this.getGatadas
  }

  closeDialog() {
    this.titulo = 'Nueva Gatada'
    this.dialog = false
    this.gatada = null
    this.gatador_1 = 0
    this.gatador_2 = 0
    this.fecha = new Date().toISOString().substr(0, 10)
  }

  imgGatador (idGatador:number) {
    let gatador = this.$store.getters.getGatador(idGatador)
    return gatador.Imagen
  }

  saveGatada() {
    this.isLoading = true
    this.$store.dispatch('saveGatada', {
      Uuid: this.gatada ? this.gatada.Uuid : '',
      Fecha: this.fecha,
      Jornada: this.jornada,
      PrimerGatador: this.gatador_1,
      SegundoGatador: this.gatador_2,
      Resultado: {
        PrimerGatador: 0,
        SegundoGatador: 0
      }
    })
      .then(complete => {
        this.isLoading = false
        if (complete) this.closeDialog()
      })
  }

  sumaMarcador(gatadaData:any, gatador:number) {
    this.gatada = gatadaData
    
    if (gatador === 1) {
      this.gatada.Resultado.PrimerGatador += 1
    } else if (gatador === 2) {
      this.gatada.Resultado.SegundoGatador += 1
    }

    this.$store.dispatch('updateGatada', this.gatada)
  }

  editGatador(gatada:string) {
    this.gatada = this.getGatadas.find(g => g.Uuid === gatada)
    if (this.gatada) {
      this.dialog = true
      this.titulo = 'Edita Gatada'
      this.fecha = this.gatada.Fecha
      this.jornada = this.gatada.Jornada
      this.gatador_1 = this.gatada.PrimerGatador
      this.gatador_2 = this.gatada.SegundoGatador
    }
  }

  removeFilter(item) {
    let index = this.gatadorSelect.indexOf(item)
    if (index >= 0) this.gatadorSelect.splice(index, 1)
  }
}
</script>
