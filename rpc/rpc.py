import SimpleXMLRPCServer
import numpy as np
import cv2
from PIL import Image
import urllib, cStringIO

def processFaces(URL):
    img = Image.open(cStringIO.StringIO(urllib.urlopen(URL).read()))
    cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    if(img is None):
        return "Image did not load"
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return cascade.detectMultiScale(
                gray,
                scaleFactor = 1.15,
                minNeighbors = 5,
                minSize = (30, 30),
                flags = cv2.cv.CV_HAAR_SCALE_IMAGE
              )


server = SimpleXMLRPCServer.SimpleXMLRPCServer(("0.0.0.0", 80))
server.register_function(processFaces, 'face')
print('Serving XML-RPC on localhost port 80')
server.serve_forever()
