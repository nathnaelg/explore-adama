// backend/src/modules/blog/blog.routes.ts
import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { laxAuth } from "../middleware/laxAuth.ts";
import { permit } from "../middleware/roles.ts";
import { BlogController } from "../modules/blog/blog.controller.ts";
import { createPostValidators } from "../modules/blog/blog.validators.ts";
import { CommentController } from "../modules/blog/comment.controller.ts";
import { ModerationController } from "../modules/blog/moderation.controller.ts";
import { upload } from "../utils/upload.ts";
const router = Router();

// Posts
router.post("/", auth, createPostValidators, BlogController.create);
router.get("/", laxAuth, BlogController.list);
router.get("/categories", BlogController.getCategories);
router.get("/search/smart", laxAuth, BlogController.smartSearch);
router.get("/:id", laxAuth, BlogController.getOne);
router.patch("/:id", auth, BlogController.update);
router.delete("/:id", auth, permit("ADMIN"), BlogController.remove);

// Media upload (attached to a post)
router.post(
  "/:id/media",
  auth,
  upload.single("file"),
  BlogController.uploadMedia
);

// Translation
router.post("/:id/translate", auth, BlogController.translate);
router.post("/:id/like", auth, BlogController.toggleLike);


// Comments
router.post("/:id/comments", auth, CommentController.create);
router.get("/:id/comments", CommentController.list);

// Moderation - admin
router.post("/:id/moderate", auth, permit("ADMIN"), ModerationController.moderate);

export default router;
