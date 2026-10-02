class PullRequest < ApplicationRecord
  belongs_to :repository
  has_many :reviews, dependent: :destroy

  validates :github_pr_id, presence: true, uniqueness: { scope: :repository_id }
  validates :number, presence: true

  def latest_review
    reviews.order(created_at: :desc).first
  end
end
