const attachTo = (app, {homeController}) => {
    app.get('/', homeController.getHomeView);
    app.get('/home', homeController.getHomeView);
};

module.exports = {attachTo};