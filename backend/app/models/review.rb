class Review < ApplicationRecord
  belongs_to :pull_request

  enum :status, { pending: "pending", running: "running", completed: "completed", failed: "failed" },
    default: "pending", validate: true
end
