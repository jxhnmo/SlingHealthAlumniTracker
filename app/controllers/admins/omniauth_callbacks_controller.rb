class Admins::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    admin = Admin.from_google(**from_google_params)
  
    if admin.present?
      sign_out_all_scopes
      flash[:success] = t 'devise.omniauth_callbacks.success', kind: 'Google'
      sign_in admin
      create_user_if_not_exists(from_google_params)
      redirect_to "https://alumni-tracker-sprint2-d1ab480922a9.herokuapp.com/login?user=#{Base64.urlsafe_encode64(from_google_params.to_json)}" and return
      # redirect_to "http://localhost:4000/login?user=#{Base64.urlsafe_encode64(from_google_params.to_json)}" and return
    else
      flash[:alert] = t 'devise.omniauth_callbacks.failure', kind: 'Google', reason: "#{auth.info.email} is not authorized."
      redirect_to new_admin_session_path and return
    end
  end  
  protected

  def after_omniauth_failure_path_for(_scope)
    new_admin_session_path
  end

  def after_sign_in_path_for(resource_or_scope)
    stored_location_for(resource_or_scope) || root_path
  end

  private
  def from_google_params
    @from_google_params ||= {
      uid: auth.uid,
      email: auth.info.email,
      full_name: auth.info.name,
      avatar_url: auth.info.image
    }
  end

  def auth
    @auth = request.env['omniauth.auth']
  end

  def create_user_if_not_exists(auth_params)
    User.find_or_create_by(email: auth_params[:email]) do |user|
      user.name = auth_params[:full_name]
      user.major = ""
      user.graduation_year = 0
      user.user_profile_url = "/profilePix/default.jpg"
      user.biography = ""
    end
  end
end
