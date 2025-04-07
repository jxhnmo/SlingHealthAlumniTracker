class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :omniauthable, omniauth_providers: [:google_oauth2]

  has_many :achievements, dependent: :destroy
  accepts_nested_attributes_for :achievements, allow_destroy: true

  def self.from_google(auth)
    user = User.find_or_initialize_by(email: auth.info.email)

    user.assign_attributes(
      name: auth.info.name,
      user_profile_url: '/profilePix/default.jpg',
      biography: '',
      major: '',
      graduation_year: 0
    )

    user.save if user.changed?

    user
  end
end
