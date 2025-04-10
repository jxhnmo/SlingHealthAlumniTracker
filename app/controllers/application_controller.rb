class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  before_action :authenticate_admin!, unless: -> { request.format.json? }

  def fallback_index_html
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end