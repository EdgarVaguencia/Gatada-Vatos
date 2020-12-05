<template>
  <v-container
    fluid
  >
    <v-row
      class="justify-center"
    >
      <v-col
        cols="12"
        md="8"
      >
        <v-list>
          <v-list-item
            v-for="(item, index) in temporadas"
            :key="index"
          >
            <v-list-item-icon>
              <v-icon
                v-if="item.Actual"
              >star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.Nombre"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-text="item.Descripcion"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                @click="editTemporada(item.Uuid)"
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
            <v-text-field
              label="Nombre"
              v-model="temporada.Nombre"
            ></v-text-field>
            <v-textarea
              label="Descripcion"
              v-model="temporada.Descripcion"
            ></v-textarea>
            <v-autocomplete
              v-model="temporada.Ganador"
              label="Ganador Temporada"
              no-data-text="Gatadores no encontrados"
              item-text="Nombre"
              item-value="Uuid"
              :loading="loadAutocompleteGatador"
              :items="gatadoresItems"
              :search-input.sync="searchAutocompleteGatador"
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
            <v-switch
              label="Activa"
              v-model="temporada.Actual"
            ></v-switch>
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
              @click="saveTemporada"
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
import { gatadorType, temporadaType } from '@/typings'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class TemporadaAdmin extends Vue {
  dialog:boolean = false
  isLoading:boolean = false
  loadAutocompleteGatador:boolean = false
  tituloDialog:string = 'Nueva Temporada'
  searchAutocompleteGatador:string = ''
  temporada: temporadaType = {
    Nombre: '',
    Descripcion: '',
    Delete: false,
    Actual: false,
    Ganador: ''
  }
  gatadoresItems:gatadorType[] = []

  get temporadas() {
    return this.$store.getters.getTemporadas
  }

  get gatadores():gatadorType[] {
    return this.$store.getters.getGatadores
  }

  @Watch('searchAutocompleteGatador')
  filtroGatador_1(value:string) {
    let listaGatadores = this.gatadores

    if (this.temporada.Uuid && this.temporada.Uuid !== '') {
      listaGatadores = listaGatadores.filter(g => {
        return g.Temporadas.indexOf(this.temporada.Uuid) >= 0
      })
    }

    if (!value || value === '') {
      this.gatadoresItems = listaGatadores
      return
    }

    this.loadAutocompleteGatador = true

    setTimeout(() => {
      this.gatadoresItems = listaGatadores.filter(g => {
        return g.Nombre.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      this.loadAutocompleteGatador = false
    }, 500)
  }

  editTemporada(temporadaUuid:string) {
    this.temporada = this.temporadas.find(g => g.Uuid === temporadaUuid)
    if (this.temporada) {
      this.dialog = true
      this.tituloDialog = 'Edita Temporada'
    }
  }

  closeDialog() {
    this.isLoading = false
    this.dialog = false
    this.temporada = {
      Nombre: '',
      Descripcion: '',
      Delete: false,
      Actual: false
    }
    this.tituloDialog = 'Nueva Temporada'
  }

  saveTemporada() {
    this.isLoading = true
    if (this.temporada.Uuid) {
      this.$store.dispatch('updateTemporada', this.temporada)
        .finally(() => {
          this.closeDialog()
        })
    } else {
      this.$store.dispatch('saveTemporada', this.temporada)
        .finally(() => {
          this.closeDialog()
        })
    }
  }
}
</script>
