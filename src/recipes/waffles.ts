import type { Recipe } from './types'

export const waffles: Recipe = {
  id: 'waffles',
  name: 'Ultimate Waffle',
  baseServings: 4,
  veganizable: true,
  ingredients: [
    {
      id: 'milk',
      name: 'Milk',
      veganName: 'Malk',
      baseQuantity: 180,
      unit: 'ml',
    },
    {
      id: 'flour',
      name: 'Flour',
      baseQuantity: 120,
      unit: 'g',
    },
    {
      id: 'fat',
      name: 'Butter',
      veganName: 'Margarine',
      baseQuantity: 60,
      unit: 'g',
    },
    {
      id: 'baking-powder',
      name: 'Baking powder',
      baseQuantity: 7,
      unit: 'g',
    },
    {
      id: 'sugar',
      name: 'Sugar',
      baseQuantity: 6.8,
      unit: 'g',
    },
    {
      id: 'salt',
      name: 'Salt',
      baseQuantity: 1.2,
      unit: 'g',
    },
    {
      id: 'vanilla',
      name: 'Vanilla extract',
      baseQuantity: 1.2,
      unit: 'ml',
    },
  ],
}
