/*
 * CodeFund is whitelisted as an Acceptable Ads provider.
 * SEE: https://acceptableads.com
 *
 * This script determines if our whitelisted status allowed the ad
 * to display on clients that are running Adblock Plus.
 */

let uplift = {}

// TODO: figure out how to pass URLs in to this script
const upliftUrl = '?'
const adblockPlusPixelUrl = '?'

const trackUplift = () => {
  try {
    console.log(`CodeFund is recording uplift. ${upliftUrl}`)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', upliftUrl)
    xhr.send()
  } catch (e) {
    console.log(`CodeFund was unable to record uplift! ${e.message}`)
  }
}

const verifyUplift = () => {
  if (uplift.pixel1 === undefined || uplift.pixel2 === undefined) return
  if (uplift.pixel1 && !uplift.pixel2) trackUplift()
}

const detectUplift = count => {
  if (adblockPlusPixelUrl.length === 0) return
  var xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (count === 1) {
          detectUplift(2)
        }
        uplift['pixel' + count] = true
      } else {
        uplift['pixel' + count] = false
      }
      verifyUplift()
    }
  }
  xhr.open(
    'GET',
    `${adblockPlusPixelUrl}?ch=${count}&rnd=${Math.random() * 11}`
  )
  xhr.send()
}
