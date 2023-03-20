const setHeight = () => {
  if (typeof window === 'undefined') return

  const mobileMenu = document.querySelector('[data-mobile-menu-max-height]')
  const fullScreenModals = document.querySelectorAll('[data-mobile-max-height-16]')

  if (fullScreenModals.length) {
    fullScreenModals.forEach(modal => {
      if (modal instanceof HTMLElement) {
        modal.style.maxHeight = `${window.innerHeight - 16}px`
      }
    })
  }

  if (mobileMenu instanceof HTMLElement) {
    mobileMenu.style.height = `${window.innerHeight - 64}px`
  }

  const htmlElements = Array.from(document.querySelectorAll('[data-mobile-max-height]'))
  if (!htmlElements.length) return

  const filteredHtmlElements = htmlElements
    .filter(element => element instanceof HTMLElement)
    .map(element => element as HTMLElement)

  filteredHtmlElements.forEach(element => {
    element.style.minHeight = `${window.innerHeight - 64}px`
    element.style.maxHeight = `${window.innerHeight - 64}px`
  })
}

export const setMobileMenuHeight = () => {
  if (typeof window === 'undefined') return

  const mobileMenu = document.querySelector('[data-mobile-menu-max-height]')

  if (mobileMenu instanceof HTMLElement) {
    mobileMenu.style.height = `${window.innerHeight - 64}px`
  }
}

export const addResizeListener = () => {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', setHeight)

  setTimeout(() => {
    setHeight()
  })
}
