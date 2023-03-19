# EMPLOY API SPECIFICATIONS

## Features
## Authentication
### Email Login
Request Data
1. Email Address
2.  Password

Response Data
1. token => String
2. user => Object

### Signup
  Request Data
1. Full Name
2. Email Address
3. Password
4. Phone
5. User Type employee | employer

Response Data
1. token => String
2. user => Object

### OTP Request
  Request Data
1. Email Address

Response Data
1. token => String
2. user => Object

### Change Password
  Request Data
1. Old Password
2. New Password

Response Data
1. token => String
2. user => Object

### Password Reset (forgot password)
  Request Data
1. Email Address
2. OTP

Response Data
1. token => String
2. user => Object

### Email Verification
  Request Data
1. Email Address
2. OTP

Response Data
1. token => String
2. user => Object

### Logout
  Request Data
1. Email Address
2. OTP

Response Data
1. token => String
2. user => Object

### User Profile
1. Profile Display
  Request Data
2. User ID

  Response Data
1. user => Object

### Profile Update
  Request Data
1. Name | Avatar | Date of Birth | Gender | Address | Phone Number | Email

  Response Data
1. user => Object

### E-Learn
1. List All Courses
  Request Data
  None

Response Data
Courses => List

### List Enrolled Courses
Request Data
None

### Response Data
Courses => List

### Notification
List Notifications
Request Data
None

Response Data
Notifications => List
Resume Builder
Create Resume
Update Resume
Delete Resume
List Resume
Job Finder
List Jobs (By Most Recent)
Search Jobs
Apply for Job
Job Poster
Create Job
Update Job
Delete Job
Talent Finder
List Profile (Employee Profiles)
Profile Search
Payment/Subscription
Select Payment Plan
Support Center
Request Help
Report Problem
### Settings
Get Settings
Settings Update
