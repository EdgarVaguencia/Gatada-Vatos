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
            v-for="(item, index) in gatadores"
            :key="index"
          >
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
            <v-text-field
              label="Url img"
              v-model="gatador.Imagen"
            ></v-text-field>
            <v-text-field
              label="Nombre"
              v-model="gatador.Nombre"
            ></v-text-field>
            <v-switch
              v-model="gatador.Activo"
              label="Activo"
            ></v-switch>
            <v-divider></v-divider>
            <v-text-field
              label="Twitter"
              v-model="gatador.Redes.Twitter"
            ></v-text-field>
            <v-text-field
              label="Instagram"
              v-model="gatador.Redes.Instagram"
            ></v-text-field>
            <v-text-field
              label="YouTube"
              v-model="gatador.Redes.Youtube"
            ></v-text-field>
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
import { Component, Vue } from 'vue-property-decorator'
import { gatadorType } from '@/typings'

@Component
export default class GatadorAdmin extends Vue {
  dialog: boolean = false
  isLoading:boolean = false
  tituloDialog: string = 'Nuevo Gatador'
  gatadorSelect:number = 0
  gatador:gatadorType = {
    Nombre: '',
    Imagen: '',
    Redes: {}
  }

  created(){
    this.$store.dispatch('fetchGatadores')
  }

  get gatadores() {
    return this.$store.getters.getGatadores
  }

  closeDialog () {
    this.dialog = false
    this.gatador = {
      Nombre: '',
      Imagen: '',
      Redes: {}
    }
    this.tituloDialog = 'Nuevo Gatador'
  }

  editGatador(idGatador:number) {
    this.gatador = this.gatadores.find(g => g.Uuid === idGatador)
    if (this.gatador) {
      this.dialog = true
      this.tituloDialog = 'Edita Gatador #' + this.gatador.Id
      if (!this.gatador.Redes) this.gatador.Redes = {}
    }
  }

  saveGatador() {
    this.isLoading = true
    if (this.gatador.Id) {
      this.$store.dispatch('updateGatador', this.gatador)
        .then(complete => {
          this.isLoading = false
          this.dialog = false
        })
    } else {
      this.isLoading = true
      this.$store.dispatch('saveGatador', {
        Id: this.gatadores.length + 1,
        Nombre: this.gatador.Nombre,
        Imagen: this.gatador.Imagen,
        Activo: true,
      })
    }
  }
}
</script>
