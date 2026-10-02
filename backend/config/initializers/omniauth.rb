Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github,
    ENV.fetch("GITHUB_CLIENT_ID", nil),
    ENV.fetch("GITHUB_CLIENT_SECRET", nil),
    scope: "read:user,user:email,repo"
end

OmniAuth.config.allowed_request_methods = [:get]
OmniAuth.config.silence_get_warning = true
