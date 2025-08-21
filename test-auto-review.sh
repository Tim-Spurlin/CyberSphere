#!/bin/bash

# 🧪 Auto-Review System Test Script
# This script validates the auto-review and merge functionality

echo "🚀 Testing CyberSphere Auto-Review System"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_exit_code="$3"
    
    echo -e "\n${BLUE}📋 Testing: $test_name${NC}"
    
    if eval "$command"; then
        if [ "$expected_exit_code" = "0" ]; then
            echo -e "${GREEN}✅ PASSED: $test_name${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAILED: $test_name (expected failure but command succeeded)${NC}"
            ((TESTS_FAILED++))
        fi
    else
        if [ "$expected_exit_code" != "0" ]; then
            echo -e "${GREEN}✅ PASSED: $test_name (expected failure)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}❌ FAILED: $test_name${NC}"
            ((TESTS_FAILED++))
        fi
    fi
}

# Change to project directory
cd "$(dirname "$0")/system-security-hardening-dashboard" || {
    echo "❌ Failed to change to project directory"
    exit 1
}

echo -e "\n${YELLOW}🔧 Setting up test environment...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

echo -e "\n${YELLOW}🧪 Running code quality tests...${NC}"

# Test 1: TypeScript compilation
run_test "TypeScript Compilation" "npm run typecheck" "0"

# Test 2: ESLint configuration
run_test "ESLint Configuration" "test -f .eslintrc.json" "0"

# Test 3: Build process
run_test "Build Process" "npm run build" "0"

# Test 4: Workflow file validation
echo -e "\n${YELLOW}🔍 Validating GitHub Actions workflows...${NC}"

run_test "Auto-Review Workflow Exists" "test -f ../.github/workflows/auto-review.yml" "0"
run_test "Dependabot Workflow Exists" "test -f ../.github/workflows/dependabot-auto-merge.yml" "0"
run_test "Auto-Merge Controller Exists" "test -f ../.github/workflows/auto-merge-controller.yml" "0"

# Test 5: Configuration files
run_test "Auto-Review Config Exists" "test -f ../.github/auto-review-config.json" "0"
run_test "Auto-Review Documentation Exists" "test -f ../.github/AUTO_REVIEW_CONFIG.md" "0"

# Test 6: Workflow syntax validation (if yamllint is available)
if command -v yamllint &> /dev/null; then
    run_test "Auto-Review Workflow Syntax" "yamllint ../.github/workflows/auto-review.yml" "0"
    run_test "Dependabot Workflow Syntax" "yamllint ../.github/workflows/dependabot-auto-merge.yml" "0"
    run_test "Auto-Merge Controller Syntax" "yamllint ../.github/workflows/auto-merge-controller.yml" "0"
else
    echo -e "${YELLOW}⚠️ yamllint not found, skipping YAML syntax validation${NC}"
fi

# Test 7: Configuration JSON validity
run_test "Auto-Review Config JSON Valid" "python3 -m json.tool ../.github/auto-review-config.json > /dev/null" "0"

# Test 8: Package.json scripts
run_test "NPM Scripts Exist" "npm run 2>&1 | grep -q 'typecheck\\|lint\\|build'" "0"

echo -e "\n${YELLOW}📊 Simulating quality score calculation...${NC}"

# Test 9: Quality scoring simulation
QUALITY_SCORE=100

# Check for TypeScript errors
if ! npm run typecheck > /dev/null 2>&1; then
    QUALITY_SCORE=$((QUALITY_SCORE - 20))
fi

# Check for lint issues
if ! npm run lint > /dev/null 2>&1; then
    QUALITY_SCORE=$((QUALITY_SCORE - 10))
fi

# Check for build issues
if ! npm run build > /dev/null 2>&1; then
    QUALITY_SCORE=$((QUALITY_SCORE - 30))
fi

echo -e "🎯 Calculated Quality Score: ${QUALITY_SCORE}/100"

if [ $QUALITY_SCORE -ge 90 ]; then
    echo -e "${GREEN}🟢 Auto-merge eligible${NC}"
    run_test "Quality Score Auto-Merge Threshold" "true" "0"
elif [ $QUALITY_SCORE -ge 80 ]; then
    echo -e "${YELLOW}🟡 Auto-approve eligible${NC}"
    run_test "Quality Score Auto-Approve Threshold" "true" "0"
else
    echo -e "${RED}🔴 Manual review required${NC}"
    run_test "Quality Score Below Threshold" "false" "1"
fi

# Summary
echo -e "\n${BLUE}📋 Test Summary${NC}"
echo "==============="
echo -e "✅ Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "❌ Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "📊 Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Auto-review system is ready.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️ Some tests failed. Please review the issues above.${NC}"
    exit 1
fi