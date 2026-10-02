class Repository < ApplicationRecord
  belongs_to :user
  has_many :pull_requests, dependent: :destroy

  validates :github_repo_id, presence: true, uniqueness: true
  validates :full_name, presence: true

  def owner_login
    full_name.split("/").first
  end

  def repo_name
    full_name.split("/").last
  end
end
