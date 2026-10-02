class ApplicationController < ActionController::API
  before_action :authenticate_request!

  attr_reader :current_user

  private

  def authenticate_request!
    header = request.headers["Authorization"]
    token = header&.split(" ")&.last
    decoded = token && JsonWebToken.decode(token)

    @current_user = decoded && User.find_by(id: decoded[:user_id])

    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  end
end
