# 🤖 CyberSphere Auto-Review & Merge Guide

## Quick Start for Contributors

### 1. Create Your Pull Request
```bash
git checkout -b feature/my-awesome-feature
# Make your changes
git add .
git commit -m "Add awesome feature"
git push origin feature/my-awesome-feature
```

### 2. Automated Review Process
Once you create a PR, the system will automatically:
- 🔍 Analyze your code quality
- 🛡️ Scan for security vulnerabilities  
- 🧪 Run TypeScript and build checks
- 📊 Calculate a quality score (0-100)
- 💬 Post detailed feedback as a comment

### 3. Quality Thresholds
- **🟢 90-100**: Excellent - Eligible for auto-merge
- **🟡 80-89**: Good - Auto-approved, manual merge needed
- **🟠 60-79**: Fair - Review required, improvements suggested
- **🔴 0-59**: Poor - Blocked until issues are fixed

### 4. Auto-Merge (Optional)
To enable auto-merge for high-quality PRs:
1. Ensure your PR gets a score ≥ 90
2. Add the `auto-merge` label to your PR
3. Wait for approval (automatic or manual)
4. PR will merge automatically when all checks pass

## Labels Reference

### Auto-Applied Labels
- `auto-reviewed` - System has analyzed the PR
- `high-quality` - Quality score ≥ 85
- `security-checked` - Security scan completed

### Manual Control Labels
- `auto-merge` - Enable auto-merge for this PR
- `do-not-merge` - Prevent any automatic merging
- `skip-review` - Skip automated review (maintainers only)

## For Maintainers

### Branch Protection Setup
Recommended settings for `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

### Required Status Checks
Add these to your branch protection:
- `code-quality / 🔍 Code Quality Analysis`
- `security-analysis / 🛡️ Security Analysis`

### Configuration
Edit `.github/auto-review-config.json` to adjust:
- Quality score thresholds
- Security audit levels
- Merge policies
- Notification settings

### Workflow Overrides
Maintainers can always:
- Manually approve/merge any PR
- Use `do-not-merge` label to prevent auto-merge
- Adjust quality thresholds via config
- Disable auto-review with `skip-review` label

## Troubleshooting

### PR Not Getting Auto-Reviewed
- Check if workflows are enabled in repository settings
- Verify PR targets `main` or `develop` branch
- Ensure no `skip-review` label is applied

### Auto-Merge Not Working
- Verify quality score ≥ 90
- Check that `auto-merge` label is applied
- Ensure all status checks are passing
- Confirm branch protection rules allow auto-merge

### Quality Score Lower Than Expected
Common issues:
- TypeScript errors (-10 points each)
- ESLint warnings (-5 points each)
- Security vulnerabilities (-20 points each)
- Build failures (blocks review)

### Security Scan Failures
- Run `npm audit` locally to identify issues
- Update vulnerable dependencies
- Use `npm audit fix` for automatic fixes
- Check if vulnerabilities are in dev dependencies only

## Advanced Usage

### Custom Review Rules
Create `.github/auto-review-rules.yml`:
```yaml
rules:
  - name: "Large PR Warning"
    condition: "files_changed > 50"
    action: "comment"
    message: "This PR is quite large. Consider breaking it into smaller PRs."
  
  - name: "Documentation Required"
    condition: "has_code_changes && !has_docs_changes"
    action: "request_changes"
    message: "Please update documentation for code changes."
```

### Webhook Integration
For external tools, use GitHub webhooks:
- `pull_request` events for PR creation/updates
- `check_run` events for status updates
- `pull_request_review` events for review state

## Best Practices

### For High-Quality PRs
1. **Write TypeScript**: Use proper types and interfaces
2. **Follow ESLint Rules**: Fix all linting warnings
3. **Add Tests**: Include unit tests for new features
4. **Update Docs**: Keep README and comments current
5. **Small PRs**: Keep changes focused and reviewable

### Security Considerations
- Never commit secrets or API keys
- Keep dependencies updated
- Use secure coding practices
- Review third-party packages carefully

### Performance Tips
- Use meaningful commit messages
- Link to relevant issues
- Add clear PR descriptions
- Test locally before pushing

---

*The auto-review system is designed to help maintain code quality while accelerating development. Human judgment always takes precedence over automated decisions.*