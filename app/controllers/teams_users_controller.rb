class TeamsUsersController < ApplicationController
  # GET /teams_user?user_id=:user_id
  def index
    all_teams = Team.all
    render json: all_teams
  end

  def all
    teams_users = TeamsUser.all
    render json: teams_users
  end
end
