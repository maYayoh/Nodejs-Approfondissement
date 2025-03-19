const articleService = require("./articles.service");
const userModel = require("../users/users.model");
const { isAdmin } = require("../../middlewares/auth");

class ArticlesController {

    async getAll(req, res, next) {
        try {
          const articles = await articleService.getAll();
          res.json(articles);
        } catch (err) {
          next(err);
        }
      }

    async create(req, res, next) {
        try {
            const article = await articleService.createArticle(
                {
                    title: req.body.title,
                    content: req.body.content,
                    user: req.user._id,
                }
            );
            req.io.emit("article:create", article);
            res.status(201).json(article);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            isAdmin(req, res, async () => {
                const id = req.params.id;
                const article = await articleService.updateArticle(id, req.body);
                req.io.emit("article:update", article);
                res.json(article);
            });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            isAdmin(req, res, async () => {
                const id = req.params.id;
                await articleService.deleteArticle(id);
                req.io.emit("article:delete", { id });
                res.status(204).send();
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticlesController();
