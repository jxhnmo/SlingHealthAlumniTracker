class UsersController < ApplicationController
  before_action :set_user, only: %i[show update destroy]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if params[:user][:achievements_attributes].present?
      params[:user][:achievements_attributes].each do |achievement_params|
        if achievement_params[:id].blank?
          achievement_params[:user_id] = @user.id # Ensure the new achievement is linked to the user
        end
      end
    end

    if params[:user][:contacts_attributes].present?
      params[:user][:contact_methods_attributes].each do |contact_params|
        if contact_params[:id].blank?
          contact_params[:user_id] = @user.id
        end
      end
    end

    if params[:user][:teams_attributes].present?
      team_params = params[:user][:team_attributes]
      team = if team_params[:id].present?
        Team.find(team_params[:id]).tap { |t| t.update!(team_params.except(:id)) }
      else
        Team.create!(team_params)
      end
      TeamsUser.find_or_create_by!(user_id: @user.id)
    end
  
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
  

  # DELETE /users/1
  def destroy
    user = User.find(params[:id])
    TeamsUser.where(user_id: user.id).delete_all
    user.destroy
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(
      :name,
      :major,
      :graduation_year,
      :user_profile_url,
      :biography,
      :email,
      :availability,
      :isfaculty,
      achievements_attributes: [:id, :achievement_type, :name, :description, :user_id, :_destroy],
      contact_methods_attributes: [ :id, :contact_type, :info, :is_link, :_destroy],
      team_attributes: [:id, :team_name, :team_area, :user_id,  :_destroy]
    )
  end
  
  

end
