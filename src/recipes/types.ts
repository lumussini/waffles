export type UnitSystem = 'metric' | 'us'

export type Ingredient = {
  id: string
  name: string
  veganName?: string
  baseQuantity: number | null
  unit: string
  veganBaseQuantity?: number
  veganUnit?: string
  usQuantity?: number | null
  usUnit?: string
  noteId?: string
  optional?: boolean
}

export type RecipeScaling = {
  baseServings: number
  min: number
  max: number
  countHeadingKey: string
  increaseLabelKey: string
  decreaseLabelKey: string
  unitLabelKey: string
}

export type RecipeVariant = {
  id: string
  labelKey: string
  ingredients: Ingredient[]
  directionIds?: string[]
}

export type Recipe = {
  id: string
  nameKey: string
  ingredients: Ingredient[]
  directionIds?: string[]
  scaling?: RecipeScaling
  veganizable?: boolean
  variants?: RecipeVariant[]
  defaultVariantId?: string
}
