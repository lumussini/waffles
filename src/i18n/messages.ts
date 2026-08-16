export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]

const en = {
  countHeading: 'How many waffles?',
  helpLabel: 'Show recommended serving per person',
  increaseCount: 'Increase count',
  decreaseCount: 'Decrease count',
  numberOfWaffles: 'Number of waffles',
  ingredients: 'Ingredients',
  veganize: 'VEGANIZE!?',
  'welcomeTip.waffles': "It's waffle time!",
  'welcomeTip.bolitas': 'A birthday classic!',
  servingTip: 'Recommended serving: 2 per adult, 1.5 per kid.',
  hideTip: "Hide Waffly's tip",
  closeMenu: 'Close',
  directions: 'Directions',
  optional: 'optional',
  toTaste: 'to taste',
  fixedBatch: 'Fixed recipe \u2014 one batch',
  settingsLabel: 'Settings',
  unitsLabel: 'Units',
  metricLabel: 'Metric (g, ml)',
  usLabel: 'US (cups, tsp)',
  homeLabel: 'All recipes',
  'recipe.waffles': 'Ultimate Waffles',
  'recipe.bolitas': "Mechi's Chocolate Bean Balls",
  'recipe.vegan-cake': 'Vegan Cake',
  'variant.basic': 'Basic',
  'variant.zebra': 'Zebra',
  'welcomeTip.vegan-cake': 'Moist and chocolatey!',
  welcomeTitle: 'Welcome to Little Bites',
  welcomeSubtitle: 'Pick a recipe to get started',
  'ingredient.milk': 'Milk',
  'ingredient.milk.vegan': 'Malk',
  'ingredient.flour': 'Flour',
  'ingredient.fat': 'Butter',
  'ingredient.fat.vegan': 'Margarine',
  'ingredient.baking-powder': 'Baking powder',
  'ingredient.sugar': 'Sugar',
  'ingredient.salt': 'Salt',
  'ingredient.vanilla': 'Vanilla extract',
  'ingredient.red-beans': 'Red beans',
  'ingredient.coconut-oil': 'Coconut oil',
  'ingredient.raw-cane-sugar': 'Raw cane sugar',
  'ingredient.cocoa-powder': 'Unsweetened cocoa powder',
  'ingredient.flavoring': 'Vanilla, rum, or raisins',
  'ingredient.coating': 'Coconut or cocoa powder for coating',
  'ingredient.cocoa': 'Unsweetened cocoa powder',
  'ingredient.baking-soda': 'Baking soda',
  'ingredient.water': 'Water',
  'ingredient.oil': 'Vegetable oil',
  'ingredient.vinegar': 'White vinegar',
  'ingredient.cocoa-extra': 'Unsweetened cocoa powder (extra)',
  'note.rinsed': 'rinsed',
  'note.quarter-cup': '1/4 cup',
  'direction.combine-dry': 'Combine all dry ingredients.',
  'direction.add-remaining':
    'Add remaining ingredients and whisk until mixture is smooth.',
  'direction.cook':
    'Pour about a small soup ladle of batter into a non-stick pan over medium heat. Flip after half a minute and cook for another half minute. Repeat.',
  'direction.top':
    'Top with vegan butter, banana slices, nuts, maple syrup, etc.',
  'direction.process':
    'Process the rinsed beans, coconut oil, sugar, and cocoa powder until smooth.',
  'direction.chill': 'Chill for 30 minutes.',
  'direction.form': 'Form the mixture into small balls.',
  'direction.roll': 'Roll the balls in coconut or cocoa powder.',
  'direction.cake.preheat':
    'Preheat the oven to 180\u00b0C (350\u00b0F). Grease and flour a bundt cake pan.',
  'direction.cake.mix-dry':
    'In a large bowl, whisk together the flour, sugar, cocoa powder, baking soda, and salt.',
  'direction.cake.mix-wet':
    'In another bowl, combine the water, oil, vanilla extract, and vinegar.',
  'direction.cake.combined':
    'Pour the wet ingredients into the dry ingredients and stir until just combined. Do not overmix.',
  'direction.cake.pour': 'Pour the batter into the prepared pan.',
  'direction.cake.bake':
    'Bake for 35\u201340 minutes, or until a toothpick inserted in the center comes out clean.',
  'direction.cake.cool':
    'Let the cake cool in the pan for 10 minutes, then turn out onto a wire rack.',
  'direction.cake.serve': 'Serve warm or at room temperature.',
  'direction.cake.separate': 'Divide the batter into two equal portions.',
  'direction.cake.cocoa-mix':
    'Sift the extra cocoa powder into one portion and mix until well combined.',
  'direction.cake.alternate':
    'Alternately spoon plain and chocolate batter into the prepared pan.',
  'direction.cake.swirl':
    'Use a knife to gently swirl the batters together for a marbled effect.',
  'direction.cake.slice':
    'Let cool completely before slicing to reveal the zebra pattern.',
} as const

