#!/usr/bin/env python
import serial
import time
ser = serial.Serial('/dev/ttyUSB0', 2400, timeout=3)
while True:
    string = ser.read(12)   
    if len(string) == 0:
        continue
    else:
	ba = bytearray(string)
	ba = bin(ba[0])
	print ba
	ser.flushInput()
	time.sleep(3)
