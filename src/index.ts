/**
 * @owdproject/astro
 * Official Astro Islands & Custom Elements adapter for @owdproject/core.
 * Allows React, Vue, Svelte, and vanilla Islands to share a single Desktop instance on the page.
 */

import {
  createDesktop,
  DesktopPointerSession,
  type Desktop,
  type DesktopOptions,
  type WindowInstance,
} from '@owdproject/core'

export * from '@owdproject/core'

const GLOBAL_DESKTOP_KEY = '__OWD_ASTRO_DESKTOP__'

/**
 * Returns or initializes a shared Desktop instance across Astro Islands on `globalThis`.
 */
export function getSharedDesktop(options?: DesktopOptions): Desktop {
  const g = globalThis as Record<string, any>
  if (!g[GLOBAL_DESKTOP_KEY]) {
    g[GLOBAL_DESKTOP_KEY] = createDesktop(options)
  }
  return g[GLOBAL_DESKTOP_KEY] as Desktop
}

/**
 * Registers `<owd-desktop-window>` Custom Element for zero-JS or multi-island Astro templates.
 */
export function defineOwdWindowElement(
  tagName = 'owd-desktop-window',
  desktop: Desktop = getSharedDesktop(),
): void {
  if (typeof window === 'undefined' || typeof HTMLElement === 'undefined') return
  if (customElements.get(tagName)) return

  class OwdDesktopWindowElement extends HTMLElement {
    private instance?: WindowInstance
    private unsubscribe?: () => void

    connectedCallback() {
      const id = this.getAttribute('window-id') || `astro-win-${Date.now()}`
      const title = this.getAttribute('title') || 'Window'
      const width = Number(this.getAttribute('width') || 520)
      const height = Number(this.getAttribute('height') || 360)
      const x = Number(this.getAttribute('x') || 80)
      const y = Number(this.getAttribute('y') || 80)

      this.instance =
        desktop.windows.get(id) ??
        desktop.windows.createWindow({
          id,
          model: 'astro-island',
          config: {
            title,
            size: { width, height },
            position: { x, y },
          },
        })

      this.unsubscribe = this.instance.subscribe((state) => {
        this.style.position = 'fixed'
        this.style.left = `${state.position?.x ?? 0}px`
        this.style.top = `${state.position?.y ?? 0}px`
        this.style.width = `${state.size?.width ?? 520}px`
        this.style.height = `${state.size?.height ?? 360}px`
        this.style.zIndex = String(state.position?.z ?? 100)
        this.style.display = state.active === false ? 'none' : 'flex'
        this.dataset.focused = String(state.focused)
      })

      const handleEl = this.querySelector<HTMLElement>('[data-owd-drag-handle]')
      if (handleEl && this.instance) {
        const winInstance = this.instance
        handleEl.onpointerdown = (e: PointerEvent) => {
          desktop.windows.focusWindow(winInstance.id)
          const st = winInstance.getSnapshot()
          DesktopPointerSession.startDrag(e, {
            initialBounds: {
              x: st.position?.x ?? 0,
              y: st.position?.y ?? 0,
              width: Number(st.size?.width ?? 520),
              height: Number(st.size?.height ?? 360),
            },
            workarea: desktop.workspaces.workarea,
            onStart: () => winInstance.startDrag(),
            onMove: (bounds) => winInstance.setPosition({ x: bounds.x, y: bounds.y }),
            onEnd: (bounds) => {
              winInstance.stopDrag()
              winInstance.setPosition({ x: bounds.x, y: bounds.y })
            },
          })
        }
      }
    }

    disconnectedCallback() {
      this.unsubscribe?.()
    }
  }

  customElements.define(tagName, OwdDesktopWindowElement)
}
