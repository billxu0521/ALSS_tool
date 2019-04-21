# -*- coding: utf8 -*-
import sys
import glob
import random
import pycrfsuite
import crf
import util
import datetime
import json

def x_seq_to_features_discrete(x):
    # features are for 2 chars before and after Segmentation
    # 1-gram and 2-gram
    findex = [-3,-2,-1,0,1,2,3]
    xf = []
    ran = range(len(x)) #陣列長度
    for i in ran: 
        mydict = {}
        # 1-gram
        for j in findex: # -1 0 1 2
            if i+j in ran: 
                mydict["gs"+str(j)]=x[i+j]  
                
        # 2-gram
        for j in findex[:3]:
            if i+j in ran and i+j+1 in ran:
                mydict["gd"+str(j)]=x[i+j]+x[i+j+1]
                
        # 3-gram
        for j in findex[:5]:
            if i+j in ran and i+j+1 and i+j+2 in ran:
                mydict["gf"+str(j)]=x[i+j]+x[i+j+1]+x[i+j+2]
                
        xf.append(mydict)
    return xf

def dataconvert(jaondata):
    charstop = True
    #_data = json.load(jaondata)
    _data = jaondata
    _alldataary = []
    _alltext = []
    _alllabel = []

    for i in _data:
        _text = _data[i]['text']
        _text = 'S' + _text
        _text = list(_text)
        _label = []
        x = _data[i]['seg']
        x = x + [0]
        for a in x:
            if a == 0:
                _label.append('N')
            elif a == 1:
                _label.append('S')
        
        _alldata = crf.x_seq_to_features_discrete(_text), _label
        _alltext.append(_text);
        _alllabel.append(_label);
        _alldataary.append(_alldata)
    
    return _alldataary


def trainAndpredic_api(inputtext):
    
    material = inputtext
    #material = 'data/24s/*'
    #material = "data/sjw/A05*"
    filename = 'model'
    charstop = True # True means label attributes to previous char
    crfmethod = "lbfgs"  # {‘lbfgs’, ‘l2sgd’, ‘ap’, ‘pa’, ‘arow’}
    #將文本從JSON轉換
    rawalldata = json.loads(material)
    traindata = dataconvert(rawalldata['traindata'])
    testdata = dataconvert(rawalldata['testdata'])
    trainidx = []
    testidx = []
    text_obj = {}
    text_score = [] #紀錄每個區塊的不確定
    
    #組織全部文本資訊    
    for i in rawalldata['testdata']:        
        testidx.append(i)
        text_obj[i]=([len(rawalldata['testdata'][i]['text']),0])
        
    for i in rawalldata['traindata']:        
        trainidx.append(i)
    print('info:',text_obj)
    print (datetime.datetime.now())
    modelname = filename.replace('/','').replace('*','')+str(charstop)+".m"
    print(modelname)
    trainer = pycrfsuite.Trainer()
    #trainer.clear() 
    #print trainer.params()
    #print(traindata[0])
    for t in traindata:
        x, y = t
        trainer.append(x, y)
    
    trainer.select(crfmethod)#做訓練
    trainer.set('max_iterations',30) #測試迴圈
    trainer.train(modelname)
    
    tagger = pycrfsuite.Tagger()
    tagger.open(modelname)
    print (datetime.datetime.now()) 
    print ("Start testing...")
    
    results = []
    results = []
    lines = []
    Spp = []
    Npp = []
    all_len= 0
    
    while testdata:        
        x, yref = testdata.pop()        
        yout = tagger.tag(x)
        #pr = tagger.probability(yref)
        sp = 0
        np = 0
        for i in range(len(yout)):
            sp = tagger.marginal('S',i)
            Spp.append(sp) #S標記的機率
            #print(sp)
            np = tagger.marginal('N',i) 
            Npp.append(np)#N標記的機率
            #print(np)
        results.append(util.eval(yref, yout, "S"))
        
        score_array = []
        All_u_score = 0
        p_Scount = 0
        p_Ncount = 0

        for i in range(len(Spp)):
            _s = 0
            if Spp[i] > Npp[i]:
                _s = Spp[i]
            else :_s = Npp[i]
            #_s = (_s - 0.5) * 10
            _s = (1 - _s)
            #U_score = U_score + _s
            p_Scount = p_Scount + Spp[i]
            p_Ncount = p_Ncount + Npp[i]
            score_array.append(_s)
    for i in range(len(testidx)):
        U_score = 0 #文本區塊的不確定值
        text_count = 0 #字數
        end = 0
        if i == 0:
            start = 0
        else:
            start = end
        end = text_obj[testidx[i]][0]
        #print(text_obj[testidx[i]])
        #print(len(score_array),end)
        for a in range(start,end):
            text_count = text_obj[testidx[i]][0]
            U_score += score_array[a]
        print('text_count:',text_count)
        print('U_score:',U_score)
        U_score = U_score / text_count
        text_obj[testidx[i]][1] = U_score
        All_u_score += U_score
        text_score.append([str(testidx[i]),U_score])
        
        
    tp, fp, fn, tn = zip(*results)
    tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)
    #print(tp, fp, fn, tn)
    if tp <= 0 or fp <= 0 :
        p = 0
        r = 0
        f_score = 0
    else :
        p, r = tp/(tp+fp), tp/(tp+fn)
        f_score = 2*p*r/(p+r)
    
    print ("Total tokens in Test Set:", tp+fp+fn+tn)
    print ("Total S in REF:", tp+fn)
    print ("Total S in OUT:", tp+fp)
    print ("Presicion:", p)
    print ("Recall:", r)
    print ("F1-score:", f_score)
    print(text_score)
    
    return text_score

def SegPredic_api(inputtext):
    
    material = inputtext
    #material = 'data/24s/*'
    #material = "data/sjw/A05*"
    filename = 'model'
    charstop = True # True means label attributes to previous char
    crfmethod = "lbfgs"  # {‘lbfgs’, ‘l2sgd’, ‘ap’, ‘pa’, ‘arow’}
    #將文本從JSON轉換
    rawalldata = json.loads(material)
    testdata = dataconvert(rawalldata['testdata'])
    trainidx = []
    testidx = []
    text_score = [] #紀錄每個區塊的不確定
    
    print (datetime.datetime.now())
    modelname = filename.replace('/','').replace('*','')+str(charstop)+".m"
    print(modelname)    
    tagger = pycrfsuite.Tagger()
    tagger.open(modelname)
    print (datetime.datetime.now()) 
    print ("Start testing...")
    
    results = []
    lines = []
    Spp = []
    Npp = []
    all_len= 0
    
    #while testdata:        
    x, yref = testdata.pop()        
    yout = tagger.tag(x)
    #pr = tagger.probability(yref)
    results.append(util.eval(yref, yout, "S"))
    
    tp, fp, fn, tn = zip(*results)
    tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)
    #print(tp, fp, fn, tn)
    if tp <= 0 or fp <= 0 :
        p = 0
        r = 0
        f_score = 0
    else :
        p, r = tp/(tp+fp), tp/(tp+fn)
        f_score = 2*p*r/(p+r)
    
    print ("Total tokens in Test Set:", tp+fp+fn+tn)
    print ("Total S in REF:", tp+fn)
    print ("Total S in OUT:", tp+fp)
    print ("Presicion:", p)
    print ("Recall:", r)
    print ("F1-score:", f_score)
    
    return yout