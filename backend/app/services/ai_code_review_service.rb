require "faraday"

class AiCodeReviewService
  MAX_DIFF_CHARS = 24_000
  API_BASE = "https://generativelanguage.googleapis.com/v1beta/"

  SYSTEM_PROMPT = <<~PROMPT
    You are a senior software engineer reviewing a GitHub pull request diff.
    Point out real bugs, security issues, and clear best-practice violations only.
    Ignore style nitpicks. Be concise. If the diff looks fine, say so plainly.

    Respond with JSON matching exactly this shape:
    {
      "summary": "2-3 sentence overall assessment",
      "findings": [
        { "file": "path/to/file", "line": 42, "severity": "high|medium|low", "comment": "what's wrong and why" }
      ]
    }
  PROMPT

  def initialize(model: ENV.fetch("GEMINI_MODEL", "gemini-2.5-flash"))
    @api_key = ENV.fetch("GEMINI_API_KEY")
    @model = model
  end

  def review_diff(diff)
    truncated = diff.to_s.first(MAX_DIFF_CHARS)

    response = connection.post("models/#{@model}:generateContent") do |req|
      req.params["key"] = @api_key
      req.body = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: "Diff:\n\n#{truncated}" }] }],
        generationConfig: { response_mime_type: "application/json" }
      }
    end

    raise "Gemini API error (#{response.status}): #{response.body}" unless response.success?

    content = response.body.dig("candidates", 0, "content", "parts", 0, "text")
    JSON.parse(content)
  end

  private

  def connection
    Faraday.new(url: API_BASE) do |f|
      f.request :json
      f.response :json
      f.adapter Faraday.default_adapter
    end
  end
end
