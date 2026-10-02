# 1. Signup
POST {{baseurl}}/api/auth/signup
Content-Type: application/json
{
  "name": "{{testname}}",
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

# 2. Verify authenticated state
GET {{baseurl}}/api/auth/me
HTTP 200
[Asserts]
jsonpath "$.authenticated" == true
jsonpath "$.user.email" == "{{testuser}}"

# 3. Logout
POST {{baseurl}}/api/auth/logout
HTTP 200
[Asserts]
jsonpath "$.success" == true

# 4. Verify unauthenticated state
GET {{baseurl}}/api/auth/me
HTTP 401
[Asserts]
jsonpath "$.authenticated" == false

# 5. Login
POST {{baseurl}}/api/auth/login
Content-Type: application/json
{
  "email": "{{testuser}}",
  "password": "{{testpass}}"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true

# 6. Verify authenticated state after login
GET {{baseurl}}/api/auth/me
HTTP 200
[Asserts]
jsonpath "$.authenticated" == true
jsonpath "$.user.email" == "{{testuser}}"