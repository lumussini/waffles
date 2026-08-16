import type { Recipe } from './types'

export const bolitas: Recipe = {
  id: 'bolitas',
  nameKey: 'recipe.bolitas',
  directionIds: ['process', 'chill', 'form', 'roll'],
  ingredients: [
    {
      id: 'red-beans',
      name: 'Red beans',
      baseQuantity: 1,
      unit: 'can',
      noteId: 'rinsed',
    },
    {
      id: 'coconut-oil',
      name: 'Coconut oil',
      baseQuantity: 60,
      unit: 'g',
      usQuantity: 0.25,
      usUnit: 'cup',
    },
    {
      id: 'raw-cane-sugar',
      name: 'Raw cane sugar',
      baseQuantity: 55,
      unit: 'g',
      usQuantity: 0.25,
      usUnit: 'cup',
    },
    {
      id: 'cocoa-powder',
      name: 'Unsweetened cocoa powder',
      baseQuantity: 31,
      unit: 'g',
      usQuantity: 0.33,
      usUnit: 'cup',
    },
    {
      id: 'flavoring',
      name: 'Vanilla, rum, or raisins',
      baseQuantity: null,
      unit: '',
      optional: true,
    },
    {
      id: 'coating',
      name: 'Coconut or cocoa powder for coating',
      baseQuantity: null,
      unit: '',
      optional: true,
    },
  ],
}
