import type { Config } from 'tailwindcss'
import tiaPreset from '../../tia-preset'

const config: Config = {
  presets: [tiaPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
}

export default config