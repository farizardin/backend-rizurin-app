const BaseOutput = require("../../outputs/BaseOutput");
const BaseController = require("../BaseController");

class ArtController extends BaseController {
  getHello() {
    var arr =[
      {
        id: 1,
        name: 'tes',
      },
      {
        id: 2,
        name: 'tesw',
      }
    ]
    // this.res.json(this.outputClass().toJson({}, 'Artwork Controller'));
    this.res.json(this.outputClass().toArray(arr, 'Artwork Controller'));
  }
}

module.exports = ArtController;
