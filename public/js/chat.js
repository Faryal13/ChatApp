const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sideTemplate=document.querySelector('#side-template').innerHTML



const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
       name:message.name,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
  
})


socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        name:message.url,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
  
})
socket.on('RoomData',({room,users})=>{
    const html = Mustache.render(sideTemplate, {
    room,
    users
     })
     document.querySelector('#sidebar').innerHTML=html

})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

   

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormInput.value = ''
       

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('location is not supported by your browser.')
    }

    

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
          
            console.log('Location shared!')  
        })
    })
})


socket.emit('join',{username,room},(error)=>{
if(error)
{
    alert(error)
    location.href='/'
}

})
