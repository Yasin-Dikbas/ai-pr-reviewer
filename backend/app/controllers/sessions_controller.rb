class SessionsController < ApplicationController
  skip_before_action :authenticate_request!, only: [:create, :failure]

  # GET /auth/github/callback
  def create
    auth = request.env["omniauth.auth"]
    user = User.from_omniauth(auth)
    token = JsonWebToken.encode(user_id: user.id)

    redirect_to "#{ENV.fetch('FRONTEND_URL')}/auth/callback?token=#{token}", allow_other_host: true
  end

  # GET /auth/failure
  def failure
    redirect_to "#{ENV.fetch('FRONTEND_URL')}/login?error=#{params[:message]}", allow_other_host: true
  end

  # GET /api/me
  def show
    render json: {
      id: current_user.id,
      github_username: current_user.github_username,
      name: current_user.name,
      avatar_url: current_user.avatar_url
    }
  end
end
