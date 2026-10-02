Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "auth/:provider/callback", to: "sessions#create"
  get "auth/failure", to: "sessions#failure"

  namespace :api do
    get "me", to: "/sessions#show"
    get "repositories/github", to: "repositories#github"

    resources :repositories, only: [:index, :create, :destroy] do
      resources :pull_requests, only: [:index, :show] do
        post :analyze, on: :member
      end
    end
  end

  namespace :webhooks do
    post "github", to: "github#create"
  end
end
