module AdvertisementsHelper
  def interpolated_advertisement_html
    template_path = Rails.root.join("app/javascript/advertisements/#{template_name}/template.html.mustache")
    template_cache_key = "templates/#{template_name}/#{File.mtime(template_path).iso8601}"
    template = Rails.cache.fetch(template_cache_key, expires_in: 7.days) {
      File.read(Rails.root.join("app/javascript/advertisements/#{template_name}/template.html.mustache"), encoding: "UTF-8").squish
    }
    options = JSON.parse(render("/advertisements/options.json"))
    stylesheet = stylesheet_pack_tag("code_fund_ad", media: "all")
    html = Mustache.render(template, options)
    [stylesheet, html].join
  end
end
