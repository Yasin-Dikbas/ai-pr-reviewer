class ChangeGithubIdsToBigint < ActiveRecord::Migration[8.1]
  def change
    # GitHub's numeric IDs (users, repos, PRs) can exceed Postgres's 4-byte
    # integer range, so these need to be bigint.
    change_column :users, :github_id, :bigint
    change_column :repositories, :github_repo_id, :bigint
    change_column :pull_requests, :github_pr_id, :bigint
  end
end
