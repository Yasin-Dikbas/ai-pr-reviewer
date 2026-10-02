module Api
  class PullRequestsController < ApplicationController
    before_action :set_repository

    # GET /api/repositories/:repository_id/pull_requests
    # Refreshes the open PR list from GitHub, then returns what's stored locally.
    def index
      github = GithubService.new(current_user)
      github.list_open_pull_requests(@repository.full_name).each do |attrs|
        @repository.pull_requests.find_or_create_by!(github_pr_id: attrs[:github_pr_id]) do |pr|
          pr.assign_attributes(attrs)
        end.update!(attrs)
      end

      render json: @repository.pull_requests.order(number: :desc).includes(:reviews).map { |pr| pull_request_json(pr) }
    end

    # GET /api/repositories/:repository_id/pull_requests/:id
    def show
      pr = @repository.pull_requests.find(params[:id])
      render json: pull_request_json(pr, include_findings: true)
    end

    # POST /api/repositories/:repository_id/pull_requests/:id/analyze
    def analyze
      pr = @repository.pull_requests.find(params[:id])
      AnalyzePullRequestJob.perform_later(pr.id)
      render json: { status: "queued" }, status: :accepted
    end

    private

    def set_repository
      @repository = current_user.repositories.find(params[:repository_id])
    end

    def pull_request_json(pr, include_findings: false)
      review = pr.latest_review
      {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        html_url: pr.html_url,
        author_login: pr.author_login,
        review: review && {
          status: review.status,
          summary: review.summary,
          findings: include_findings ? review.findings : nil
        }
      }
    end
  end
end
