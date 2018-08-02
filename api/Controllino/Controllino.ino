/*
   Filename : Controllino.ino

   Made by : DELIESSCHE Angelo

   Description : This program allow a Controllino device to recognize Wiegand badging
                 and send the information on the web server

*/

#include <Controllino.h>
#include <SPI.h>
#include <Ethernet.h>

#define MAX_BITS 100
#define WEIGAND_WAIT_TIME  3000

// _____ ETHERNET ___________
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 100);
IPAddress server(192, 168, 1, 26);
EthernetClient client;
String response;
char postData[] = "{\"login\" : \"controls\", \"password\" : \"controls\"}";
String token = "";
// _____ WIEGAND ____________
unsigned char databits[MAX_BITS];
unsigned char bitCount;
unsigned char flagDone;
unsigned int weigand_counter;
unsigned long facilityCode = 0;
unsigned long cardCode = 0;
unsigned long OEMcode = 0;
bool responseNotReaded;
int captor1 = 0;
bool captor = false;

// Fonction appelée lors d'une diminution de tension sur la borne INT0
void ISR_INT0()
{
  bitCount++;
  flagDone = 0;
  weigand_counter = WEIGAND_WAIT_TIME;
}
// Fonction appelée lors d'une diminution de tension sur la borne INT1
void ISR_INT1()
{
  databits[bitCount] = 1;
  bitCount++;
  flagDone = 0;
  weigand_counter = WEIGAND_WAIT_TIME;
}

// Ouverture de la porte pendant 1 seconde
void openDoor() {
  digitalWrite(CONTROLLINO_R0, HIGH);
  delay(2000);
  digitalWrite(CONTROLLINO_R0, LOW);
}

// Remise à 0 des valeurs du badge récupérés
void reset() {
  int counter;
  bitCount = 0;
  facilityCode = 0;
  OEMcode = 0;
  cardCode = 0;
  for (counter = 0; counter < MAX_BITS; counter++)
  {
    databits[counter] = 0;
  }
}

// Impression des Bits récupéré du badge (Debug)
void printBits()
{
  Serial.print("FC = ");
  Serial.print(facilityCode);
  Serial.print(", CC = ");
  Serial.println(cardCode);
}
void addEvent() {

}
void sendAlarm() {
  digitalWrite(12, HIGH);
  delay(5000);
  digitalWrite(12, LOW);
}
void getState() {
  digitalWrite(13, HIGH);
  if (!client.connected()) {
    client.stop();
  }
  if (client.connect(server, 3000)) {
    Serial.println("client connect");
    client.println("GET /controls/state/?captor=1");
    client.println("Host: 192.168.1.26");
    client.print("Authorization: ");
    client.println(token);
    client.println("Connection: close");
    client.println();
  } else {
    Serial.println("connection failed");
  }
  digitalWrite(13, LOW);
}
void sendThrewEthernet() {
  // Fermeture d'une potentielle connexion postérieure
  digitalWrite(13, HIGH);
  if (!client.connected()) {
    client.stop();
  }
  // Requete GET sur API
  if (client.connect(server, 3000)) {
    client.print("GET /controls/?ref_device="); client.print(cardCode); client.println("&door_id=1");
    client.println("Host: 192.168.1.26");
    client.print("Authorization: ");
    client.println(token);
    client.println("Connection: close");
    client.println();
  } else {
    Serial.println("connection failed");
  }
  digitalWrite(13, LOW);
}
void connectBdd(){
  digitalWrite(13, HIGH);
  if (!client.connected()){
    client.stop();
  }
  if (client.connect(server, 3000)){
    client.println("POST /");
    client.println("Host: 192.168.1.26");
    client.println("Connection: close");
    client.println("Content-Type: application/json; charset=utf-8");
    client.print("Content-Length: ");
    client.println(strlen(postData));
    client.println();
    client.println(postData);
  }else{
    Serial.println("connection failed on initialization");
  }
  digitalWrite(13, LOW);
}
// S'execute une fois au démarrage du micro-controlleur
void setup()
{
  // Déclaration LED et relai
  pinMode(13, OUTPUT);
  pinMode(A0, INPUT);
  pinMode(12, OUTPUT);
  pinMode(CONTROLLINO_R0, OUTPUT);
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  Serial.begin(9600);

  // Lancement connexion ethernet
  Ethernet.begin(mac, ip);
  delay(1000);

  // Affection des fonction ISR_INT0 et ISR_INT1 sur les bornes INT0 et INT1
  attachInterrupt(5, ISR_INT0, FALLING);
  attachInterrupt(4, ISR_INT1, FALLING);
  weigand_counter = WEIGAND_WAIT_TIME;
  
  digitalWrite(2, HIGH);
  connectBdd();
}
// S'execute à l'infini apres setup()
void loop() {
  
  while (client.available()) {
    char c = client.read();
    response += c;
    responseNotReaded = true;
  }
  if (responseNotReaded) {
    responseNotReaded = false;
    if (response.indexOf("202 Accepted") != -1) {
      openDoor();
      addEvent();
    } else if (response.indexOf("401 Unauthorized") != -1 && captor) {
      sendAlarm();
    } else if (response.indexOf("token") != -1){
      int pos1 = response.indexOf("token");
      char c = response[pos1];
      token = "";
      int i = 0;
      while(c != '"'){
        c = response[pos1 + 8 + i];
        token += c;
        i++;
      }
      token = token.substring(0, i-1);
    }
    captor = false;
    response.replace(response, "");
  }
  if (!flagDone) {
  if (--weigand_counter == 0)
      flagDone = 1;
  }
  if (bitCount > 0 && flagDone) {
  //unsigned char i;
  int counter;
  if ((bitCount == 44) || (bitCount == 45) || (bitCount == 46)) {
      for (counter = 8; counter < 24; counter++) {
        facilityCode <<= 1;
        facilityCode |= databits[counter];
      }
      for (counter = 24; counter < 40; counter++) {
        cardCode <<= 1;
        cardCode |= databits[counter];
      }
      printBits();
      sendThrewEthernet();
    }
    reset();
  }if (analogRead(A0) >= 200) {
    captor = true;
  }
  
  if(captor){
    getState();
  }
}

