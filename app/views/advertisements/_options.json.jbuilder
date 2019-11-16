json.key_format! camelize: :lower
json.selector @target || "codefund"
json.template template_name
json.theme theme_name
json.creative do
  json.name @creative&.name
  json.headline @creative&.headline
  json.body @creative&.body
  json.image_urls do
    json.icon @creative&.icon_image&.cloudfront_url
    json.small @creative&.small_image&.cloudfront_url
    json.large @creative&.large_image&.cloudfront_url
    json.wide @creative&.wide_image&.cloudfront_url
  end
end
json.urls do
  json.impression @impression_url.to_s.strip
  json.campaign @campaign_url.to_s.strip
  json.powered_by @powered_by_url.to_s.strip
  json.adblock ENV["ADBLOCK_PLUS_PIXEL_URL"].to_s.strip
  json.uplift @uplift_url.to_s.strip
end
json.fallback !!@campaign&.fallback?
