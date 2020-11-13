export interface gatadaType {
  Uuid?:string
  Fecha:string
  Jornada?:string
  PrimerGatador:number
  SegundoGatador:number
  Resultado: {
    PrimerGatador:number
    SegundoGatador:number
  }
}

export interface gatadorType {
  Id?:number
  Nombre:string
  Imagen:string
  Redes?: {
    Twitter?:string
    Instagram?:string
    Youtube?:string
  }
}
