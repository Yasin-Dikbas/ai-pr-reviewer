class GithubService
  def initialize(user)
    @client = Octokit::Client.new(access_token: user.github_token)
  end

  def list_user_repos
    @client.repos(nil, per_page: 100, sort: "pushed").map do |repo|
      { id: repo.id, full_name: repo.full_name, private: repo.private }
    end
  end

  def list_open_pull_requests(full_name)
    @client.pull_requests(full_name, state: "open").map do |pr|
      {
        github_pr_id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        html_url: pr.html_url,
        head_sha: pr.head.sha,
        author_login: pr.user.login
      }
    end
  end

  def pull_request_diff(full_name, number)
    @client.pull_request(full_name, number, accept: "application/vnd.github.v3.diff")
  end

  def create_pr_comment(full_name, number, body)
    @client.add_comment(full_name, number, body)
  end

  def create_webhook(full_name, callback_url, secret)
    @client.create_hook(
      full_name,
      "web",
      { url: callback_url, content_type: "json", secret: secret },
      { events: ["pull_request"], active: true }
    )
  end
end
