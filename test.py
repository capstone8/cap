#!/usr/bin/env python
import serial
import time
import sys

ser = serial.Serial('/dev/ttyUSB0', 2400, timeout=1)
while True:
    string = ser.read(12)
    if len(string) == 0:
        continue
    else:
		for c in string:
			sys.stdout.write('%#x' % ord(c))
		sys.stdout.flush()
		time.sleep(3)
		ser.flushInput()
