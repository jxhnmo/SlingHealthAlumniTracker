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

  def create
    teams_user = TeamsUser.new(teams_user_params)

    if teams_user.save
      render json: teams_user, status: :created
    else
      render json: teams_user.errors, status: :unprocessable_entity
    end
  end

  private

  def teams_user_params
    params.require(:teams_user).permit(:user_id, :team_id)
  end
end