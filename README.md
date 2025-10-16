# mono-app

a social microblogging app built with **React** (frontend) and **Spring Boot** (backend).  
users can register, log in, write posts, follow others, and view a personalized feed.

try it here:  
[efeis.github.io/mono-app/](https://efeis.github.io/mono-app/)

the backend is always online (hosted on Render). the frontend runs on GitHub Pages.

---

## features

- **user registration & login** (simple and fast)
- **post creation** — write and share short text posts
- **personalized feed** — see posts from people you follow
- **user profiles** — view and edit your own profile/bio
- **follow/unfollow** other users
- **like/unlike** posts
- **search** for users to follow
- responsive, minimalist design

> all data is stored server-side (H2 database on Render).  
> the app is intended for demo and portfolio use, data may be reset if the backend is redeployed.

---

## how it works (architecture)

- **frontend:**  
  - built with [React](https://react.dev/) + [Vite](https://vitejs.dev/)
  - deployed to GitHub Pages (`/mono-app` subpath)
  - uses `fetch` to interact with the backend API
  - routes and protected pages via `react-router-dom`
- **backend:**  
  - [Spring Boot](https://spring.io/projects/spring-boot) REST API (Java)
  - H2 file-based database (persistent across most restarts on Render)
  - handles user accounts, posts, follows, likes, etc.
  - CORS configured to allow cross-origin requests from GitHub Pages

---

## main components & endpoints

- `/auth`: login/register form
- `/home`: your main feed (posts by you and people you follow)
- `/search`: find users to follow
- `/profile`: your profile page (edit bio, see your posts)
- `/profile/:username`: view other users' profiles

**API:**  
- `POST /api/users/register` — create account  
- `POST /api/users/login` — authenticate  
- `GET /api/posts/feed` — personalized feed  
- `POST /api/posts` — create post  
- `GET /api/users/search` — search users  
- `POST/DELETE /api/users/follow` — follow/unfollow  
- ...and more (see Swagger docs at `/swagger-ui/index.html` on the backend)

---

## controls & UI

- **log in / register:** via `/auth`
- **write a post:** type and submit on `/home`
- **like:** click the heart on a post
- **follow/unfollow:** buttons on user profiles/search results
- **edit profile:** update your bio/email
- **log out:** button on your profile page

---

## browser support & hosting

- works in all modern browsers (desktop and mobile)
- frontend is pure static files (no server-side rendering)
- backend is always-on via Render, data is persistent unless backend is redeployed
- CORS and API URLs configured for GitHub Pages

---

## troubleshooting

- **cannot connect to backend**: try refreshing; backend may be waking up (since i use Render free tier :p)
- **data lost**: backend may have been redeployed (all data resets in that case)
- **UI glitches**: refresh or try a different browser

---

have fun!
