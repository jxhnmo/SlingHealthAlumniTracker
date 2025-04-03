class Admin < ApplicationRecord
    devise :omniauthable, omniauth_providers: [:google_oauth2]
    def self.from_google(email:, full_name:, uid:, avatar_url:)
        create_with(uid: uid, full_name: full_name, avatar_url: avatar_url).find_or_create_by!(email: email)
      end
    def self.generate_jwt(admin)
        payload = { admin_id: admin.id, email: admin.email }
        JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
      end
    

  end
  
  