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
	#string = bin(reduce(lambda x, y: 256*x+y, (ord(c) for c in string), 0))
        for c in string:
		sys.stdout.write('%#x' % ord(c))
	#sys.stdout.write('\n')
	sys.stdout.flush()
	ser.flushInput()
	time.sleep(3)

