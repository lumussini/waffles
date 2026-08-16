import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from '../../src/components/AppShell'
import { TIP_DURATION_MS } from '../../src/components/WafflyCompanion'
import { I18nProvider } from '../../src/i18n/I18nContext'

const renderApp = () =>
  render(
    <I18nProvider>
      <AppShell />
    </I18nProvider>,
  )

const getInput = () => screen.getByRole('spinbutton', { name: /number of waffles/i })
const getPlus = () => screen.getByRole('button', { name: /increase count/i })
const getMinus = () => screen.getByRole('button', { name: /decrease count/i })
const getVegan = () => screen.getByRole('checkbox', { name: /veganize/i })

const startOnWelcome = () => {
  window.localStorage.removeItem('little-bites:state')
}

const startOnRecipe = (overrides?: { recipeId?: string; count?: number; vegan?: boolean; units?: string; variantId?: string | null }) => {
  window.localStorage.setItem(
    'little-bites:state',
    JSON.stringify({ recipeId: 'waffles', count: 4, vegan: false, units: 'metric', variantId: null, view: 'recipe', ...overrides }),
  )
}

const selectRecipeFromHome = async (
  user: ReturnType<typeof userEvent.setup>,
  namePattern: RegExp,
) => {
  const card = screen.getByRole('button', { name: namePattern })
  await user.click(card)
}

