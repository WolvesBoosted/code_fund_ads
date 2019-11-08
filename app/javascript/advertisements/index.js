import { setUpliftUrls, detectUplift } from './uplift'
import {
  closeCodefund,
  codefundClosed,
  dispatchCodefundEvent,
  elementVisible
} from './helpers'

const showCodeFundAdvertisement = (
  codefundElementId,
  advertisementHtml,
  impressionUrl,
  campaignUrl,
  poweredByUrl,
  adblockPlusPixelUrl,
  upliftUrl,
  fallback
) => {
  const codefundElement =
    document.getElementById(codefundElementId) ||
    document.getElementById('codefund')

  if (!codefundElement || !elementVisible(codefundElement)) {
    console.log(
      'CodeFund element not visible! Please verify an element exists with id="codefund" and that it is visible.'
    )
    return dispatchCodefundEvent({ status: 'no-element' })
  }

  if (!advertisementHtml || advertisementHtml.length === 0) {
    console.log('CodeFund does not have an advertiser for you at this time.')
    return dispatchCodefundEvent({ status: 'no-advertiser' })
  }

  if (codefundClosed()) {
    console.log('CodeFund ad has been closed by the user.')
    return dispatchCodefundEvent({ status: 'closed' })
  }

  codefundElement.innerHTML = advertisementHtml

  codefundElement
    .querySelectorAll('img[data-src="impression_url"]')
    .forEach(img => (img.src = impressionUrl))

  codefundElement
    .querySelectorAll('a[data-href="campaign_url"]')
    .forEach(a => (a.href = campaignUrl))

  codefundElement
    .querySelectorAll('a[data-target="powered_by_url"]')
    .forEach(a => (a.href = poweredByUrl))

  codefundElement
    .querySelectorAll('button[data-behavior="close"]')
    .forEach(b => b.addEventListener('click', closeCodefund))

  dispatchCodefundEvent({ fallback, house: fallback, status: 'ok' })
  detectUplift(adblockPlusPixelUrl, upliftUrl, 1)
}

window.showCodeFundAdvertisement = showCodeFundAdvertisement
