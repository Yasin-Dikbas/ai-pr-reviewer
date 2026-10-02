class AiCodeReviewService
  MAX_DIFF_CHARS = 24_000

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

  def initialize(model: ENV.fetch("OPENAI_MODEL", "gpt-4o-mini"))
    @client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))
    @model = model
  end

  def review_diff(diff)
    truncated = diff.to_s.first(MAX_DIFF_CHARS)

    response = @client.chat(
      parameters: {
        model: @model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: "Diff:\n\n#{truncated}" }
        ]
      }
    )

    content = response.dig("choices", 0, "message", "content")
    JSON.parse(content)
  end
end
