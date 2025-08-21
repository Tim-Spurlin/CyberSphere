# 🤖 CyberSphere Auto-Review Configuration

## Quality Thresholds

### Code Quality Scoring
- **Excellent (90-100)**: Auto-merge eligible with label
- **Good (80-89)**: Auto-approve, manual merge
- **Fair (60-79)**: Review required, suggest improvements
- **Poor (0-59)**: Block merge, require fixes

### Scoring Criteria
- TypeScript errors: -10 points each
- ESLint warnings: -5 points each
- ESLint errors: -10 points each
- Security vulnerabilities: -20 points each
- Missing tests: -15 points each

## Auto-Merge Criteria

### Required Conditions (ALL must be met):
1. ✅ Code quality score >= 90/100
2. ✅ No security vulnerabilities detected
3. ✅ All CI checks passing
4. ✅ PR has `auto-merge` label
5. ✅ Not a dependabot PR
6. ✅ No merge conflicts
7. ✅ At least one approval (auto or manual)

### Excluded Conditions:
- ❌ Draft PRs
- ❌ WIP (Work in Progress) in title
- ❌ Has `do-not-merge` label
- ❌ Has open change requests
- ❌ Failing required status checks

## Review Rules

### Automatic Reviews Triggered On:
- New PR creation
- PR updates (new commits)
- Manual workflow dispatch

### Review Scope:
- TypeScript/JavaScript files (.ts, .tsx, .js, .jsx)
- Configuration files (.json, .yml, .yaml)
- Documentation files (.md)
- Workflow files (.github/workflows/*)

### Security Checks:
- npm audit for dependency vulnerabilities
- Static code analysis
- Secrets detection
- Workflow security validation

## Labels

### Auto-applied Labels:
- `auto-reviewed` - Applied when auto-review completes
- `high-quality` - Applied when quality score >= 85
- `security-checked` - Applied when security scan passes
- `ready-for-review` - Applied when all automated checks pass

### Manual Labels for Control:
- `auto-merge` - Enable auto-merge for high-quality PRs
- `do-not-merge` - Prevent any automatic merging
- `skip-review` - Skip automated review (maintainers only)
- `priority` - Fast-track review process

## Notification Settings

### Comments Posted:
- Detailed quality analysis
- Security scan results
- Improvement suggestions
- Merge status updates

### When to Notify:
- Quality score below 70
- Security vulnerabilities found
- Auto-approval granted
- Auto-merge enabled
- Merge blocked due to issues

## Integration Points

### GitHub Features Used:
- Pull Request Reviews
- Status Checks
- Auto-merge API
- Issue Comments
- Labels and Milestones

### External Tools:
- ESLint for code quality
- TypeScript compiler for type checking
- npm audit for security scanning
- Super Linter for additional validation

## Customization

### Environment Variables:
- `QUALITY_THRESHOLD_AUTO_APPROVE`: Default 85
- `QUALITY_THRESHOLD_AUTO_MERGE`: Default 90
- `SECURITY_AUDIT_LEVEL`: Default 'moderate'
- `ENABLE_AUTO_MERGE`: Default true

### Per-Repository Settings:
Configure in `.github/auto-review-config.json`:

```json
{
  "qualityThresholds": {
    "autoApprove": 85,
    "autoMerge": 90,
    "blockMerge": 60
  },
  "securitySettings": {
    "auditLevel": "moderate",
    "blockOnVulnerabilities": true
  },
  "reviewSettings": {
    "enableAutoReview": true,
    "enableAutoMerge": true,
    "requireHumanReview": false
  },
  "excludePatterns": [
    "docs/**",
    "*.md",
    "package-lock.json"
  ]
}
```

## Safety Measures

### Guardrails:
1. 🛡️ No auto-merge for breaking changes
2. 🛡️ Human override always available
3. 🛡️ Audit log of all automated actions
4. 🛡️ Rollback capabilities
5. 🛡️ Rate limiting on auto-actions

### Monitoring:
- Track auto-review accuracy
- Monitor false positive rates
- Review merge success rates
- Alert on system failures

---

*This configuration ensures safe, automated code review while maintaining human oversight and control.*