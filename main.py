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
from flask_cors import CORS, cross_origin

# 初始化 Flask 類別成為 instance
app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config.from_object(DevConfig)
tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]
# 路由和處理函式配對
@app.route('/')
def index():
    return render_template('annotation.html')
# 判斷自己執行非被當做引入的模組，因為 __name__ 這變數若被當做模組引入使用就不會是 __main__
if __name__ == '__main__':
    app.run()
    
@app.route('/crftag', methods=['POST'])

#測試用的最後要刪掉
@app.route('/signUp')
def signUp():
    return render_template('signUp.html')

#測試用的最後要刪掉
@app.route('/signUpUser', methods=['POST'])
def signUpUser():
    #user =  request.form['username'];
    #password = request.form['password'];
    text = request.form['input_text']
    res = predic_api(text)
    return json.dumps({'status':'OK','data':res});

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
    text = request.form['input_text']
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

@app.route('/api/str/<string:inputtext>', methods=['GET'])
def get_task(inputtext):
    task = list(filter(lambda t: t['id'] == inputtext, tasks))
    #if len(task) == 0:
    #    abort(404)
    res = predic_api(inputtext)

    #return jsonify({'task': task[0]})
    return (res)

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)


