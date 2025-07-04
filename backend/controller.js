const shortid = require("shortid");
let url = require("./url");

async function handlepost(req, res) {
  let {urlid,email} = req.body;
  //console.log(email)
  let sid=shortid();
  let urll = "http://localhost:8000/"+sid;
  
  //console.log(urlid, "short is is ", sid);

  let x = await url.create({
    email,
    urlid,
    sorturl: sid,
    visits: [],
  });
  //console.log(x)
  return res.status(201).json({urll,
  });
}

async function handlerender(req, res) {
  try{

    let uls = await url.find({email: req.body.email});
    return res.json({uls,
    }
  );
  }
    catch(err){
      //console.log(err);
      return res.status(402).json(err,);
    }
}



async function handlegetpatch(req, res) {

  try {
  let c = req.params.id;
    let resp = await url.findOne({ sorturl: c });
    res.json({visit:resp.visits});
  } catch (er) {
    return res.status(402).json(er,);
  }
}

module.exports = { handlepost, handlegetpatch, handlerender };
