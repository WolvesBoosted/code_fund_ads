require "test_helper"

class AdvertisementsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "get advertisement with active & matching campaign" do
    AdvertisementsController.any_instance.stubs(ad_test?: false)
    campaign = active_campaign
    property = matched_property(campaign)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("codeFundElement.innerHTML = '<div id=\"cf\"")
  end

  test "get advertisement with active & geo matching campaign" do
    campaign = active_campaign(country_codes: ["US"])
    property = matched_property(campaign)
    self.remote_addr = ip_address(campaign.country_codes.sample)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("codeFundElement.innerHTML = '<div id=\"cf\"")
  end

  test "get advertisement with active but no geo matching campaigns" do
    campaign = active_campaign(country_codes: ["CA"])
    property = matched_property(campaign)
    self.remote_addr = ip_address("US")
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("CodeFund does not have an advertiser for you at this time.")
  end

  test "get advertisement with no matching campaigns" do
    campaign = inactive_campaign
    property = matched_property(campaign)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("CodeFund does not have an advertiser for you at this time.")
  end

  test "get advertisement with fallback campaign if request is local" do
    self.remote_addr = "127.0.0.1"
    campaign = fallback_campaign
    property = matched_property(campaign)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("codeFundElement.innerHTML = '<div id=\"cf\"")
  end

  test "get advertisement with active campaign if request is local" do
    self.remote_addr = "127.0.0.1"
    campaign = active_campaign
    property = matched_property(campaign)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("CodeFund does not have an advertiser for you at this time.")
  end

  test "get advertisement with fallback campaign" do
    campaign = fallback_campaign
    property = matched_property(campaign)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("codeFundElement.innerHTML = '<div id=\"cf\"")
  end

  test "get advertisement with paid fallback campaign" do
    campaign = fallback_campaign
    campaign.update fallback: false, paid_fallback: true
    property = properties(:website)
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("codeFundElement.innerHTML = '<div id=\"cf\"")
  end

  test "get advertisement with fallback campaign when property doesn't allow fallbacks" do
    campaign = fallback_campaign
    property = matched_property(campaign)
    property.update! prohibit_fallback_campaigns: true
    get advertisements_url(property, format: :js)
    assert_response :success
    assert response.body.include?("CodeFund does not have an advertiser for you at this time.")
  end

  test "get sponsor advertisement without active campaign" do
    property = amend(properties: :website, url: "https://github.com/gitcoinco/code_fund_ads")
    ip = ip_address("US")

    assert property.restrict_to_sponsor_campaigns?
    get sponsor_url(property), headers: {"REMOTE_ADDR": ip, "User-Agent": "Rails/Minitest"}
    assert_response :success
    assert response.headers["Content-Type"] == "image/svg+xml; charset=utf-8"
    assert response.body.include?("viewBox=\"0 0 0 0\"")
  end

  test "get sponsor advertisement" do
    Impression.delete_all
    campaign = active_campaign(country_codes: ["US"])
    campaign.creatives.each do |creative|
      creative.standard_images.destroy_all
      creative.update! creative_type: ENUMS::CREATIVE_TYPES::SPONSOR
      CreativeImage.create! creative: creative, image: attach_sponsor_image!(campaign.user)
    end
    property = matched_property(campaign)
    property.update! url: "https://github.com/gitcoinco/code_fund_ads"
    campaign.update! assigned_property_ids: [property.id]
    ip = ip_address("US")

    assert Impression.count == 0
    assert campaign.sponsor?
    assert property.restrict_to_sponsor_campaigns?
    assert campaign.creatives.size == 1
    assert campaign.sponsor_creatives.size == 1

    get sponsor_url(property), headers: {"REMOTE_ADDR": ip, "User-Agent": "Rails/Minitest"}

    assert_response :success
    assert response.headers["Content-Type"] == "image/svg+xml; charset=utf-8"
    assert response.body == campaign.creatives.first.sponsor_image.download
  end

  test "get sponsor advertisement catch-all" do
    Impression.delete_all
    campaign = active_campaign(country_codes: ["US"])
    property = matched_property(campaign)
    Campaign.destroy_all
    ip = ip_address("US")

    get sponsor_url(property), headers: {"REMOTE_ADDR": ip, "User-Agent": "Rails/Minitest"}

    assert Impression.count == 0
    assert_response :success
    assert response.headers["Content-Type"] == "image/svg+xml; charset=utf-8"
    assert response.body == File.read(File.join("app/assets/images/sponsor-catch-all.svg"))
  end
end
