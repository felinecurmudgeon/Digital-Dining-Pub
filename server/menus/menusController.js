module.exports = {
  getAllMenus : function (req, res){
    console.log("getting menu");
    res.status(200);
    res.send("stub success");
  }, 

  getMenu : function (req, res){
    console.log("getting menu ", req.params.id);
    res.status(200);
    res.send("stub success");
  }, 

  createMenu : function (req, res){
    console.log("creating menu ");
    res.status(201);
    res.send("stub success");
  },

  updateMenu : function (req, res){
    console.log("updating menu ", req.params.id);
    res.status(200);
    res.send("stub success");
  },

  deleteMenu : function (req, res){
    console.log("delete menu ", req.params.id);
    res.status(200);
    res.send("stub success");
  }
};