beforeEach(() => {
  startOnRecipe()
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('AppShell', () => {
  describe('welcome / home screen', () => {
    it('shows the welcome screen on first visit', () => {
      startOnWelcome()
      renderApp()
      expect(screen.getByText('Pick a recipe to get started')).toBeInTheDocument()
    })

    it('lists all recipes on the welcome screen', () => {
      startOnWelcome()
      renderApp()
      expect(screen.getByRole('button', { name: /ultimate waffles/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /mechi/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /vegan cake/i })).toBeInTheDocument()
    })

    it('selecting a recipe from the welcome screen shows the app', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /ultimate waffles/i)
      expect(getInput()).toHaveValue(4)
      expect(screen.getByText('180 ml')).toBeInTheDocument()
    })

    it('clicking home button returns to the welcome screen', async () => {
      const user = userEvent.setup()
      renderApp()
      expect(getInput()).toBeInTheDocument()
      const homeButton = screen.getByRole('button', { name: /all recipes/i })
      await user.click(homeButton)
      expect(screen.getByText('Pick a recipe to get started')).toBeInTheDocument()
    })

    it('returning users skip the welcome screen', () => {
      startOnRecipe({ recipeId: 'bolitas' })
      renderApp()
      expect(screen.getByText('Red beans')).toBeInTheDocument()
    })

    it('can navigate between recipes via home', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('Red beans')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /all recipes/i }))
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.getByText('Basic')).toBeInTheDocument()
    })

    it('falls back to defaults for invalid saved state', () => {
      startOnWelcome()
      window.localStorage.setItem('little-bites:state', 'not-json')
      renderApp()
      expect(screen.getByText('Pick a recipe to get started')).toBeInTheDocument()
    })
  })

  describe('waffle recipe (default)', () => {
    it('shows the default count of 4', () => {
      renderApp()
      expect(getInput()).toHaveValue(4)
      expect(screen.getByText('180 ml')).toBeInTheDocument()
    })

    it('increments the count with the plus control', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(getPlus())
      expect(getInput()).toHaveValue(5)
      expect(screen.getByText('225 ml')).toBeInTheDocument()
    })

    it('decrements the count with the minus control', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(getMinus())
      expect(getInput()).toHaveValue(3)
      expect(screen.getByText('135 ml')).toBeInTheDocument()
    })

    it('respects the minimum count', async () => {
      const user = userEvent.setup()
      renderApp()
      const input = getInput()
      await user.clear(input)
      await user.type(input, '1')
      expect(getInput()).toHaveValue(1)
      expect(getMinus()).toBeDisabled()
      await user.click(getMinus())
      expect(getInput()).toHaveValue(1)
    })

    it('respects the maximum count', async () => {
      const user = userEvent.setup()
      renderApp()
      const input = getInput()
      await user.clear(input)
      await user.type(input, '50')
      expect(getInput()).toHaveValue(50)
      expect(getPlus()).toBeDisabled()
      await user.click(getPlus())
      expect(getInput()).toHaveValue(50)
    })

    it('updates quantities immediately when the count changes', async () => {
      const user = userEvent.setup()
      renderApp()
      const input = getInput()
      await user.clear(input)
      await user.type(input, '8')
      expect(screen.getByText('360 ml')).toBeInTheDocument()
      expect(screen.getByText('240 g')).toBeInTheDocument()
    })

    it('keeps the last valid count for invalid direct input', async () => {
      const user = userEvent.setup()
      renderApp()
      const input = getInput()
      await user.clear(input)
      await user.type(input, 'abc')
      await user.tab()
      expect(getInput()).toHaveValue(4)
      expect(screen.getByText('180 ml')).toBeInTheDocument()
    })

    it('switches ingredient labels when veganize is toggled', async () => {
      const user = userEvent.setup()
      renderApp()
      expect(screen.getByText('Milk')).toBeInTheDocument()
      expect(screen.getByText('Butter')).toBeInTheDocument()
      expect(screen.getByText('Flour')).toBeInTheDocument()

      await user.click(getVegan())
      expect(getVegan()).toBeChecked()
      expect(screen.getByText('Malk')).toBeInTheDocument()
      expect(screen.getByText('Margarine')).toBeInTheDocument()
      expect(screen.queryByText('Milk')).not.toBeInTheDocument()
      expect(screen.getByText('Flour')).toBeInTheDocument()
      expect(screen.getByText('Baking powder')).toBeInTheDocument()
      expect(screen.getByText('Sugar')).toBeInTheDocument()
      expect(screen.getByText('Salt')).toBeInTheDocument()
      expect(screen.getByText('Vanilla extract')).toBeInTheDocument()
    })

    it('leaves the count unchanged when toggling vegan mode', async () => {
      const user = userEvent.setup()
      renderApp()
      const input = getInput()
      await user.clear(input)
      await user.type(input, '8')
      await user.click(getVegan())
      expect(getInput()).toHaveValue(8)
    })

    it('restores a saved count and vegan preference', () => {
      startOnRecipe({ count: 6, vegan: true })
      renderApp()
      expect(getInput()).toHaveValue(6)
      expect(getVegan()).toBeChecked()
      expect(screen.getByText('Malk')).toBeInTheDocument()
    })

    it('shows waffle directions', () => {
      renderApp()
      expect(screen.getByText('Directions')).toBeInTheDocument()
      expect(screen.getByText('Combine all dry ingredients.')).toBeInTheDocument()
      expect(screen.getByText(/Pour about a small soup ladle/)).toBeInTheDocument()
    })

    it('shows the vegan toggle for waffles', () => {
      renderApp()
      expect(getVegan()).toBeInTheDocument()
    })
  })

  describe('welcome tip and serving tip', () => {
    it('shows a welcome message from Waffly on load', () => {
      renderApp()
      expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
    })

    it('hides the welcome message after a moment', () => {
      vi.useFakeTimers()
      renderApp()
      expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
      act(() => {
        vi.advanceTimersByTime(TIP_DURATION_MS)
      })
      expect(screen.queryByText("It's waffle time!")).not.toBeInTheDocument()
    })

    it('shows the recommended serving tip when the help button is tapped', async () => {
      const user = userEvent.setup()
      renderApp()
      const help = screen.getByRole('button', { name: /recommended serving per person/i })
      await user.click(help)
      expect(screen.getByText(/Recommended serving:/i)).toBeInTheDocument()
    })

    it('dismisses the current tip when Waffly is tapped', async () => {
      const user = userEvent.setup()
      renderApp()
      expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /hide waffly's tip/i }))
      expect(screen.queryByText("It's waffle time!")).not.toBeInTheDocument()
    })
  })

  describe('recipe switching via home', () => {
    it('count control is visible for waffles', () => {
      renderApp()
      expect(getInput()).toBeInTheDocument()
    })

    it('count control is not shown for bolitas', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    })

    it('bolitas ingredients are displayed', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('Red beans')).toBeInTheDocument()
      expect(screen.getByText('Coconut oil')).toBeInTheDocument()
      expect(screen.getByText('Raw cane sugar')).toBeInTheDocument()
      expect(screen.getByText('Unsweetened cocoa powder')).toBeInTheDocument()
    })

    it('bolitas shows the fixed-batch label', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('Fixed recipe — one batch')).toBeInTheDocument()
    })

    it('bolitas shows directions', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('Process the rinsed beans, coconut oil, sugar, and cocoa powder until smooth.')).toBeInTheDocument()
      expect(screen.getByText('Chill for 30 minutes.')).toBeInTheDocument()
      expect(screen.getByText('Form the mixture into small balls.')).toBeInTheDocument()
      expect(screen.getByText('Roll the balls in coconut or cocoa powder.')).toBeInTheDocument()
    })

    it('vegan toggle is not shown for bolitas', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.queryByRole('checkbox', { name: /veganize/i })).not.toBeInTheDocument()
    })

    it('shows optional ingredients for bolitas', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('Vanilla, rum, or raisins')).toBeInTheDocument()
      expect(screen.getByText('Coconut or cocoa powder for coating')).toBeInTheDocument()
    })
  })

  describe('localization', () => {
    it('renders in German when the locale is set via the query string', () => {
      startOnWelcome()
      window.history.pushState({}, '', '/?lang=de')
      renderApp()
      expect(screen.getByText('Wähle ein Rezept zum Loslegen')).toBeInTheDocument()
    })

    it('shows German recipe name for waffles', () => {
      window.history.pushState({}, '', '/?lang=de')
      renderApp()
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Ultimative Waffeln',
      )
      expect(screen.getByText('Wie viele Waffeln?')).toBeInTheDocument()
      expect(screen.getByText('Mehl')).toBeInTheDocument()
      expect(screen.getByText('Es ist Waffelzeit!')).toBeInTheDocument()
    })

    it('shows bolitas recipe name in German on the home screen', () => {
      startOnWelcome()
      window.history.pushState({}, '', '/?lang=de')
      renderApp()
      expect(screen.getByRole('button', { name: /schoko-bohnenbällchen/i })).toBeInTheDocument()
    })
  })

  describe('settings and unit switching', () => {
    it('shows the settings button', () => {
      renderApp()
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
    })

    it('clicking settings opens the settings drawer', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      expect(screen.getByRole('dialog', { name: /settings/i })).toHaveClass('is-open')
      expect(screen.getByText('Units')).toBeInTheDocument()
      expect(screen.getByText('Metric (g, ml)')).toBeInTheDocument()
      expect(screen.getByText('US (cups, tsp)')).toBeInTheDocument()
    })

    it('metric is selected by default', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      const metricRadio = screen.getByRole('radio', { name: /metric/i })
      expect(metricRadio).toBeChecked()
    })

    it('switching to US shows cup equivalents', async () => {
      const user = userEvent.setup()
      renderApp()
      expect(screen.getByText('180 ml')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      expect(screen.queryByText('180 ml')).not.toBeInTheDocument()
      expect(screen.getByText('3/4 cup')).toBeInTheDocument()
    })

    it('switching back to metric shows metric units', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      expect(screen.getByText('3/4 cup')).toBeInTheDocument()
      await user.click(screen.getByRole('radio', { name: /metric/i }))
      expect(screen.queryByText('3/4 cup')).not.toBeInTheDocument()
      expect(screen.getByText('180 ml')).toBeInTheDocument()
    })

    it('US units scale with count', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      await user.keyboard('{Escape}')
      const input = getInput()
      await user.clear(input)
      await user.type(input, '8')
      expect(screen.getByText('1 1/2 cup')).toBeInTheDocument()
    })

    it('units preference persists across re-renders', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      await user.keyboard('{Escape}')
      expect(screen.getByText('3/4 cup')).toBeInTheDocument()
    })

    it('bolitas shows US cup equivalents when US is selected', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      await user.keyboard('{Escape}')
      expect(screen.getAllByText('1/4 cup').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('1/3 cup')).toBeInTheDocument()
    })

    it('settings drawer closes on Escape', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      expect(screen.getByRole('dialog', { name: /settings/i })).toHaveClass('is-open')
      await user.keyboard('{Escape}')
      expect(screen.getByRole('dialog', { name: /settings/i })).not.toHaveClass('is-open')
    })

    it('settings drawer closes on backdrop click', async () => {
      const user = userEvent.setup()
      renderApp()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      const backdrop = document.querySelector('.settings-drawer-backdrop') as HTMLElement
      await user.click(backdrop)
      expect(screen.getByRole('dialog', { name: /settings/i })).not.toHaveClass('is-open')
    })

    it('note is hidden when US units are selected for bolitas', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /mechi/i)
      expect(screen.getByText('(rinsed)')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /settings/i }))
      await user.click(screen.getByRole('radio', { name: /us/i }))
      await user.keyboard('{Escape}')
      expect(screen.queryByText('(rinsed)')).not.toBeInTheDocument()
    })
  })

  describe('vegan cake recipe', () => {
    it('selecting vegan cake from home shows the variant selector', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.getByText('Basic')).toBeInTheDocument()
      expect(screen.getByText('Zebra')).toBeInTheDocument()
    })

    it('basic variant is selected by default', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      const basicRadio = screen.getByRole('radio', { name: /basic/i })
      expect(basicRadio).toBeChecked()
    })

    it('basic variant shows 9 ingredients without cocoa-extra', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.getByText('Flour')).toBeInTheDocument()
      expect(screen.getByText('Sugar')).toBeInTheDocument()
      expect(screen.getByText('Unsweetened cocoa powder')).toBeInTheDocument()
      expect(screen.getByText('Baking soda')).toBeInTheDocument()
      expect(screen.getByText('Salt')).toBeInTheDocument()
      expect(screen.getByText('Water')).toBeInTheDocument()
      expect(screen.getByText('Vegetable oil')).toBeInTheDocument()
      expect(screen.getByText('Vanilla extract')).toBeInTheDocument()
      expect(screen.getByText('White vinegar')).toBeInTheDocument()
      expect(screen.queryByText('Unsweetened cocoa powder (extra)')).not.toBeInTheDocument()
    })

    it('switching to zebra adds extra cocoa ingredient', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      await user.click(screen.getByRole('radio', { name: /zebra/i }))
      expect(screen.getByText('Unsweetened cocoa powder (extra)')).toBeInTheDocument()
    })

    it('basic variant shows 8 directions', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      const directionsSection = screen.getByText('Directions').closest('section')!
      const items = within(directionsSection).getAllByRole('listitem')
      expect(items).toHaveLength(8)
    })

    it('zebra variant shows 12 directions', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      await user.click(screen.getByRole('radio', { name: /zebra/i }))
      const directionsSection = screen.getByText('Directions').closest('section')!
      const items = within(directionsSection).getAllByRole('listitem')
      expect(items).toHaveLength(12)
    })

    it('does not show count control (no scaling)', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    })

    it('does not show fixed-batch label (has variants)', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.queryByText('Fixed recipe — one batch')).not.toBeInTheDocument()
    })

    it('variant selector is keyboard accessible', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      const basicRadio = screen.getByRole('radio', { name: /basic/i })
      const zebraRadio = screen.getByRole('radio', { name: /zebra/i })
      expect(basicRadio).toBeChecked()
      expect(zebraRadio).not.toBeChecked()
      await user.click(zebraRadio)
      expect(zebraRadio).toBeChecked()
      expect(basicRadio).not.toBeChecked()
    })

    it('shows welcome tip when switching to vegan cake', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      expect(screen.getByText('Moist and chocolatey!')).toBeInTheDocument()
    })

    it('persists variant selection across re-renders', async () => {
      startOnWelcome()
      const user = userEvent.setup()
      renderApp()
      await selectRecipeFromHome(user, /vegan cake/i)
      await user.click(screen.getByRole('radio', { name: /zebra/i }))
      expect(screen.getByRole('radio', { name: /zebra/i })).toBeChecked()
      expect(screen.getByText('Unsweetened cocoa powder (extra)')).toBeInTheDocument()
    })

    it('shows the vegan cake on the home screen', () => {
      startOnWelcome()
      renderApp()
      expect(screen.getByRole('button', { name: /vegan cake/i })).toBeInTheDocument()
    })
  })
})
