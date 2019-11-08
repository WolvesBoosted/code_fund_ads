/*
 * CodeFund is whitelisted as an Acceptable Ads provider.
 * SEE: https://acceptableads.com
 *
 * This uplift methods in this script help determine if our whitelisted status allowed the ad
 * to display on clients that are running Adblock Plus.
 */
class CodeFundAd {
  constructor (
    elementId,
    html,
    impressionUrl,
    campaignUrl,
    poweredByUrl,
    adblockPlusPixelUrl,
    upliftUrl,
    fallback
  ) {
    this.elementId = elementId
    this.html = html
    this.impressionUrl = impressionUrl
    this.campaignUrl = campaignUrl
    this.poweredByUrl = poweredByUrl
    this.adblockPlusPixelUrl = adblockPlusPixelUrl
    this.upliftUrl = upliftUrl
    this.fallback = fallback
    this.uplift = {}
  }

  get element () {
    if (!this.elementId) return null
    let el = document.getElementById(this.elementId)
    if (!el) {
      el = document.getElementById('codefund')
      if (el) this.elementId = 'codefund'
    }
    return el
  }

  get visible () {
    let currentElement = this.element
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
    this.element.remove()
  }

  dispatch (detail) {
    const evt = new Event('codefund')
    evt.detail = detail
    window.dispatchEvent(evt)
  }

  perform () {
    if (!this.visible) {
      console.log(
        'CodeFund element not visible! Please verify an element exists with id="codefund" and that it is visible.'
      )
      return this.dispatch({ status: 'no-element' })
    }

    if (!this.html || this.html.length === 0) {
      console.log('CodeFund does not have an advertiser for you at this time.')
      return this.dispatch({ status: 'no-advertiser' })
    }

    if (this.closed) {
      console.log('CodeFund ad has been closed by the user.')
      return this.dispatch({ status: 'closed' })
    }

    this.element.innerHTML = this.html

    this.element
      .querySelectorAll('img[data-src="impression_url"]')
      .forEach(img => (img.src = this.impressionUrl))

    this.element
      .querySelectorAll('a[data-href="campaign_url"]')
      .forEach(a => (a.href = this.campaignUrl))

    this.element
      .querySelectorAll('a[data-target="powered_by_url"]')
      .forEach(a => (a.href = this.poweredByUrl))

    this.element
      .querySelectorAll('button[data-behavior="close"]')
      .forEach(b => b.addEventListener('click', () => this.close.bind(this)))

    this.dispatch({ status: 'ok', house: this.fallback })
    this.detectUplift(1)
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
