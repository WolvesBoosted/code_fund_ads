import Mustache from 'mustache'
const templates = {}
const requireTemplates = context => {
  context.keys().forEach(path => {
    const name = path.split('/')[1]
    templates[name] = context(path).default
  })
}
requireTemplates(require.context('./', true, /index\.js\.erb$/))
const pixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

/*
 * CodeFund is whitelisted as an Acceptable Ads provider.
 * SEE: https://acceptableads.com
 *
 * The uplift methods in this script help determine if our whitelisted status allowed the ad
 * to display on clients that are running Adblock Plus.
 *
 * NOTE: options defined at: app/views/advertisements/_ad_options.json.jbuilder
 */
class CodeFundAd {
  constructor (options = {}) {
    Object.assign(this, options)
    this.uplift = {}
    this.perform()
  }

  get container () {
    const el =
      this.selector && this.selector.length
        ? document.querySelector(this.selector)
        : null
    return el || document.getElementById('codefund')
  }

  get element () {
    return this.container ? this.container.querySelector('#cf') : null
  }

  get visible () {
    let currentElement = this.container
    if (!currentElement) return false
    while (currentElement) {
      const style = getComputedStyle(currentElement)
      if (style.visibility === 'hidden') return false
      if (style.display === 'none') return false
      currentElement = currentElement.parentElement
    }
    return true
  }

  get closed () {
    return sessionStorage.getItem('codefund') === 'closed'
  }

  close () {
    sessionStorage.setItem('codefund', 'closed')
    this.container.remove()
  }

  dispatch (detail) {
    const evt = new Event('codefund')
    evt.detail = detail
    window.dispatchEvent(evt)
  }

  perform (preview) {
    if (!this.visible) {
      console.log(
        `CodeFund container element not visible! Please verify an element exists (and is visible) that matches the CSS selector "${
          this.selector
        }"`
      )
      return this.dispatch({ status: 'no-container-element' })
    }

    if (!this.urls || !this.urls.campaign || this.urls.campaign.length === 0) {
      console.log('CodeFund does not have an advertiser for you at this time.')
      return this.dispatch({ status: 'no-advertiser' })
    }

    if (this.closed) {
      console.log('CodeFund ad has been closed by the user.')
      return this.dispatch({ status: 'closed' })
    }

    this.container.innerHTML = Mustache.render(
      templates[this.template].mustache,
      this
    )
    this.container.querySelectorAll('img').forEach(el => {
      el.addEventListener('error', event => (event.target.src = pixel))
    })
    this.container.querySelectorAll('[data-behavior="close"]').forEach(el => {
      el.addEventListener('click', this.close.bind(this))
    })
    templates[this.template].initialize(this)

    this.dispatch({ status: 'ok', house: this.fallback })
    if (!preview) this.detectUplift(1)
  }

  trackUplift () {
    try {
      console.log(`CodeFund is recording uplift. ${this.upliftUrl}`)
      const xhr = new XMLHttpRequest()
      xhr.open('POST', this.upliftUrl)
      xhr.send()
    } catch (e) {
      console.log(`CodeFund was unable to record uplift! ${e.message}`)
    }
  }

  verifyUplift () {
    if (this.uplift.pixel1 === undefined) return
    if (this.uplift.pixel2 === undefined) return
    if (this.uplift.pixel1 && !this.uplift.pixel2)
      this.trackUplift(this.upliftUrl)
  }

  detectUplift (count) {
    if (!this.adblockPlusPixelUrl) return
    if (this.adblockPlusPixelUrl.length === 0) return
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (count === 1) {
            this.detectUplift(2)
          }
          this.uplift['pixel' + count] = true
        } else {
          this.uplift['pixel' + count] = false
        }
        this.verifyUplift()
      }
    }
    xhr.open(
      'GET',
      `${this.adblockPlusPixelUrl}?ch=${count}&rnd=${Math.random() * 11}`
    )
    xhr.send()
  }
}

window.CodeFundAd = CodeFundAd
