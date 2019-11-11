export const text = ad => {
  ad.adElement
    .querySelector('a[data-href]')
    .addEventListener('mouseenter', event => {
      event.target.style.color = '#1d6fa5'
    })

  ad.adElement
    .querySelector('a[data-href]')
    .addEventListener('mouseleave', event => {
      event.target.style.color = '#3498db'
    })
}
