class User < ApplicationRecord
  encrypts :github_token

  has_many :repositories, dependent: :destroy

  validates :github_id, presence: true, uniqueness: true
  validates :github_username, presence: true

  def self.from_omniauth(auth)
    find_or_initialize_by(github_id: auth.uid).tap do |user|
      user.github_username = auth.info.nickname
      user.name = auth.info.name
      user.email = auth.info.email
      user.avatar_url = auth.info.image
      user.github_token = auth.credentials.token
      user.save!
    end
  end
end
