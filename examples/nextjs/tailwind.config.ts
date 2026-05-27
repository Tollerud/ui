import type { Config } from 'tailwindcss'
import tollerudPreset from '../../tollerud-preset'

const config: Config = {
  presets: [tollerudPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
}

export default config