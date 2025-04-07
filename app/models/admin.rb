class Admin < ApplicationRecord
    devise :omniauthable, omniauth_providers: [:google_oauth2]
  
    def self.from_google(email:, full_name:, uid:, avatar_url:)
      find_or_create_by!(email: email) do |admin|
        admin.uid = uid
        admin.full_name = full_name
        admin.avatar_url = avatar_url
      end
    end
  
    def self.generate_jwt(admin)
      payload = { admin_id: admin.id, email: admin.email, exp: 24.hours.from_now.to_i }
      JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
    end
  end
  