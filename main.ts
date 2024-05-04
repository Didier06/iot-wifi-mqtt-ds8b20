function verification_connexion_wifi_mqtt () {
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(500)
    basic.clearScreen()
    if (ESP8266_IoT.wifiState(true) && ESP8266_IoT.isMqttBrokerConnected()) {
        basic.showIcon(IconNames.Yes)
        connexion_ok = 1
    } else {
        basic.showIcon(IconNames.Sad)
    }
    basic.pause(1000)
    basic.clearScreen()
}
function setup () {
    radio.setGroup(1)
    connexion_ok = 0
    ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
    ESP8266_IoT.connectWifi("Eglantier", "F72EFAD46155EFC67631347941")
    ESP8266_IoT.setMQTT(
    ESP8266_IoT.SchemeList.TLS,
    "nhykjnbvc",
    "fablab2122",
    "2122",
    ""
    )
    ESP8266_IoT.connectMQTT("mqtt.univ-cotedazur.fr", 8443, true)
    while (connexion_ok == 0) {
        verification_connexion_wifi_mqtt()
    }
}
// Publie sur mqtt les températures des autres micro:bit connectés en bluetooth
radio.onReceivedValue(function (name, value) {
    // pour le json ne pas oublier le caractère \ avant "  !!!!
    ESP8266_IoT.publishMqttMessage("{\\\"" + name + "\\\":" + convertToText(value) + "}", "FABLAB_21_22/temperature/" + name + "/", ESP8266_IoT.QosList.Qos0)
})
function envoi_données_sur_mqtt () {
    temp = Math.round(dstemp.celsius(DigitalPin.P1) * 10) / 10
    basic.showNumber(temp)
    ESP8266_IoT.publishMqttMessage("{\\\"temp0\\\":" + convertToText(temp) + "}", "FABLAB_21_22/temperature/temp0/", ESP8266_IoT.QosList.Qos0)
}
let temp = 0
let connexion_ok = 0
setup()
loops.everyInterval(2000, function () {
    envoi_données_sur_mqtt()
})
