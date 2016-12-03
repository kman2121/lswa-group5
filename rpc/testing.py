import numpy as np
import cv2
from PIL import Image
import urllib

def processFace(URL):
    res = urllib.urlopen(URL)
    img = np.asarray(bytearray(res.read()), dtype="uint8")
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    cascade = cv2.CascadeClassifier('/home/rakan959/opencv/data/haarcascades/haarcascade_frontalface_default.xml')
    if(img is None):
        return "Image did not load"
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        print "greyed"
        x =  cascade.detectMultiScale(
                gray,
                1.3,
                5
              )
        print x
        return x

processFace("http://www.uni-regensburg.de/Fakultaeten/phil_Fak_II/Psychologie/Psy_II/beautycheck/english/durchschnittsgesichter/m(01-32)_gr.jpg")
