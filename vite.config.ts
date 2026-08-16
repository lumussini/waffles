/// <reference types="vitest/config" />
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function swPrecache(): Plugin {
  return {
    name: 'waffles-sw-precache',
    closeBundle() {
      const distDir = join(process.cwd(), 'dist')
      const swPath = join(distDir, 'sw.js')
      if (!existsSync(swPath)) {
        return
      }
      const urls = ['./']
      const stack = [distDir]
      while (stack.length > 0) {
        const dir = stack.pop()!
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name)
          if (entry.isDirectory()) {
            stack.push(full)
          } else if (entry.name !== 'sw.js') {
            urls.push(`./${relative(distDir, full).split(sep).join('/')}`)
          }
        }
      }
      const source = readFileSync(swPath, 'utf8')
      writeFileSync(swPath, source.replace('self.__PRECACHE__', JSON.stringify(urls)))
    },
  }
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/waffles/' : '/',
  plugins: [react(), swPrecache()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
  },
})
