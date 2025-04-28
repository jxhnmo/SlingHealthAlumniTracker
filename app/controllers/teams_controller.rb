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

    if params[:id].blank?
      @team = Team.new(team_params)

      if @team.save
        TeamsUser.create(user_id: params[:user_id], team_id: @team.id) if params[:user_id].present?
        render json: @team, status: :created
      else
        render json: @team.errors, status: :unprocessable_entity
      end
    else

      if @team.update(team_params)
        if params[:user_id].present?
          TeamsUser.find_or_create_by(user_id: params[:user_id], team_id: @team.id)
        end
        render json: @team
      else
        render json: @team.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    @team.destroy
  end

  private

  def set_team
    if params[:id].present?
      @team = Team.find(params[:id])
    else
      @team = nil
    end
  end

  def team_params
    params.require(:team).permit(:team_name, :team_area, :user_id)
  end

end