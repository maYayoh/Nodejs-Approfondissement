const Article = require("./articles.model");

class ArticleService {

    createArticle(article) {  
        const newArticle = new Article(article);
        return newArticle.save();
    }

    updateArticle(id, article) {
        
        const update =  Article.findByIdAndUpdate(id, article, { new: true });
        return update.save();
    }

    deleteArticle(id) {
        return Article.findByIdAndDelete(id);
    }

    getAll() {
        return Article.find().populate("user");
    }

    async getUserArticles(user) {
        try {
            const userArticles = await Article.find().populate({
                path: "user",
                select: "-password",
                match: { _id: user },
              });
            return userArticles;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new ArticleService();
