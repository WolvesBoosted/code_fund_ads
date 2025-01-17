# == Schema Information
#
# Table name: scheduled_organization_reports
#
#  id              :bigint           not null, primary key
#  organization_id :bigint           not null
#  subject         :text             not null
#  start_date      :date             not null
#  end_date        :date             not null
#  frequency       :string           not null
#  dataset         :string           not null
#  campaign_ids    :bigint           default([]), not null, is an Array
#  recipients      :string           default([]), not null, is an Array
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryBot.define do
  date = Date.current.beginning_of_month

  factory :scheduled_organization_report do
    association :organization

    subject { "My Scheduled Report" }
    start_date { date }
    end_date { start_date.advance(months: 1) }
    recipients { ["eric@codefund.io", "nate@codefund.io"] }
    frequency { ENUMS::SCHEDULED_ORGANIZATION_REPORT_FREQUENCIES.values.sample }
    dataset { ENUMS::SCHEDULED_ORGANIZATION_REPORT_DATASETS.values.sample }
    campaign_ids { organization.campaigns&.pluck(:id) }
  end
end
