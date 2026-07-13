# SECURITY_RULES.md
Version: 1.0
Priority: CRITICAL

################################################################################
# OBJECTIVE
################################################################################

This document defines the mandatory security standards for the entire project.

These rules override implementation convenience.

Whenever there is a conflict between speed and security:

SECURITY ALWAYS WINS.

Never implement functionality that knowingly introduces a security vulnerability.

Always explain any remaining security risk.

################################################################################
# SECURITY PHILOSOPHY
################################################################################

Always follow:

- Secure by Design
- Privacy by Design
- Principle of Least Privilege
- Defense in Depth
- Zero Trust
- Fail Secure
- Explicit Authorization
- Secure Defaults

Never assume any input is trusted.

Never assume any client is trusted.

Never assume the frontend is trusted.

################################################################################
# AUTHENTICATION
################################################################################

Always:

- Secure sessions
- HttpOnly Cookies
- Secure Cookies
- SameSite=Lax or Strict
- Session expiration
- Session rotation after login
- Session invalidation on logout
- Device-aware sessions
- MFA architecture ready

Never:

- LocalStorage tokens
- Session IDs inside URLs
- Plain session storage

Passwords:

Use Argon2id.

Fallback:

bcrypt >= 12 rounds.

Never use:

MD5

SHA1

SHA256 as password hash

################################################################################
# AUTHORIZATION
################################################################################

Every request MUST verify:

Authentication

AND

Authorization.

Never trust hidden buttons.

Never trust frontend validation.

Implement RBAC.

Minimum roles:

- Super Admin
- Admin
- Doctor
- Reception
- User

Every endpoint checks permissions.

################################################################################
# MULTI TENANCY
################################################################################

Every request MUST verify:

Tenant ID

Organization ID

User ownership

Never allow one clinic to access another clinic.

Every database query MUST be tenant scoped.

################################################################################
# DATABASE
################################################################################

Always:

ORM

Prepared Statements

Parameterized Queries

Transactions

Foreign Keys

Indexes

Backups

Encryption at rest

Never:

Raw SQL concatenation.

################################################################################
# INPUT VALIDATION
################################################################################

Validate ALL input.

Server validation is mandatory.

Frontend validation is optional UX.

Sanitize:

HTML

Markdown

URLs

Filenames

Emails

Phone numbers

JSON

Query Parameters

Headers

################################################################################
# FILE UPLOADS
################################################################################

Always validate:

Extension

Mime Type

Size

Filename

Virus scan (future ready)

Rename uploaded files.

Never execute uploaded files.

################################################################################
# API SECURITY
################################################################################

Every endpoint must include:

Authentication

Authorization

Validation

Rate limiting

Error handling

Audit logging

Never expose stack traces.

Never expose secrets.

################################################################################
# RATE LIMITING
################################################################################

Protect:

Login

Register

Password Reset

OTP

Uploads

API

Search

Webhook endpoints

################################################################################
# SECRETS
################################################################################

Secrets NEVER belong inside:

Source Code

Git

Docker Images

Logs

Frontend

Only:

Environment Variables

Secret Manager

Rotate keys periodically.

################################################################################
# LOGGING
################################################################################

Log:

Login

Logout

Permission changes

User creation

User deletion

Data exports

Configuration changes

Failed logins

Never log:

Passwords

API Keys

Tokens

Sensitive medical information

################################################################################
# ENCRYPTION
################################################################################

HTTPS ONLY.

TLS 1.2+

Prefer TLS 1.3.

Enable HSTS.

Encrypt backups.

Encrypt sensitive database fields when appropriate.

################################################################################
# SECURITY HEADERS
################################################################################

Always configure:

Content-Security-Policy

X-Frame-Options

Referrer-Policy

Permissions-Policy

Strict-Transport-Security

X-Content-Type-Options

################################################################################
# CORS
################################################################################

Never:

Access-Control-Allow-Origin *

Only trusted origins.

################################################################################
# ERROR HANDLING
################################################################################

Users receive generic errors.

Logs receive detailed errors.

Never expose:

Stack traces

Database names

Server paths

Framework versions

################################################################################
# DEPENDENCIES
################################################################################

Use maintained libraries.

Update vulnerable packages.

Run dependency audit before deployment.

################################################################################
# DOCKER
################################################################################

Run as non-root.

Read-only filesystem where possible.

Health checks enabled.

Minimal image.

################################################################################
# BACKUPS
################################################################################

Automatic backups.

Encrypted backups.

Periodic restore testing.

################################################################################
# AUDIT TRAIL
################################################################################

Track:

Who

When

Where

What changed

Immutable logs preferred.

################################################################################
# OWASP
################################################################################

Design to mitigate common risks described by the OWASP Top 10, including injection attacks, broken access control, insecure design, security misconfiguration, vulnerable components, authentication failures, software integrity issues, insufficient logging, SSRF and related categories.

################################################################################
# PRIVACY
################################################################################

Collect minimum data.

Data minimization.

Purpose limitation.

Retention policies.

Support deletion.

Support export.

################################################################################
# AI
################################################################################

Never send secrets to AI.

Never expose API Keys.

Mask sensitive information whenever possible before sending prompts.

Log AI failures.

################################################################################
# DEPLOYMENT CHECKLIST
################################################################################

Before production:

[ ] HTTPS enabled

[ ] MFA working

[ ] Rate limiting enabled

[ ] CORS reviewed

[ ] CSP configured

[ ] Secrets verified

[ ] Backup verified

[ ] Logs verified

[ ] Health endpoint working

[ ] Dependency audit clean

[ ] Environment variables validated

[ ] Security review completed

################################################################################
# CLAUDE CODE DIRECTIVES
################################################################################

Before writing code:

1. Read this document.
2. Follow every mandatory rule.
3. If a request conflicts with security:
   - Explain why.
   - Offer a secure alternative.
4. After every implementation:
   - Perform a security self-review.
   - Identify possible vulnerabilities.
   - Suggest improvements.
5. Never reduce security without explicitly warning the developer.

################################################################################
# GOLDEN RULE
################################################################################

Write code as if tomorrow this SaaS will serve:

- 10,000 users
- Financially valuable businesses
- Sensitive personal information

Security must always be production-grade unless explicitly told otherwise.
