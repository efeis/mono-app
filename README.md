# README — Extra Features for Mono App

This document outlines the **extra features** implemented in the "Mono" microblogging application.

## Extra Features Implemented

Below are the extra features I have implemented, each designed to improve the app's functionality and user experience:

---

### 1. **Unliking Posts Currently Liked by the User**
- Users can toggle their like on any post (except their own).
- Liked posts are visually represented with a pink heart icon.
- After refreshing or navigating away, the liked/unliked state persists.

---

### 2. **Deleting One’s Own Posts**
- Users can delete their own posts.
- A confirmation prompt is shown before deletion.
- Once deleted, the post is immediately removed from the feed without requiring a page refresh.

---

### 3. **Managing One’s Own User Profile**
- A user profile consists of:
  - Full name
  - Email address
  - Biography
- These attributes are editable via the `/edit-profile` page.
- Users can update their profile and see their changes reflected across the app.

---

### 4. **Displaying the Profile of Another User**
- Clicking on any username in a post or search result navigates to that user's profile page.
- Profile includes:
  - Username
  - List of their public posts
  - Follow/unfollow button
  - Follower count

---

## 📄 Notes

- All extra features are **fully integrated** into the existing backend (Spring Boot + MariaDB) and frontend (React).
- The frontend is responsive and uses a consistent design system with a custom color palette and typography.
- Each feature is implemented with attention to user experience and performance (e.g., debounced search, immediate UI updates after actions).

---

Thanks!
