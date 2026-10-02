class AnalyzePullRequestJob < ApplicationJob
  queue_as :default

  def perform(pull_request_id)
    pull_request = PullRequest.find(pull_request_id)
    repository = pull_request.repository
    review = pull_request.reviews.create!(status: :running)

    github = GithubService.new(repository.user)
    diff = github.pull_request_diff(repository.full_name, pull_request.number)

    result = AiCodeReviewService.new.review_diff(diff)

    review.update!(
      status: :completed,
      summary: result["summary"],
      findings: result["findings"],
      model_used: ENV.fetch("OPENAI_MODEL", "gpt-4o-mini")
    )

    comment = build_comment(result)
    github.create_pr_comment(repository.full_name, pull_request.number, comment)
  rescue => e
    review&.update(status: :failed, error_message: e.message)
    raise
  end

  private

  def build_comment(result)
    lines = ["### 🤖 AI Code Review\n", result["summary"], ""]

    Array(result["findings"]).each do |finding|
      lines << "- **#{finding['severity']&.upcase}** `#{finding['file']}:#{finding['line']}` — #{finding['comment']}"
    end

    lines.join("\n")
  end
end
