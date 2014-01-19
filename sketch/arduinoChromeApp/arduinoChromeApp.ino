int pinLED = 13;

void setup() {
  Serial.begin(9600);
}

void loop() {
}

void serialEvent() {
  while (Serial.available()) {
    byte value = Serial.read();
    analogWrite(pinLED, value);
  }
}
