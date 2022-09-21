const users=[]
const addUser=function({id,username,room})
{   
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room)
    {
        return{
            error:'Username and room are required'
        } 
    }
    

  const alreadyExist=users.find((user)=>{
    return user.room=== room && user.username ===username
  })
  if(alreadyExist)
  {
    return{
        error:'Username already exist'
    } 
  }

const user={id,username,room}
    users.push(user)
    return {user}
  }
 const RemoveUser=function(id){
const index=users.findIndex((user)=> user.id===id)
if(index!==-1)
{
  return users.splice(index,1)[0]
}

 }

const GetUser=function(id){
 return users.find((user)=> user.id=== id)
 
}
const getUsersInroom=function(room){
  const alreadyExist=users.filter((user)=>{
    return user.room===room.trim().toLowerCase() 
  })
  if(alreadyExist.length!== 0){
    return alreadyExist
  }
  else{

    return "no user Exist in this room!!"
  }
}


module.exports={
  addUser,
  RemoveUser,
  GetUser,
  getUsersInroom
}
