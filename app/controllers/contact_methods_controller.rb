class ContactMethodsController < ApplicationController
  before_action :set_contact_method, only: %i[ show update destroy ]

  # GET /contact_methods
  def index
    @contact_methods = ContactMethod.all

    render json: @contact_methods
  end

  # GET /contact_methods/1
  def show
    render json: @contact_method
  end

  # POST /contact_methods
  def create
    @contact_method = ContactMethod.new(contact_method_params)

    if @contact_method.save
      render json: @contact_method, status: :created, location: @contact_method
    else
      render json: @contact_method.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contact_methods/1
  def update
    if @contact_method.update(contact_method_params)
      render json: @contact_method
    else
      render json: @contact_method.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contact_methods/1
  def destroy
    @contact_method.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contact_method
      @contact_method = ContactMethod.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def contact_method_params
      params.require(:contact_method).permit(:contact_type, :info, :user_id)
    end
end
