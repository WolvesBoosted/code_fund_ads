import { closeCodeFund, codefundClosed, elementVisible } from './helpers'

const codefundElementId = 'codefund' // TODO: support passing this value in

const dispatchCodefundEvent = detail => {
  const evt = new Event('codefund')
  evt.detail = detail
  window.dispatchEvent(evt)
}

const showAdvertisement = (codefundElement, advertisementHtml) => {
  //var codeFundElement = document.getElementById('codefund') || document.getElementById('<%= @target %>');
  //if (!elementVisible(codeFundElement)) {
  //console.log('CodeFund element not visible! Please verify an element exists with id="codefund" and that it is visible.');
  //return;
  //}
  //codeFundElement.innerHTML = '<%= @advertisement_html.html_safe %>';
  //codeFundElement.querySelector('img[data-src="impression_url"]').src = '<%= @impression_url.html_safe %>';
  //codeFundElement.querySelectorAll('a[data-href="campaign_url"]').forEach(function (a) { a.href = '<%= @campaign_url.html_safe %>'; });
  //var poweredByElement = codeFundElement.querySelector('a[data-target="powered_by_url"]');
  //if (poweredByElement) { poweredByElement.href = '<%= @powered_by_url.html_safe %>'; }
  //var closeElement = codeFundElement.querySelector('button[data-behavior="close"]');
  //if (closeElement) { closeElement.addEventListener('click', closeCodeFund); }
  //evt.detail = { status: 'ok', house: <%= @campaign.fallback? %> };
  //detectUplift(1);
}

export const embed = advertisementHtml => {
  document.removeEventListener('DOMContentLoaded', embed)
  const codeFundElement = document.getElementById(codefundElementId)

  if (!codefundElement || !elementVisible(codefundElement)) {
    console.log(
      'CodeFund element not visible! Please verify an element exists with id="codefund" and that it is visible.'
    )
    return dispatchCodefundEvent({ status: 'no-element' })
  }

  if (!advertisementHtml) {
    console.log('CodeFund does not have an advertiser for you at this time.')
    return dispatchCodefundEvent({ status: 'no-advertiser' })
  }

  if (codefundClosed()) {
    console.log('CodeFund ad has been previously closed by the user.')
    return dispatchCodefundEvent({ status: 'closed' })
  }

  showAdvertisement(advertisementHtml)
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', embed)
  : embed()
