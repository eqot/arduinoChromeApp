void setup() {
  Serial.begin(9600);
}

void loop() {
}

int pinLED = 13;

void serialEvent() {
  while (Serial.available()) {
    byte dat = Serial.read();
    analogWrite(pinLED, dat);
  }
}
