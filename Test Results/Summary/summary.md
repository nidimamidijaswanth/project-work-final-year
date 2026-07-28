# Android Appium E2E Execution Summary

**Build Number**: #104  
**Execution Date**: 2026-07-27 16:38:00 UTC  
**Git Commit**: `e451ad407c13470d9af7c8ecc0ed712f`  
**Branch**: `main`  
**APK Version**: `v1.4.2-debug`  
**Device**: Android Emulator (Nexus 6)  
**Android Version**: 13.0 (API 33)  

---

### Execution Metrics

- **Total Test Cases**: **450**
- **Executed**: **450**
- **Passed**: **441**
- **Failed**: **6**
- **Skipped**: **3**
- **Blocked**: **0**
- **Pass Percentage**: **98.0%**
- **Fail Percentage**: **1.3%**
- **Execution Duration**: **14m 28s**

---

### Executed Test Case Highlights

#### PASSED TESTS (441 Test Cases)

- `TC_AUTH_001` - Valid User Mobile Login
- `TC_AUTH_002` - Logout Session Cleanup
- `TC_AUTHZ_001` - Admin Permission Access Guard
- `TC_REG_001` - User Registration Form Submit
- `TC_PROF_005` - Update User Avatar Image
- `TC_DASH_001` - Launch 25m Pomodoro Timer
- `TC_CRUD_001` - Create Custom Focus Goal Session
- `TC_SRCH_003` - Search Historical Focus Sessions
- `TC_SESS_001` - Session Persistence on App Resume
- `TC_REGR_050` - Complete End-to-End Regression Verification

#### FAILED TESTS (6 Test Cases)

- `TC_AUTH_015` - Invalid OTP Form Retry Limit (Reason: Assertion Error - Visibility timeout on Android Emulator)
- `TC_FORM_088` - Mandatory Input Field Validation (Reason: Validation message string missing on UI)
- `TC_FILE_012` - Large Attachment Upload (Reason: Network payload timeout)
- `TC_CRUD_038` - Bulk Goal Deletion Confirmation (Reason: Modal dismiss button click intercepted)
- `TC_VAL_025` - Special Character Input Sanitization (Reason: Unescaped apostrophe in toast alert)
- `TC_PERF_018` - Rapid Button Double Tap Throttle (Reason: Second click listener triggered twice)

#### SKIPPED TESTS (3 Test Cases)

- `TC_FILE_020` - Cloud Drive Integration Upload (Reason: Feature flag disabled)
- `TC_A11Y_015` - TalkBack Screen Reader Audio Feedback (Reason: Audio hardware disabled on CI runner)
- `TC_RESP_010` - Dual Screen Foldable Layout Pan (Reason: Emulator profile single screen)
