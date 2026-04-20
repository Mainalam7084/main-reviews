# Security Policy

## Reporting Security Vulnerabilities

**Please do not publicly disclose security vulnerabilities.** If you discover a security vulnerability, please report it responsibly by emailing [security@example.com](mailto:security@example.com) with the following information:

- Description of the vulnerability
- Affected components or versions
- Steps to reproduce (if applicable)
- Potential impact
- Your recommended fix (if you have one)

We take all security reports seriously and will:
1. Acknowledge receipt of your report within 48 hours
2. Investigate and confirm the vulnerability
3. Work on a fix and timeline for release
4. Keep you informed of our progress
5. Credit you in the release notes (unless you prefer anonymity)

## Supported Versions

We provide security updates for:

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.x (Current) | ✅ Yes | Latest version, receives all updates |
| 0.x | ❌ No | Legacy version, no longer maintained |

We recommend always using the latest version to ensure you have the latest security patches.

## Security Best Practices

### For Developers

#### 1. Dependency Management

- Keep all dependencies up to date
- Review dependency updates before merging
- Use `npm audit` regularly to check for vulnerabilities
- Remove unused dependencies
- Use exact versions for security-critical packages when appropriate

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically (with caution)
npm audit fix

# Review what npm audit fix would change
npm audit fix --dry-run
```

#### 2. Environment Variables & Secrets

**Never commit secrets to the repository.**

Required secrets (must be set as environment variables):
- `NEXTAUTH_SECRET` - Session encryption key
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - NextAuth callback URL
- API Keys (TMDB, OMDb)

Example `.env.local` (never commit this file):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/main_reviews
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_TMDB_API_KEY=your_api_key
NEXT_PUBLIC_OMDB_API_KEY=your_api_key
```

**Guidelines:**
- Use `.env.local` for local development (add to `.gitignore`)
- Use your hosting provider's secret management for production
- Rotate secrets regularly
- Use strong, randomly generated secrets (min 32 characters)

#### 3. Authentication & Authorization

- NextAuth.js handles session management securely
- Password hashing uses bcryptjs with proper salt rounds
- JWT tokens are used for session persistence
- Implement proper role-based access control (RBAC)
- Validate user permissions on both client and server
- Use HTTPS only in production

#### 4. Database Security

- Use parameterized queries (Prisma handles this automatically)
- Implement proper database access controls
- Use strong database passwords
- Enable SSL/TLS for database connections in production
- Regularly backup your database
- Implement row-level security policies where appropriate

```typescript
// Good - Prisma prevents SQL injection
const review = await prisma.review.findUnique({
  where: { id: userId }
});

// Avoid - Direct string interpolation (Prisma doesn't allow this)
// const query = `SELECT * FROM reviews WHERE userId = ${userId}`;
```

#### 5. API Security

**Input Validation:**
```typescript
// Always validate and sanitize user input
import { z } from 'zod';

const reviewSchema = z.object({
  title: z.string().min(1).max(255),
  rating: z.number().min(1).max(10),
  content: z.string().max(5000),
});

export async function createReview(data: unknown) {
  const validated = reviewSchema.parse(data);
  // proceed with validated data
}
```

**Rate Limiting:**
- Implement rate limiting on sensitive endpoints
- Use middleware to prevent abuse
- Monitor for unusual patterns

**CORS:**
- Configure CORS appropriately for your domain
- Only allow trusted origins
- Use credentials only when necessary

#### 6. XSS Prevention

- React automatically escapes content in JSX
- Use `dangerouslySetInnerHTML` only with sanitized content
- Sanitize any user-generated HTML with libraries like `DOMPurify`

```typescript
// Good - React escapes by default
<div>{userContent}</div>

// Be careful with
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userHtml) 
}} />
```

#### 7. CSRF Protection

- NextAuth.js handles CSRF tokens automatically
- Always use same-site cookies
- Validate the origin of requests

#### 8. Data Protection

**User Data:**
- Only collect necessary user data
- Implement data retention policies
- Allow users to delete their data
- Encrypt sensitive data at rest and in transit
- Use HTTPS for all communications

