class CreatePullRequests < ActiveRecord::Migration[8.1]
  def change
    create_table :pull_requests do |t|
      t.references :repository, null: false, foreign_key: true
      t.integer :github_pr_id
      t.integer :number
      t.string :title
      t.string :state
      t.string :html_url
      t.string :head_sha
      t.string :author_login

      t.timestamps
    end
    add_index :pull_requests, [:repository_id, :github_pr_id], unique: true
  end
end
