# asserts use to check result if its our expectation otherwise give error 
# JSONPATH is an method of digging stuffs from object for matching results 


POST {{basurl}}/api/auth/signup
Content-Type: application/json
{
  "name": "{{testname}}",
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

GET {{basurl}}/api/auth/me
HTTP 200
[Asserts]
jsonpath "$.authenticated" == true
jsonpath "$.user.email" == "{{testuser}}"

POST {{basurl}}/api/auth/logout
HTTP 200
[Asserts]
jsonpath "$.success" == true

GET {{basurl}}/api/auth/me
HTTP 401
[Asserts]
jsonpath "$.authenticated" == false

POST {{basurl}}/api/auth/login
Content-Type: application/json
{
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

GET {{basurl}}/api/auth/me
HTTP 200
[Asserts]
jsonpath "$.authenticated" == true
jsonpath "$.user.email" == "{{testuser}}"