**Public Reviews:**
- Clearly indicate which content is public
- Provide options to make reviews private
- Implement proper access controls

#### 9. Logging & Monitoring

- Log security-relevant events
- Never log sensitive information (passwords, tokens, API keys)
- Monitor for suspicious activity
- Set up alerts for unusual patterns

```typescript
// Good - log security events without sensitive data
console.log(`User ${userId} attempted unauthorized access to review ${reviewId}`);

// Avoid - logging sensitive data
console.log(`User login: ${email}, password: ${password}`);
```

### For Deployment

#### Production Environment

1. **HTTPS/TLS**
   - Use HTTPS for all connections
   - Use valid SSL/TLS certificates
   - Implement HSTS headers

2. **Security Headers**
   ```typescript
   // next.config.ts
   const securityHeaders = [
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
     {
       key: 'X-Frame-Options',
       value: 'DENY'
     },
     {
       key: 'X-XSS-Protection',
       value: '1; mode=block'
     },
     {
       key: 'Referrer-Policy',
       value: 'strict-origin-when-cross-origin'
     }
   ];
   ```

3. **Content Security Policy**
   - Define CSP headers to prevent XSS attacks
   - Restrict script sources to trusted origins

4. **Database**
   - Use strong, unique passwords
   - Enable encryption at rest and in transit
   - Restrict database access to application servers only
   - Implement regular automated backups
   - Test backup restoration procedures

5. **Dependency Updates**
   - Keep all dependencies current
   - Use automated tools like Dependabot
   - Review and test updates before deploying
   - Have a process for emergency security patches

6. **Monitoring & Logging**
   - Enable audit logging
   - Monitor for suspicious activities
   - Set up alerts for security events
   - Regularly review logs

7. **Access Control**
   - Use strong authentication for infrastructure
   - Limit admin/deployment access
   - Use SSH keys instead of passwords
   - Implement MFA where possible

8. **Secrets Management**
   - Use your hosting provider's secret management
   - Never hardcode secrets
   - Rotate secrets regularly
   - Use different secrets for different environments

## Third-Party Services

### TMDB API
- Requires API key (not sensitive if it's public)
- Rate limiting applies
- Terms of service must be followed

### OMDb API
- Requires API key (not sensitive if it's public)
- Rate limiting applies
- Paid plans available for higher limits

### NextAuth.js
- Validate session tokens
- Configure secure cookie settings
- Use HTTPS in production

## Data Privacy

### Local Mode
- Data stored in browser (IndexedDB)
- No data sent to server
- User has full control of their data
- Clear privacy expectations

### Cloud Mode
- Reviews stored in database
- Accessible from any device after login
- User can choose public or private visibility
- User can delete their data

## Incident Response

If you discover or are informed of a security incident:

1. **Assess the Risk**
   - Determine severity and scope
   - Identify affected users/data

2. **Contain the Threat**
   - Take affected systems offline if necessary
   - Prevent further unauthorized access

3. **Investigate & Fix**
   - Determine root cause
   - Implement fix/patch
   - Test thoroughly

4. **Communicate**
   - Notify affected users
   - Provide guidance on actions to take
   - Be transparent about the incident

5. **Review & Improve**
   - Conduct post-incident review
   - Update security practices
   - Implement preventive measures

## Security Checklist

Before deploying to production:

- [ ] All secrets are properly set as environment variables
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Database credentials are strong and unique
- [ ] All dependencies are up to date
- [ ] No secrets are committed to git
- [ ] Authentication is properly implemented
- [ ] Input validation is in place
- [ ] Output encoding is correct
- [ ] Error messages don't reveal sensitive information
- [ ] Logging is configured without sensitive data
- [ ] Rate limiting is implemented
- [ ] CORS is properly configured
- [ ] Database backups are tested
- [ ] Monitoring and alerting is active
- [ ] Security audit has been performed

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [npm Security Advisories](https://www.npmjs.com/advisories/)

## Questions?

If you have questions about security, please:
1. Check this document and existing issues
2. Open a discussion in the repository
3. Contact the maintainers

Thank you for helping keep Main Reviews secure! 🔒
