

# 1. No session cookie -> middleware rejects request
GET {{baseurl}}/api/surveys/list
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# 2. Invalid session cookie -> middleware rejects request
GET {{baseurl}}/api/surveys/list
Cookie: session=not-a-valid-jwt
HTTP 401
[Asserts]
jsonpath "$.error" == "Invalid token"





# 3. Create/login first so Hurl's cookie jar receives session cookie
POST {{baseurl}}/api/auth/login
Content-Type: application/json
{
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true


#  4. now getting a valid coookie 
GET {{baseurl}}/api/surveys/list
HTTP 200
[Asserts] 
  jsonpath "$.success" == true

  
# 4. Create a new survey
POST {{baseurl}}/api/surveys/build
Content-Type: application/json
{
  "title": "{{surveytitle}}",
  "branding": {
    "themeColor": "#0070f3",
    "logoUrl": "https://example.com/logo.png"
  },
  "questions": [
    {
      "label": "What is your favorite color?",
      "type": "text",
      "options": []
    },
    {
      "label": "What is your age?",
      "type": "number",
      "options": []
    },
    {
      "label": "Choose your plan",
      "type": "select",
      "options": ["Free", "Pro", "Enterprise"]
    }
  ]
}

HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.surveyId" exists
[Captures]
created_survey_id: jsonpath "$.surveyId"

# 2.Fetch the survey list and verify the created survey is present

GET {{baseurl}}/api/surveys/list
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.surveys" isCollection
jsonpath "$.surveys[?(@.id == '{{created_survey_id}}')].title" == "{{surveytitle}}"
jsonpath "$.surveys[?(@.id == '{{created_survey_id}}')].questions_count" == 3

# 3. Check responses endpoint for the newly created survey
GET {{baseurl}}/api/surveys/{{created_survey_id}}/responses
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.responses" isCollection

# 4. Reject an invalid survey payload
POST {{baseurl}}/api/surveys/build
Content-Type: application/json
{
  "title": "Invalid survey"
}
HTTP 400
[Asserts]
jsonpath "$.success" == false
jsonpath "$.error" == "Invalid survey schema payload."

# 5. Reject an unauthenticated responses request
GET {{baseurl}}/api/surveys/{{created_survey_id}}/responses
Cookie: session=not-a-valid-jwt
HTTP 401
[Asserts]
jsonpath "$.error" == "Invalid token"