let express=require("express")
let router=express.Router();
let url=require("./url")
const {handlepost  , handlegetpatch,  handlerender}   =      require("./controller");
const { getuser } = require("./service.js/stateless");


// =========user routes-------------

router.post("/",handlepost);
router.post("/render",handlerender)
// router.get("/web/:id",handleget);
router.get("/visits/:id",handlegetpatch);

//-------------------------------------------------


// Route to search for a URL across multiple fields
router.post("/search", async (req, res) => {
  const {query,email} = req.body;
  //console.log("query"+query,email);
  //console.log("email"+email)
  try {
    const results = await url.find({
        email,  // Only search URLs associated with the given email address
      $or: [
        { urlid: { $regex: query, $options: "i" } },  // Case-insensitive search
        { sorturl: { $regex: query, $options: "i" } },
       
      ],
    });
    //console.log("results"+results);

    return res.status(200).json(results);
  } catch (error) {
    //console.error("Error during search: ", error);
    return res.status(500).json({ error: "Server error" });
  }
});




module.exports=router;