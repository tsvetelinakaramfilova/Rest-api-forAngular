const router = require("express").Router();
const users = require("./users");
const recipes = require("./recipes");
const comments = require("./comments");
const likes = require("./likes");
const test = require("./test");
const { authController } = require("../controllers");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use("/users", users);
router.use("/recipes", recipes);
router.use("/comments", comments);
// router.use('/likes', likes);
// router.use('/test', test);

router.get("/test", (req, res) => {
    res.json({ message:  'Hello server!' }); 
});

module.exports = router;
