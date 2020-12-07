export interface gatadaType {
  Uuid?: string
  Fecha: string
  Jornada?: string
  PrimerGatador: number
  SegundoGatador: number
  Resultado: {
    PrimerGatador: number
    SegundoGatador: number
  }
  Delete: boolean
  Temporada: string
}

export interface gatadorType {
  Uuid?: string
  Id?: number
  Nombre: string
  Imagen: string
  Redes?: {
    Twitter?: string
    Instagram?: string
    Youtube?: string
  }
  Activo?: boolean
  Temporadas?: Array<temporadaType['Uuid']>
}

export interface temporadaType {
  Uuid?: string
  Nombre: string
  Descripcion: string
  Delete: boolean
  Actual: boolean
  Ganador?: gatadorType['Uuid']
}
