Rails.application.routes.draw do
  root "frontend#index"
  get "/*path", to: "frontend#index", constraints: ->(req) { !req.xhr? && req.format.html? }
  resources :users
end
