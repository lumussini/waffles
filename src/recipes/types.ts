export type Ingredient = {
  id: string
  name: string
  veganName?: string
  baseQuantity: number | null
  unit: string
  veganBaseQuantity?: number
  veganUnit?: string
}

export type Recipe = {
  id: string
  name: string
  baseServings: number
  ingredients: Ingredient[]
  veganizable?: boolean
}
