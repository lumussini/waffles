export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]

const en = {
  title: 'Ultimate waffle ingredients calculator',
  countHeading: 'How many waffles?',
  helpLabel: 'Show recommended serving per person',
  increaseCount: 'Increase waffle count',
  decreaseCount: 'Decrease waffle count',
  numberOfWaffles: 'Number of waffles',
  ingredients: 'Ingredients',
  veganize: 'VEGANIZE!?',
  welcomeTip: "It's waffle time!",
  servingTip: 'Recommended serving: 2 per adult, 1.5 per kid.',
  hideTip: "Hide Waffly's tip",
  'ingredient.milk': 'Milk',
  'ingredient.milk.vegan': 'Malk',
  'ingredient.flour': 'Flour',
  'ingredient.fat': 'Butter',
  'ingredient.fat.vegan': 'Margarine',
  'ingredient.baking-powder': 'Baking powder',
  'ingredient.sugar': 'Sugar',
  'ingredient.salt': 'Salt',
  'ingredient.vanilla': 'Vanilla extract',
} as const

export type MessageKey = keyof typeof en

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en,
  de: {
    title: 'Ultimative Waffel-Zutaten-Rechner',
    countHeading: 'Wie viele Waffeln?',
    helpLabel: 'Empfohlene Portion pro Person anzeigen',
    increaseCount: 'Waffelanzahl erhöhen',
    decreaseCount: 'Waffelanzahl verringern',
    numberOfWaffles: 'Anzahl der Waffeln',
    ingredients: 'Zutaten',
    veganize: 'VEGANISIEREN!?',
    welcomeTip: 'Es ist Waffelzeit!',
    servingTip: 'Empfohlene Portion: 2 pro Erwachsenem, 1,5 pro Kind.',
    hideTip: 'Tipp von Waffly ausblenden',
    'ingredient.milk': 'Milch',
    'ingredient.milk.vegan': 'Malk',
    'ingredient.flour': 'Mehl',
    'ingredient.fat': 'Butter',
    'ingredient.fat.vegan': 'Margarine',
    'ingredient.baking-powder': 'Backpulver',
    'ingredient.sugar': 'Zucker',
    'ingredient.salt': 'Salz',
    'ingredient.vanilla': 'Vanilleextrakt',
  },
}
