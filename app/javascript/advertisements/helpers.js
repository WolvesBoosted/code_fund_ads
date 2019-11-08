export const elementVisible = element => {
  if (!element) return false
  while (element) {
    const style = getComputedStyle(element)
    if (style.visibility === 'hidden' || style.display === 'none') return false
    element = element.parentElement
  }
  return true
}

export const closeCodeFund = (codefundElementId = 'codefund') => {
  sessionStorage.setItem('codefund', 'closed')
  document.getElementById(codefundElementId).remove()
}

export const codefundClosed = () =>
  sessionStorage.getItem('codefund') === 'closed'
