class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.integer :github_id
      t.string :github_username
      t.string :name
      t.string :email
      t.string :avatar_url
      t.text :github_token

      t.timestamps
    end
    add_index :users, :github_id, unique: true
  end
end
