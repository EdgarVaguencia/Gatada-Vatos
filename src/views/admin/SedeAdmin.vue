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
            v-for="(item, index) in sedes"
            :key="index"
          >
            <v-list-item-icon>
              <v-icon
                v-if="item.Actual"
              >
                star
              </v-icon>
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
                @click="editSede(item.Uuid)"
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
              v-model="sede.Nombre"
            ></v-text-field>
            <v-textarea
              label="Descripcion"
              v-model="sede.Descripcion"
            ></v-textarea>
            <v-switch
              label="Activa"
              v-model="sede.Actual"
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
              @click="saveSede"
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
import { sedeType } from '@/typings'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SedeAdmin extends Vue {
  dialog:boolean = false
  isLoading:boolean = false
  tituloDialog:string = 'Nueva Sede'
  sede: sedeType = {
    Nombre: '',
    Descripcion: '',
    Delete: false,
    Actual: false
  }

  get sedes() {
    return this.$store.getters.getSedes
  }

  editSede(sedeUuid:string) {
    this.sede = this.sedes.find(g => g.Uuid === sedeUuid)
    if (this.sede) {
      this.dialog = true
      this.tituloDialog = 'Edita Sede'
    }
  }

  closeDialog() {
    this.isLoading = false
    this.dialog = false
    this.sede = {
      Nombre: '',
      Descripcion: '',
      Delete: false,
      Actual: false
    }
    this.tituloDialog = 'Nueva Sede'
  }

  saveSede() {
    this.isLoading = true
    if (this.sede.Uuid) {
      this.$store.dispatch('updateSede', this.sede)
        .finally(() => {
          this.closeDialog()
        })
    } else {
      this.$store.dispatch('saveSede', this.sede)
        .finally(() => {
          this.closeDialog()
        })
    }
  }
}
</script>
