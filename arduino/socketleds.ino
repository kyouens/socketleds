#include "SPI.h"
#include "Adafruit_WS2801.h"

// Number of software switch positions sent over serial.
// Declare character array for switch data.  Should be numSwitches +1.
int numSwitches = 50;
char switchPositions[51];

//How long to wait between signals to time out, in milliseconds
#define MAX_MILLIS_TO_WAIT 7200000

//RGB Color values
//"On" switches
int onR = 0;
int onG = 255;
int onB = 0;

//"Off" switches
int offR = 0;
int offG = 0;
int offB = 0;

// Two pins for LED output
uint8_t dataPin  = 3;    // Yellow wire
uint8_t clockPin = 2;    // Green wire

// First variable is number of pixels.  Two strips are 50 pixels
Adafruit_WS2801 strip = Adafruit_WS2801(numSwitches, dataPin, clockPin);

void setup() {

  Serial.begin(9600);    
  strip.begin();
  strip.show();

}

void loop() {

  unsigned long starttime = millis();

  while (Serial.available() < numSwitches && ((millis() - starttime) < MAX_MILLIS_TO_WAIT) ){      
    //Do nothing while waiting for the data
  }

  if (Serial.available() < numSwitches) {
    // Turn off LEDs and wait for new data.
    Serial.println("No data for two hours.  Turning LEDs off.");
    memset(switchPositions, 0, sizeof switchPositions);
  }
  else {
        for(int n=0;n<numSwitches;n++){
          switchPositions[n] = Serial.read(); 
        }
  }
  
  // Debug
  for(int q=0;q<numSwitches;q++){
    Serial.println(switchPositions[q]);
  }

  //Write pixels
  for (int i=0;i<numSwitches;i++) {
    if (switchPositions[i] == 'y') {
      setPixel(Color(onR,onG,onB), i);
    }
    else {
      setPixel(Color(offR,offG,offB), i);
    }
  }
}



///////////////////////////////////
// FUNCTIONS
///////////////////////////////////

void setPixel(uint32_t c, int pix){
  strip.setPixelColor(pix,c);
  strip.show();
  }

/* Helper functions */

// Create a 24 bit color value from R,G,B
uint32_t Color(byte r, byte g, byte b)
{
  uint32_t c;
  c = r;
  c <<= 8;
  c |= g;
  c <<= 8;
  c |= b;
  return c;
}

//Input a value 0 to 255 to get a color value.
//The colours are a transition r - g -b - back to r
uint32_t Wheel(byte WheelPos)
{
  if (WheelPos < 85) {
   return Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if (WheelPos < 170) {
   WheelPos -= 85;
   return Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170; 
   return Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}
