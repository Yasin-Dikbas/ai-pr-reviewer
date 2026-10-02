class CreateRepositories < ActiveRecord::Migration[8.1]
  def change
    create_table :repositories do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :github_repo_id
      t.string :full_name
      t.boolean :active, default: true, null: false

      t.timestamps
    end
    add_index :repositories, :github_repo_id, unique: true
  end
end
