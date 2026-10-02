module Api
  class RepositoriesController < ApplicationController
    # GET /api/repositories
    def index
      render json: current_user.repositories.order(created_at: :desc)
    end

    # GET /api/repositories/github
    # Lists the current user's GitHub repos so they can pick one to connect.
    def github
      repos = GithubService.new(current_user).list_user_repos
      connected_ids = current_user.repositories.pluck(:github_repo_id)
      render json: repos.map { |r| r.merge(connected: connected_ids.include?(r[:id])) }
    end

    # POST /api/repositories
    def create
      repository = current_user.repositories.new(
        github_repo_id: params[:github_repo_id],
        full_name: params[:full_name]
      )

      if repository.save
        register_webhook(repository)
        render json: repository, status: :created
      else
        render json: { errors: repository.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/repositories/:id
    def destroy
      repository = current_user.repositories.find(params[:id])
      repository.destroy
      head :no_content
    end

    private

    def register_webhook(repository)
      callback_url = "#{request.base_url}/webhooks/github"
      GithubService.new(current_user).create_webhook(
        repository.full_name, callback_url, ENV.fetch("GITHUB_WEBHOOK_SECRET")
      )
    rescue Octokit::Error => e
      Rails.logger.warn("Could not register webhook for #{repository.full_name}: #{e.message}")
    end
  end
end
