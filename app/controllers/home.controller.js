const homeController = (data, helpers) => {
    return {
        getHomeView(req, res){
            return res.render('home')
        },
    }
};

module.exports = homeController;
