import cv2
import numpy as np
import sys
import json,time 
image_name = 'output_image'+str(time.time())+".png"

#Reading image 
img = cv2.imread(sys.argv[1])

# Detecting edges of the input image
edges = cv2.Canny(img, 100, 200)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 5)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


gray_1 = cv2.medianBlur(gray, int(sys.argv[2]))

edges = cv2.adaptiveThreshold(gray_1, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 5)

# Cartoonifying the image
color = cv2.bilateralFilter(img, d=9, sigmaColor=200,sigmaSpace=200)
cartoon = cv2.bitwise_and(color, color, mask=edges)

cv2.imwrite('./public/outputs/'+image_name ,cartoon)

details = {
        'output_img_path': 'outputs/'+image_name
    }        
print(json.dumps(details))

# cv2.imshow('cartoonify',cartoon)

cv2.waitKey(0)