const generateMessage = (name,text) => {
    return {
        name,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url,name) => {
    return {
        name,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}