<template>
  <v-container
    fluid`
  >
    <v-row
      class="justify-center"
    >
       <v-col
        cols="12"
        md="3"
      >
        <v-select
          label="Filtra temporadas"
          :items="temporadas"
          v-model="temporadaSelect"
          item-text="Nombre"
          item-value="Uuid"
        >
        </v-select>
      </v-col>
      <v-col
        cols="12"
        md="3"
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
              <th>Temporada</th>
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
                {{ getTemporada(gatada.Temporada) }}
              </td>
              <td>
                <v-tooltip
                  left
                >
                  <template
                    v-slot:activator="{ on, attrs }"
                  >
                    <v-avatar
                      v-bind="attrs"
                      v-on="on"
                      @click="sumaMarcador(gatada, 1)"
                    >
                      <v-img
                        :src="imgGatador(gatada.PrimerGatador)"
                      ></v-img>
                    </v-avatar>
                  </template>
                  <span>{{ nombreGatador(gatada.PrimerGatador) }}</span>
                </v-tooltip>
              </td>
              <td>
                {{gatada.Resultado.PrimerGatador}} - {{gatada.Resultado.SegundoGatador}}
              </td>
              <td>
                <v-tooltip
                  right
                >
                  <template
                    v-slot:activator="{ on, attrs }"
                  >
                    <v-avatar
                      v-bind="attrs"
                      v-on="on"
                      @click="sumaMarcador(gatada, 2)"
                    >
                      <v-img
                        :src="imgGatador(gatada.SegundoGatador)"
                      ></v-img>
                    </v-avatar>
                  </template>
                  <span>{{ nombreGatador(gatada.SegundoGatador) }}</span>
                </v-tooltip>
              </td>
              <td>{{ gatada.Jornada }}</td>
              <td>
                <v-btn
                  icon
                  @click="editGatador(gatada.Uuid)"
                >
                  <v-icon>create</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="deleteGatador(gatada.Uuid)"
                >
                  <v-icon>close</v-icon>
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
            <v-row>
              <v-col
                cols="6"
              >
                <v-select
                  label="Temporada"
                  :items="temporadas"
                  item-text="Nombre"
                  item-value="Uuid"
                  v-model="gata.Temporada"
                ></v-select>
              </v-col>
              <v-col
                cols="6"
              >
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
                      v-model="gata.Fecha"
                      label="Fecha gatada"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="gata.Fecha"
                    @input="fechaModal = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  v-model="gata.Jornada"
                  label="Jornada #"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  v-model="gata.PrimerGatador"
                  label="Gatador 1"
                  item-text="Nombre"
                  item-value="Id"
                  no-data-text="Gatadores no encontrados"
                  :loading="loadAutocompleteGatador_1"
                  :items="gatadoresItems_1"
                  :search-input.sync="searchAutocompleteGatador_1"
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
                </v-autocomplete>
              </v-col>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  v-model="gata.SegundoGatador"
                  label="Gatador 2"
                  item-text="Nombre"
                  item-value="Id"
                  no-data-text="Gatadores no encontrados"
                  :loading="loadAutocompleteGatador_2"
                  :items="gatadoresItems_2"
                  :search-input.sync="searchAutocompleteGatador_2"
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
                </v-autocomplete>
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
import { gatadaType, gatadorType, sedeType } from '@/typings'

@Component
export default class GatadaAdmin extends Vue {
  dialog:boolean = false
  isLoading:boolean = false
  fechaModal:boolean = false
  loadAutocompleteGatador_1:boolean = false
  loadAutocompleteGatador_2:boolean = false
  titulo:string = 'Nueva Gatada'
  searchAutocompleteGatador_1:string = ''
  searchAutocompleteGatador_2:string = ''
  temporadaSelect:string = ''
  gata:gatadaType = {
    Fecha: new Date().toISOString().substr(0,10),
    Jornada: '',
    PrimerGatador: 0,
    SegundoGatador: 0,
    Resultado: {
      PrimerGatador: 0,
      SegundoGatador: 0,
    },
    Delete: false,
    Temporada: ''
  }
  gatadas:gatadaType[] = []
  gatadorSelect:number[] = []
  gatadoresItems_1:gatadorType[] = []
  gatadoresItems_2:gatadorType[] = []

  get gatadores():gatadorType[] {
    return this.$store.getters.getGatadores
  }

  get getGatadas():gatadaType[] {
    return this.$store.getters.getAllGatadas
      .sort((a, b) => {
        return new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
      })
  }

  get temporadas():sedeType[] {
    return this.$store.getters.getSedes
  }

  @Watch('getGatadas', { immediate:true })
  updateListGatadas() {
    this.gatadas = this.getGatadas
    if (this.temporadaSelect.length > 0) this.filtroTemporada(this.temporadaSelect, '')
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

  @Watch('searchAutocompleteGatador_1')
  filtroGatador_1(value:string) {
    if (!value || value == '') {
      this.gatadoresItems_1 = this.gatadores.filter(g => {
        return this.gata.SegundoGatador !== g.Id
      })
      return
    }

    this.loadAutocompleteGatador_1 = true
    setTimeout(() => {
      this.gatadoresItems_1 = this.gatadores.filter(g => {
        return this.gata.SegundoGatador !== g.Id
      }).filter(g => {
        return g.Nombre.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      this.loadAutocompleteGatador_1 = false
    }, 500)
  }

  @Watch('searchAutocompleteGatador_2')
  filtroGatador_2(value:string) {
    if (!value || value == '') {
      this.gatadoresItems_2 = this.gatadores.filter(g => {
        return this.gata.PrimerGatador !== g.Id
      })
      return
    }

    this.loadAutocompleteGatador_2 = true
    setTimeout(() => {
      this.gatadoresItems_2 = this.gatadores.filter(g => {
        return this.gata.PrimerGatador !== g.Id
      }).filter(g => {
        return g.Nombre.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      this.loadAutocompleteGatador_2 = false
    }, 500)
  }

  @Watch('temporadaSelect')
  filtroTemporada(value, oldValue) {
    if (value.length > 0) {
      this.gatadas = this.getGatadas.filter(g => {
        return g.Temporada === value
      })
    }
  }

  closeDialog() {
    this.titulo = 'Nueva Gatada'
    this.dialog = false
    this.gata = {
      Fecha: new Date().toISOString().substr(0,10),
      Jornada: '',
      PrimerGatador: 0,
      SegundoGatador: 0,
      Resultado: {
        PrimerGatador: 0,
        SegundoGatador: 0
      },
      Delete: false,
      Temporada: ''
    }
  }

  imgGatador (idGatador:number) {
    let gatador = this.$store.getters.getGatador(idGatador)
    return gatador.Imagen
  }

  saveGatada() {
    this.isLoading = true
    this.$store.dispatch('saveGatada', this.gata)
      .then(complete => {
        this.isLoading = false
        if (complete) this.closeDialog()
      })
  }

  sumaMarcador(gatadaData:any, gatador:number) {
    this.gata = gatadaData

    if (gatador === 1) {
      this.gata.Resultado.PrimerGatador += 1
    } else if (gatador === 2) {
      this.gata.Resultado.SegundoGatador += 1
    }

    this.$store.dispatch('updateGatada', this.gata)
      .finally(() => {
        this.closeDialog()
      })
  }

  editGatador(gatada:string) {
    this.gata = this.getGatadas.find(g => g.Uuid === gatada)
    if (this.gata) {
      this.dialog = true
      this.titulo = 'Edita Gatada'
    }
  }

  removeFilter(item) {
    let index = this.gatadorSelect.indexOf(item)
    if (index >= 0) this.gatadorSelect.splice(index, 1)
  }

  nombreGatador(gatadorId:number): string {
    let nombre = ''
    let gatador = this.$store.getters.getGatador(gatadorId)
    nombre = gatador.Nombre
    return nombre
  }

  deleteGatador(gatadaUuid:string) {
    this.$store.dispatch('removeGatada', gatadaUuid)
  }

  getTemporada(temporadaUuid:string) {
    let temporada = this.temporadas.find(t => t.Uuid === temporadaUuid)
    return temporada.Nombre
  }
}
</script>
