// CONTROLLER TESTS
// comprehensive tests for controller endpoints
package com.example.mono_backend;

import com.example.mono_backend.model.Post;
import com.example.mono_backend.model.User;
import com.example.mono_backend.repository.PostRepository;
import com.example.mono_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")                           // use test configuration
@AutoConfigureMockMvc                             // auto-configure MockMvc
@AutoConfigureTestDatabase(replace = Replace.ANY) // use h2 for tests
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD) // clean db after each test
class ControllerTest {

    @Autowired MockMvc        mockMvc;    // for making HTTP requests
    @Autowired UserRepository userRepo;   // for test data setup
    @Autowired PostRepository postRepo;   // for test data setup
    @Autowired ObjectMapper   mapper;     // for JSON serialization

    @BeforeEach
    void purge() {
        // clean database before each test
        postRepo.deleteAll();
        userRepo.deleteAll();
    }

    @Test
    void testCreatePost() throws Exception {
        // Test: Verify that a valid user can successfully create a new post
        // create a user and then create a post
        userRepo.save(new User("test", "test123"));
        // perform the post request to create a new post
        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"test","content":"testing post creation"}
                    """))
               .andExpect(status().isOk())
               .andExpect(content().string("post-created"));
    }

    @Test
    void testCreatePost_nonExistingUser_returns404() throws Exception {
        // Test: Verify that attempting to create a post with a non-existing user returns 404
        // try to create a post with a non-existing user
        mockMvc.perform(post("/api/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"ghost","content":"👻"}
                    """))
               .andExpect(status().isNotFound())
               .andExpect(content().string("user-not-found"));
    }

    @Test
    void testDeletePost() throws Exception {
        // Test: Verify that a user can successfully delete their own post
        // create a user and a post
        User u = userRepo.save(new User("test", "test123"));
        Post p = postRepo.save(new Post("bye", LocalDateTime.now(), u));
        // perform the delete request
        mockMvc.perform(delete("/api/posts/{id}", p.getId())
                .param("username", "test"))
               .andExpect(status().isOk())
               .andExpect(content().string("deleted"));
    }

    @Test
    void testDeletePost_wrongOwner_returns403() throws Exception {
        // Test: Verify that a user cannot delete another user's post (returns 403 Forbidden)
        // create two users and a post by one of them
        User doc = userRepo.save(new User("doc","pw"));
        userRepo.save(new User("marty","pw")); // Only save, no need to assign
        Post p = postRepo.save(new Post("secret", LocalDateTime.now(), doc));
        // try to delete the post with the other user
        mockMvc.perform(delete("/api/posts/{id}", p.getId())
                .param("username","marty"))
               .andExpect(status().isForbidden())
               .andExpect(content().string("unauthorized"));
    }

    @Test
    void testGetPosts() throws Exception {
        // Test: Verify that posts can be retrieved for a specific user
        // create a user and a post
        User u = userRepo.save(new User("marty", "pw"));
        postRepo.save(new Post("hello", LocalDateTime.now(), u));
        // create another post by the same user
        mockMvc.perform(get("/api/posts")
                .param("username","marty")
                .param("viewer", "marty"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$").isArray())
               .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testLikeAndUnlikePost() throws Exception {
        // Test: Verify that users can like and unlike posts (toggle functionality)
        // create a user and a post
        User author = userRepo.save(new User("doc","pw"));
        User liker  = userRepo.save(new User("marty","pw"));
        Post p      = postRepo.save(new Post("hey there", LocalDateTime.now(), author));
        // like the post
        mockMvc.perform(post("/api/posts/{id}/like", p.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("username","marty"))))
               .andExpect(status().isOk())
               .andExpect(content().string("liked"));
        // check that the post has 1 like
        mockMvc.perform(post("/api/posts/{id}/like", p.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("username","marty"))))
               .andExpect(status().isOk())
               .andExpect(content().string("unliked"));
    }

    @Test
    void testCannotLikeOwnPost_returns400() throws Exception { 
        // Test: Verify that users cannot like their own posts (returns 400 Bad Request)
        // create a user and a post by that user
        User u = userRepo.save(new User("travis","pw"));
        Post p = postRepo.save(new Post("brooklyn", LocalDateTime.now(), u));
        // try to like the post with the same user
        mockMvc.perform(post("/api/posts/{id}/like", p.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"travis"}
                    """))
               .andExpect(status().isBadRequest())
               .andExpect(content().string("cannot-like-own-post"));
    }

      @Test
      void testGetFeed_onlyFollowedAndSelf() throws Exception {
        // Test: Verify that feed returns only posts from followed users and the user's own posts
        // create users and posts
        User rick   = userRepo.save(new User("rick",   "pw"));      
        User travis = userRepo.save(new User("travis", "pw"));      
        User holly  = userRepo.save(new User("holly",  "pw"));    
        // create posts by these users
        Post t1 = postRepo.save(new Post("you talkin' to me?",   LocalDateTime.now().minusMinutes(2), travis));
        Post r1 = postRepo.save(new Post("here's looking at you, kid", LocalDateTime.now().minusMinutes(1), rick));
        Post h1 = postRepo.save(new Post("i want to be alone",   LocalDateTime.now(), holly));
        // rick follows travis
        mockMvc.perform(post("/api/users/follow")
          .contentType(MediaType.APPLICATION_JSON)
          .content(""" 
            {"follower":"rick","following":"travis"} 
          """))
          .andExpect(status().isOk());
        // travis follows holly
        mockMvc.perform(get("/api/posts/feed")
          .param("username","rick"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$").isArray())
          .andExpect(jsonPath("$.length()").value(2))
          .andExpect(jsonPath("$[0].id").value(r1.getId()))
          .andExpect(jsonPath("$[1].id").value(t1.getId()));
      }

      @Test
      void testGetLikedIds() throws Exception {
        // Test: Verify that the endpoint returns correct IDs of posts liked by a user
        // create users and posts
        User norman = userRepo.save(new User("norman","pw"));
        User holly  = userRepo.save(new User("holly", "pw"));
        Post h1 = postRepo.save(new Post("i want to be alone", LocalDateTime.now(), holly));
        Post h2 = postRepo.save(new Post("anyone who ever gave you confidence is a damned fool", LocalDateTime.now(), holly));
        // norman likes both posts
        for (Post p : List.of(h1, h2)) {
          mockMvc.perform(post("/api/posts/{id}/like", p.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(Map.of("username","norman"))))
            .andExpect(status().isOk());
        }
        // get liked post IDs for norman
        mockMvc.perform(get("/api/posts/liked-ids")
          .param("username","norman"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$").isArray())
          .andExpect(jsonPath("$.length()").value(2))
          .andExpect(jsonPath("$[?(@ == " + h1.getId() + ")]").exists())
          .andExpect(jsonPath("$[?(@ == " + h2.getId() + ")]").exists());
      }

      @Test
      void testGetAllPosts_noParams_returnsAllPosts() throws Exception {
        // Test: Verify that calling GET /api/posts without parameters returns all posts
        User a = userRepo.save(new User("travis","pw"));
        User b = userRepo.save(new User("holly", "pw"));
        postRepo.save(new Post("A", LocalDateTime.now().minusMinutes(2), a));
        postRepo.save(new Post("B", LocalDateTime.now().minusMinutes(1), b));
        mockMvc.perform(get("/api/posts"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$").isArray())
              .andExpect(jsonPath("$.length()").value(2))
              .andExpect(jsonPath("$[0].content").value("A"))
              .andExpect(jsonPath("$[1].content").value("B"));
      }

      @Test
      void testGetPosts_onlyViewer_computesLikedByUser() throws Exception {
        // Test: Verify that the likedByUser field is correctly computed when viewer parameter is provided
        User u = userRepo.save(new User("norman","pw"));
        Post p = postRepo.save(new Post("aaa", LocalDateTime.now(), u));
        // norman likes his own post? should be prevented by the code, so no like in DB:
        mockMvc.perform(get("/api/posts").param("viewer","norman"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$[0].likedByUser").value(false));
      }

      @Test
      void testRegisterUser_success() throws Exception {
        // Test: Verify that a new user can register successfully
          mockMvc.perform(post("/api/users/register")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"frodo","password":"ringbearer"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));
      }

      @Test
      void testRegisterUser_duplicateUsername_returnsTaken() throws Exception {
          // Test: Verify that registering with an existing username returns "taken"
          userRepo.save(new User("samwise", "gardener"));
          mockMvc.perform(post("/api/users/register")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"samwise","password":"gardener"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("taken"));
      }

      @Test
      void testLoginUser_success() throws Exception {
          // Test: Verify that a user can log in with correct credentials
          userRepo.save(new User("aragorn", "anduril"));
          mockMvc.perform(post("/api/users/login")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"aragorn","password":"anduril"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));
      }

      @Test
      void testLoginUser_wrongPassword() throws Exception {
          // Test: Verify that logging in with a wrong password returns "wrong-password"
          userRepo.save(new User("gimli", "axe"));
          mockMvc.perform(post("/api/users/login")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"gimli","password":"wrong"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("wrong-password"));
      }

      @Test
      void testLoginUser_notFound() throws Exception { 
          // Test: Verify that logging in with a non-existing user returns "not-found"
          mockMvc.perform(post("/api/users/login")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"sauron","password":"darkness"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("not-found"));
      }

      @Test
      void testUpdateUserProfile_success() throws Exception {
          // Test: Verify that a user can update their profile successfully
          userRepo.save(new User("legolas", "elf"));
          mockMvc.perform(put("/api/users/profile")
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("""
                      {"username":"legolas","fullName":"Legolas Greenleaf","bio":"Prince of the Woodland Realm"}
                  """))
                .andExpect(status().isOk())
                .andExpect(content().string("updated"));
      }

      @Test
      void testGetUserProfile_success() throws Exception {
          // Test: Verify that a user's profile can be retrieved successfully
          User u = new User("galadriel", "mirror");
          u.setFullName("Lady Galadriel");
          u.setEmail("galadriel@lorien.org");
          u.setBio("Bearer of Nenya");
          userRepo.save(u);
          mockMvc.perform(get("/api/users/profile")
                  .param("username", "galadriel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Lady Galadriel"))
                .andExpect(jsonPath("$.email").value("galadriel@lorien.org"))
                .andExpect(jsonPath("$.bio").value("Bearer of Nenya"));
      }

      @Test
      void testUserExists_true_and_false() throws Exception {
          // Test: Verify that the exists endpoint correctly identifies existing and non-existing users
          userRepo.save(new User("boromir", "gondor"));
          mockMvc.perform(get("/api/users/exists").param("username", "boromir"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));
          mockMvc.perform(get("/api/users/exists").param("username", "gollum"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));
      }

      
      @Test
      void testFollowAndUnfollowEndpoints() throws Exception {
        // Test: Verify that users can follow and unfollow other users successfully
        userRepo.save(new User("rocky","pw"));
        userRepo.save(new User("adrian","pw"));
        // follow
        mockMvc.perform(post("/api/users/follow")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"follower\":\"rocky\",\"following\":\"adrian\"}"))
              .andExpect(status().isOk());
        // unfollow
        mockMvc.perform(delete("/api/users/follow")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"follower\":\"rocky\",\"following\":\"adrian\"}"))
              .andExpect(status().isOk());
      }

      @Test
      void testGetFeed_unknownUser_emptyList() throws Exception {
        // Test: Verify that requesting feed for non-existent user returns empty list
        mockMvc.perform(get("/api/posts/feed").param("username","ghostface"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$").isArray())
              .andExpect(jsonPath("$.length()").value(0));
      }

      @Test
      void testDeleteNonexistentPost_returns404() throws Exception {
        // Test: Verify that attempting to delete a non-existent post returns 404
        // try to delete a post that does not exist
        // this should return a 404 status with a specific message
        mockMvc.perform(delete("/api/posts/{id}", 999L)
          .param("username","anyone"))
          .andExpect(status().isNotFound())
          .andExpect(content().string("post-not-found"));
      }

      @Test
      void testGetPosts_unknownAuthor_emptyArray() throws Exception {
        // Test: Verify that requesting posts from non-existent user returns empty array
        // try to get posts by a user that does not exist
        mockMvc.perform(get("/api/posts")
          .param("username","ghostface")) 
          .andExpect(status().isOk())
          .andExpect(jsonPath("$").isArray())
          .andExpect(jsonPath("$.length()").value(0));
      }
}
