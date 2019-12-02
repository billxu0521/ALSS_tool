#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jan 19 01:23:48 2018

@author: billxu
"""
import sys
import glob
import random
import pycrfsuite
import crf
import crfmodel
import util
import datetime
import json
import runcrf
from urllib.parse import unquote
from flask import Flask, jsonify
from flask import render_template
from config import DevConfig
from flask import request
from flask import abort
from flask import render_template
from flask_compress import Compress
from flask_cors import CORS, cross_origin

# 初始化 Flask 類別成為 instance
app = Flask(__name__)
app.config.from_object(DevConfig)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['JSON_AS_ASCII'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.jinja_env.auto_reload = True
Compress(app)

# 路由和處理函式配對
@app.route('/')
def index():
    return render_template('annotation.html')

@app.route('/annotation')
def annotation():
    return render_template('annotation.html')
    
@app.route('/preseg', methods=['POST'])
def preseg():
        
    text = request.form['input_text'] 
    print(text)
    #res = runcrf.predic_api(text)
    score = [0.6,0.4,1.2,1.1,0.7,0.9]
    #return json.dumps({'status':'OK','data':res});
    return json.dumps({'status':'OK','data':score});

@app.route('/trainAndpredic_api', methods=['POST'])
def trainAndpredic():
    text = request.values['input_text']
    res = crfmodel.trainAndpredic_api(text)
    #return json.dumps({'status':'OK','data':res});
    return json.dumps({'status':'OK','data':res});

@app.route('/SegPredic_api', methods=['POST'])
def SegPredic():
    text = request.form['input_text']
    res = crfmodel.SegPredic_api(text)
    return json.dumps({'status':'OK','data':res});

#建立CRF的接口
@app.route('/buildcrfmodel', methods=['POST'])
def buildcrfmodel():
    text = request.form['input_text']    
    print(text)
    res = runcrf.buildCrf(text)
    return json.dumps({'status':'OK','data':res});

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)