export type MessageKey = keyof typeof en

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en,
  de: {
    countHeading: 'Wie viele Waffeln?',
    helpLabel: 'Empfohlene Portion pro Person anzeigen',
    increaseCount: 'Anzahl erh\u00f6hen',
    decreaseCount: 'Anzahl verringern',
    numberOfWaffles: 'Anzahl der Waffeln',
    ingredients: 'Zutaten',
    veganize: 'VEGANISIEREN!?',
    'welcomeTip.waffles': 'Es ist Waffelzeit!',
    'welcomeTip.bolitas': 'Ein Geburtstagsklassiker!',
    servingTip: 'Empfohlene Portion: 2 pro Erwachsenem, 1,5 pro Kind.',
    hideTip: 'Tipp von Waffly ausblenden',
    closeMenu: 'Schlie\u00dfen',
    directions: 'Zubereitung',
    optional: 'optional',
    toTaste: 'nach Geschmack',
    fixedBatch: 'Festes Rezept \u2014 eine Portion',
    settingsLabel: 'Einstellungen',
    unitsLabel: 'Einheiten',
    metricLabel: 'Metrisch (g, ml)',
    usLabel: 'US (Tassen, TL)',
    homeLabel: 'Alle Rezepte',
    'recipe.waffles': 'Ultimative Waffeln',
    'recipe.bolitas': 'Mechis Schoko-Bohnenb\u00e4llchen',
    'recipe.vegan-cake': 'Veganer Kuchen',
    'variant.basic': 'Basis',
    'variant.zebra': 'Zebra',
    'welcomeTip.vegan-cake': 'Feucht und schokoladig!',
    welcomeTitle: 'Willkommen bei Little Bites',
    welcomeSubtitle: 'W\u00e4hle ein Rezept zum Loslegen',
    'ingredient.milk': 'Milch',
    'ingredient.milk.vegan': 'Malk',
    'ingredient.flour': 'Mehl',
    'ingredient.fat': 'Butter',
    'ingredient.fat.vegan': 'Margarine',
    'ingredient.baking-powder': 'Backpulver',
    'ingredient.sugar': 'Zucker',
    'ingredient.salt': 'Salz',
    'ingredient.vanilla': 'Vanilleextrakt',
    'ingredient.red-beans': 'Rote Bohnen',
    'ingredient.coconut-oil': 'Kokos\u00f6l',
    'ingredient.raw-cane-sugar': 'Rohrzucker',
    'ingredient.cocoa-powder': 'Unges\u00fc\u00dftes Kakaopulver',
    'ingredient.flavoring': 'Vanilleextrakt, Rum oder Rosinen',
    'ingredient.coating':
      'Kokos- oder Kakaopulver zum Best\u00e4uben',
    'ingredient.cocoa': 'Unges\u00fc\u00dftes Kakaopulver',
    'ingredient.baking-soda': 'Natron',
    'ingredient.water': 'Wasser',
    'ingredient.oil': 'Pflanzen\u00f6l',
    'ingredient.vinegar': 'Wei\u00dfer Essig',
    'ingredient.cocoa-extra': 'Unges\u00fc\u00dftes Kakaopulver (extra)',
    'note.rinsed': 'gewaschen',
    'note.quarter-cup': '1/4 Tasse',
    'direction.combine-dry': 'Trockene Zutaten vermischen.',
    'direction.add-remaining':
      'Restliche Zutaten hinzuf\u00fcgen und glatt r\u00fchren.',
    'direction.cook':
      'Einen kleinen Sch\u00f6pfkochl\u00f6ffel Teig in eine beschichtete Pfanne bei mittlerer Hitze geben. Nach einer halben Minute wenden und noch eine halbe Minute braten. Wiederholen.',
    'direction.top':
      'Mit veganer Butter, Bananenscheiben, N\u00fcssen, Ahornsirup usw. garnieren.',
    'direction.process':
      'Gewaschene Bohnen, Kokos\u00f6l, Zucker und Kakaopulver glatt p\u00f6rieren.',
    'direction.chill': '30 Minuten kalt stellen.',
    'direction.form': 'Die Masse zu kleinen B\u00e4llchen formen.',
    'direction.roll':
      'Die B\u00e4llchen in Kokos- oder Kakaopulver w\u00e4lzen.',
    'direction.cake.preheat':
      'Den Ofen auf 180\u00b0C (350\u00b0F) vorheizen. Eine Gugelhupfform einfetten und mit Mehl best\u00e4uben.',
    'direction.cake.mix-dry':
      'In einer gro\u00dfen Sch\u00fcssel Mehl, Zucker, Kakaopulver, Natron und Salz vermischen.',
    'direction.cake.mix-wet':
      'In einer anderen Sch\u00fcssel Wasser, \u00d6l, Vanilleextrakt und Essig verr\u00fchren.',
    'direction.cake.combined':
      'Die fl\u00fcchtigen Zutaten zu den trockenen geben und nur gerade eben unterr\u00fchren. Nicht zu lange r\u00fchren.',
    'direction.cake.pour': 'Den Teig in die vorbereitete Form gie\u00dfen.',
    'direction.cake.bake':
      '35\u201340 Minuten backen, bis einHolzst\u00e4bchen in der Mitte sauber herauskommt.',
    'direction.cake.cool':
      'Den Kuchen 10 Minuten in der Form abk\u00fchlen lassen, dann auf ein K\u00fchlgitter st\u00fcrzen.',
    'direction.cake.serve': 'Warm oder bei Zimmertemperatur servieren.',
    'direction.cake.separate': 'Den Teig in zwei gleiche H\u00e4lften teilen.',
    'direction.cake.cocoa-mix':
      'Das extra Kakaopulver in eine H\u00e4lfte sieben und gut unterr\u00fchren.',
    'direction.cake.alternate':
      'Abwechselnd Plain- und Schokoladenteig in die vorbereitete Form l\u00f6ffeln.',
    'direction.cake.swirl':
      'Mit einem Messer vorsichtig die Teige f\u00fcr einen Marmoreffekt verschlingen.',
    'direction.cake.slice':
      'Ganz abk\u00fchlen lassen, bevor man den Kuchen schneidet, um das Zebramuster zu enth\u00fcllen.',
  },
}
