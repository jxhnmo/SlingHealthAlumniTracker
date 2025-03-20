Rails.application.routes.draw do
  root to: 'frontend#index'
  devise_for :admins, controllers: { omniauth_callbacks: 'admins/omniauth_callbacks' }
  get 'admins/auth/google_oauth2/callback', to: 'admins/omniauth_callbacks#google_oauth2'
  get "/*path", to: redirect('/'), constraints: ->(req) { !req.xhr? && req.format.html? }
  devise_scope :admin do
    get 'admins/sign_in', to: 'admins/sessions#new', as: :new_admin_session
    get 'admins/sign_out', to: 'admins/sessions#destroy', as: :destroy_admin_session
  end

  resources :users
  resources :achievements
  resources :contact_methods
  
end
