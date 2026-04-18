//fetch
let resObj =await fetch(" ",{method:"GET"})
let res = await resObj.json() //{message :"",payload:""}

//axios 
//
let resObj = await axios.get("")
let res= resObj.data 

let reO = await axios.post("",Obj)
let res= reO.data 


CDN servers : a group of servers are managed in cloud 

=>content will be  deliverd by network 
=>cloudinary :internally has cdn servers 
=>formData : text + binary supporrt =>its a special browser api 
=>axios gets it automativally , multipart/formData 
=>multer() available in req.file 
=>extrats the form data 
=> the uploads folder stores the files temporarily and delete once uploaded
=>WE USE Memory : without storing 
=>every event handlre function will receive implivitly by event handler
