const hashmap=new Map();
function setid(id,user){
    hashmap.set(id,user);
}

function getid(id){
    return hashmap.get(id);
}

module.exports={
    setid,
    getid,
}