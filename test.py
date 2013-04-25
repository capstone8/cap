#!/usr/bin/env python
import serial
import time
import sys

ser = serial.Serial('/dev/ttyUSB0', 2400, timeout=3)
while True:
    string = ser.read(12)
    if len(string) == 0:
        continue
    else:
        sys.stdout.write(string)
	sys.stdout.flush()
	ser.flushInput()
	time.sleep(3)

