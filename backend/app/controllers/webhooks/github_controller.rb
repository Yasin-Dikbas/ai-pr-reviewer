module Webhooks
  class GithubController < ApplicationController
    skip_before_action :authenticate_request!
    before_action :verify_signature!

    # POST /webhooks/github
    def create
      case request.headers["X-GitHub-Event"]
      when "pull_request"
        handle_pull_request_event
      end

      head :ok
    end

    private

    def verify_signature!
      signature = "sha256=" + OpenSSL::HMAC.hexdigest(
        "SHA256", ENV.fetch("GITHUB_WEBHOOK_SECRET"), raw_payload
      )

      unless ActiveSupport::SecurityUtils.secure_compare(signature, request.headers["X-Hub-Signature-256"].to_s)
        head :unauthorized
      end
    end

    def raw_payload
      @raw_payload ||= request.body.read
    end

    def payload
      @payload ||= JSON.parse(raw_payload)
    end

    def handle_pull_request_event
      return unless %w[opened synchronize reopened].include?(payload["action"])

      repository = Repository.find_by(github_repo_id: payload.dig("repository", "id"))
      return unless repository&.active?

      pr_data = payload["pull_request"]
      pull_request = repository.pull_requests.find_or_initialize_by(github_pr_id: pr_data["id"])
      pull_request.assign_attributes(
        number: pr_data["number"],
        title: pr_data["title"],
        state: pr_data["state"],
        html_url: pr_data["html_url"],
        head_sha: pr_data["head"]["sha"],
        author_login: pr_data["user"]["login"]
      )
      pull_request.save!

      AnalyzePullRequestJob.perform_later(pull_request.id)
    end
  end
end
