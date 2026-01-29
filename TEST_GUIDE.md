# Quick Test Guide - Review Creation Fix

## 🧪 Test the Fix

### Test 1: Review Creation (Logged In)
1. Open http://localhost:3000
2. Make sure you're logged in
3. Find a movie and click "Write a Review"
4. Fill in:
   - Rating: Select stars (1-5)
   - Verdict: Choose from dropdown
   - Review text: Optional
5. Click "Save Review"

**Expected Result:**
- ✅ Review should be created successfully
- ✅ If user doesn't exist in DB, it will be auto-created
- ✅ You'll be redirected to `/reviews` page
- ✅ Review appears in your reviews list

**Check Console:**
- Look for `[POST /api/reviews] Request body:` with correct payload
- Look for `[POST /api/reviews] User not in database, creating from session:` (if user was missing)
- Look for `[POST /api/reviews] Review created successfully:`

### Test 2: Review Creation (Not Logged In)
1. Log out (if logged in)
2. Find a movie and click "Write a Review"
3. Fill in the review form
4. Click "Save Review"

**Expected Result:**
- ✅ Review saved to IndexedDB (local storage)
- ✅ Message shows: "Your review will be saved locally (log in to sync to cloud)"
- ✅ No API call made
- ✅ Redirected to `/reviews` page

**Check Console:**
- Look for `[ReviewModal] User not logged in - saving to local IndexedDB`
- Look for `[ReviewModal] Review saved to local IndexedDB`

### Test 3: Error Handling
1. Log in
2. Try to create a review with invalid data (this is hard to do via UI, but API will validate)
3. If there's an error, you should see:
   - ✅ Red error box in the modal
   - ✅ Actual error message (not generic "Failed to create review")
   - ✅ Validation errors if payload is invalid

**Check Console:**
- Look for `[ReviewModal] API error:` with detailed error info
- Look for `[POST /api/reviews] Validation failed:` (if validation error)

---

## 🔍 What Was Fixed

### The Foreign Key Issue
**Problem:** User had valid JWT session but didn't exist in database
- This happens after database migrations/resets
- JWT sessions persist but database is empty

**Solution:** Auto-create user from session data
```typescript
if (!userExists) {
    await prisma.user.create({
        data: {
            id: session.user.id,
            email: session.user.email || `user-${session.user.id}@placeholder.com`,
            name: session.user.name || 'User',
        }
    });
}
```

### The Payload Issue
**Before:**
```json
{
  "movieId": "123",
  "movieTitle": "Movie Name",
  "rating": "5",  // ❌ String instead of number
  "text": "Great movie"
}
```

**After:**
```json
{
  "movieKey": "123",
  "movieSource": "tmdb",
  "title": "Movie Name",
  "ratingStars": 5,  // ✅ Number
  "reviewText": "Great movie",
  "genres": "[]",
  "actors": "[]",
  "verdict": "RECOMMEND",
  "isPublic": false
}
```

---

## 📊 Success Indicators

✅ **No more "Failed to create review" errors**
✅ **Reviews save successfully when logged in**
✅ **Reviews save to IndexedDB when not logged in**
✅ **Detailed error messages in console**
✅ **User auto-created if missing from database**
✅ **Proper error display in UI**

---

## 🐛 If Still Failing

1. **Check Browser Console** for `[ReviewModal]` logs
2. **Check Terminal** for `[POST /api/reviews]` logs
3. **Check Database** - verify user exists:
   ```sql
   SELECT id, email, name FROM "User";
   ```
4. **Clear Session** - Log out and log back in
5. **Check Environment** - Verify `DATABASE_URL` is correct

---

**Status**: Ready to test! 🚀
