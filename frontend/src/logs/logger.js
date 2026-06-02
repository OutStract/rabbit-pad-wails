export const logger = {
    INFO: info ,
    ERROR: error ,
    ALERT: alert ,
    SUCCESS: success,
}



const green = " background: #0CCE6B;  color:#363537; padding: 2px 6px; border-radius: 4px;"
const red = " background: #EF2D56;  color:#363537; padding: 2px 6px; border-radius: 4px;"
const blue = " background: #84CAE7;  color:#363537; padding: 2px 6px; border-radius: 4px;"
const yellow = " background: #DCED31;  color:#363537; padding: 2px 6px; border-radius: 4px;"
const timer = "background: #CBC5EA; color:#363537;  padding: 2px 6px; border-radius: 4px; margin: 0 4px;"
const text = "color: #CBC5EA; background:#363537;  padding: 2px 6px; border-radius: 4px; margin: 0 4px;"
const returnValue = "background: #F9E0D9;  color:#363537; padding: 2px 6px; border-radius: 4px; margin: 0 4px;"


function time() {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`
}

function info (type, file, job, value, performance) {
    console.log(`%c[${time()}] %c${performance} %c[INFO] %c[${file}]: [${type}]: ${job}  RETURN: %c[${value}]`,timer, returnValue, blue, text, blue )
    
}

function error (type, file, job, value) {
    console.log(`%c[${time()}] %c[ERROR] %c[${file}]: [${type}]: ${job} RETURN: %c[${value}]`,timer, red, text, red )
}

function alert (type, file, job, value) {
    console.log(`%c[${time()}] %c[ALERT] %c[${file}]: [${type}]: ${job} RETURN: %c[${value}]`,timer, yellow, text, yellow )
}

function success (type, file, job, value) {
    console.log(`%c[${time()}] %c[SUCCESS] %c[${file}]: [${type}]: ${job} RETURN: %c[${value}]`,timer, green, text, green )
}