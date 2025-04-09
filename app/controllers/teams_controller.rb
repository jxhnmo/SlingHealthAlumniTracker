class TeamsController < ApplicationController
    before_action :set_team, only: [ :update, :destroy ]

  def create
    @team = Team.new(team_params)

    if @team.save

      if params[:user_id]
        TeamsUser.create(user_id: params[:user_id], team_id: @team.id)
      end
      render json: @team, status: :created, location: @team
    else
      render json: @team.errors, status: :unprocessable_entity
    end
  end

  def update
    if @team.update(team_params)
      render json: @team
    else
      render json: @team.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @team.destroy
  end

  private

  def set_team
    @team = Team.find(params[:id])
  end

  def team_params
    params.require(:team).permit(:team_name, :team_area)
  end

end