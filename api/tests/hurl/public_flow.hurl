# 1. Login so the Hurl cookie jar can create a survey for this flow
POST {{baseurl}}/api/auth/login
Content-Type: application/json
{
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

# 2. Create a survey used by the public handlers
POST {{baseurl}}/api/surveys/build
Content-Type: application/json
{
  "title": "Public API Survey",
  "branding": {
    "themeColor": "#0070f3"
  },
  "questions": [
    {
      "label": "What is your favorite color?",
      "type": "text",
      "options": []
    },
    {
      "label": "Choose your plan",
      "type": "select",
      "options": ["Free", "Pro"]
    }
  ]
}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.surveyId" exists
[Captures]
public_survey_id: jsonpath "$.surveyId"

# 3. Fetch the public survey layout
GET {{baseurl}}/api/public/survey/{{public_survey_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.survey.title" == "Public API Survey"
jsonpath "$.survey.questions" isCollection
jsonpath "$.survey.questions" count == 2
jsonpath "$.survey.questions[0].options" isCollection

# 4. Submit a valid public response
POST {{baseurl}}/api/public/survey/{{public_survey_id}}/respond
Content-Type: application/json
{
  "answers": {
    "What is your favorite color?": "Blue",
    "Choose your plan": "Pro"
  }
}
HTTP 201
[Asserts]
jsonpath "$.success" == true

# 5. Verify the submitted response through the authenticated survey handler
GET {{baseurl}}/api/surveys/{{public_survey_id}}/responses
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.responses" isCollection
jsonpath "$.responses" count == 1

# 6. Reject an invalid public response payload
POST {{baseurl}}/api/public/survey/{{public_survey_id}}/respond
Content-Type: application/json
{
  "answers": null
}
HTTP 400
[Asserts]
jsonpath "$.success" == false
jsonpath "$.error" == "Invalid answers payload schema format."

# 7. Return not found for a missing public survey
GET {{baseurl}}/api/public/survey/not-a-real-survey
HTTP 404
[Asserts]
jsonpath "$.success" == false
jsonpath "$.error" == "Survey form layout not found."
