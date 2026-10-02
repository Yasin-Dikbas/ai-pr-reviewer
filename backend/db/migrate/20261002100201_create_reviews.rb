class CreateReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :reviews do |t|
      t.references :pull_request, null: false, foreign_key: true
      t.string :status, default: "pending", null: false
      t.text :summary
      t.jsonb :findings
      t.string :model_used
      t.text :error_message

      t.timestamps
    end
  end
end
