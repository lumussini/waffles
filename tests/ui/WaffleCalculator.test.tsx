import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TIP_DURATION_MS } from '../../src/components/WafflyCompanion'
import { WaffleCalculator } from '../../src/components/WaffleCalculator'
import { I18nProvider } from '../../src/i18n/I18nContext'

const renderCalculator = () =>
  render(
    <I18nProvider>
      <WaffleCalculator />
    </I18nProvider>,
  )

const getInput = () => screen.getByRole('spinbutton', { name: /number of waffles/i })
const getPlus = () => screen.getByRole('button', { name: /increase waffle count/i })
const getMinus = () => screen.getByRole('button', { name: /decrease waffle count/i })
const getVegan = () => screen.getByRole('checkbox', { name: /veganize/i })

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('WaffleCalculator', () => {
  it('shows the default waffle count of 4', () => {
    renderCalculator()
    expect(getInput()).toHaveValue(4)
    expect(screen.getByText('180 ml')).toBeInTheDocument()
  })

  it('increments the count with the plus control', async () => {
    const user = userEvent.setup()
    renderCalculator()
    await user.click(getPlus())
    expect(getInput()).toHaveValue(5)
    expect(screen.getByText('225 ml')).toBeInTheDocument()
  })

  it('decrements the count with the minus control', async () => {
    const user = userEvent.setup()
    renderCalculator()
    await user.click(getMinus())
    expect(getInput()).toHaveValue(3)
    expect(screen.getByText('135 ml')).toBeInTheDocument()
  })

  it('respects the minimum count', async () => {
    const user = userEvent.setup()
    renderCalculator()
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
    renderCalculator()
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
    renderCalculator()
    const input = getInput()
    await user.clear(input)
    await user.type(input, '8')
    expect(screen.getByText('360 ml')).toBeInTheDocument()
    expect(screen.getByText('240 g')).toBeInTheDocument()
  })

  it('keeps the last valid count for invalid direct input', async () => {
    const user = userEvent.setup()
    renderCalculator()
    const input = getInput()
    await user.clear(input)
    await user.type(input, 'abc')
    await user.tab()
    expect(getInput()).toHaveValue(4)
    expect(screen.getByText('180 ml')).toBeInTheDocument()
  })

  it('switches ingredient labels when veganize is toggled', async () => {
    const user = userEvent.setup()
    renderCalculator()
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

  it('leaves the waffle count unchanged when toggling vegan mode', async () => {
    const user = userEvent.setup()
    renderCalculator()
    const input = getInput()
    await user.clear(input)
    await user.type(input, '8')
    await user.click(getVegan())
    expect(getInput()).toHaveValue(8)
  })

  it('restores a saved count and vegan preference', () => {
    window.localStorage.setItem(
      'waffles:calculator-state',
      JSON.stringify({ waffleCount: 6, vegan: true }),
    )
    renderCalculator()
    expect(getInput()).toHaveValue(6)
    expect(getVegan()).toBeChecked()
    expect(screen.getByText('Malk')).toBeInTheDocument()
  })

  it('shows a welcome message from Waffly on load', () => {
    renderCalculator()
    expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
  })

  it('hides the welcome message after a moment', () => {
    vi.useFakeTimers()
    renderCalculator()
    expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(TIP_DURATION_MS)
    })
    expect(screen.queryByText("It's waffle time!")).not.toBeInTheDocument()
  })

  it('shows the recommended serving tip when the help button is tapped', async () => {
    const user = userEvent.setup()
    renderCalculator()
    const help = screen.getByRole('button', { name: /recommended serving per person/i })
    await user.click(help)
    expect(screen.getByText(/Recommended serving:/i)).toBeInTheDocument()
  })

  it('dismisses the current tip when Waffly is tapped', async () => {
    const user = userEvent.setup()
    renderCalculator()
    expect(screen.getByText("It's waffle time!")).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /hide waffly's tip/i }))
    expect(screen.queryByText("It's waffle time!")).not.toBeInTheDocument()
  })

  it('falls back to defaults for invalid saved state', () => {
    window.localStorage.setItem('waffles:calculator-state', 'not-json')
    renderCalculator()
    expect(getInput()).toHaveValue(4)
  })

  it('renders in German when the locale is set via the query string', () => {
    window.history.pushState({}, '', '/?lang=de')
    renderCalculator()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Ultimative Waffel-Zutaten-Rechner',
    )
    expect(screen.getByText('Wie viele Waffeln?')).toBeInTheDocument()
    expect(screen.getByText('Mehl')).toBeInTheDocument()
    expect(screen.getByText('Es ist Waffelzeit!')).toBeInTheDocument()
  })
})
