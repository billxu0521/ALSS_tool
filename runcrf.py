# -*- coding: utf8 -*-
import sys
import glob
import random
import pycrfsuite
import crf
import util
import datetime

def buildCrf(inputtext):
    material = inputtext
    #material = 'data/24s/*'
    #material = "data/sjw/A05*"
    filename = 'model'
    size = 80
    trainportion = 0.9
    dictfile = 'data/vector/24scbow300.txt'
    crfmethod = "l2sgd"  # {‘lbfgs’, ‘l2sgd’, ‘ap’, ‘pa’, ‘arow’}
    charstop = True # True means label attributes to previous char
    features = 1 # 1=discrete; 2=vectors; 3=both
    random.seed(101)
    
    #宣告指令式
    "python runcrf.py 'data/sjw/*' 80 data/vector/vectors300.txt 1 1"
    args = sys.argv
    '''
    if len(args)>1:
        material = args[1]
        size = int(args[2])
        dictfile = args[3]
        features = int(args[4])
        charstop = int(args[5])
    '''
    cut = int(size*trainportion)
    
    #訓練模型名稱
    modelname = filename.replace('/','').replace('*','')+str(size)+str(charstop)+".m"
    print(modelname)
    print ("Material:", material)
    print ("Size:", size, "entries,", trainportion, "as training")
    
    print (datetime.datetime.now())
    
    # Prepare li: list of random lines
    if features > 1:
        vdict = util.readvec(dictfile)#先處理文本
        print ("Dict:", dictfile)
    li = [line for line in util.file_to_lines(glob.glob(material))]#已經切成陣列
    random.shuffle(li)#做亂數取樣
    li = li[:size]
    
    # Prepare data: list of x(char), y(label) sequences
    data = []
    
    for line in li:
        x, y = util.line_toseq(line, charstop)
        #print(x)
        #print(y[:5])
    
        #這邊在做文本做gram
        if features == 1:
            d = crf.x_seq_to_features_discrete(x, charstop), y
        elif features == 2:
            d = crf.x_seq_to_features_vector(x, vdict, charstop), y
        elif features == 3:
            d = crf.x_seq_to_features_both(x, vdict, charstop), y
        data.append(d)
    
    traindata = data[:cut]
    testdata = data[cut:]
    #print(traindata)
    
    trainer = pycrfsuite.Trainer()
    #print trainer.params()
    #print(traindata[0])
    for t in traindata:
        x, y = t
        
        trainer.append(x, y)
    
    trainer.select(crfmethod)#做訓練
    trainer.set('max_iterations',10) #測試迴圈
    #trainer.set('delta',0)
    #print ("!!!!before train", datetime.datetime.now())
    trainer.train(modelname)
    #print ("!!!!after train", datetime.datetime.now())
    
    
    tagger = pycrfsuite.Tagger()
    #建立訓練模型檔案
    tagger.open(modelname)
    tagger.dump(modelname+".txt")
    
    print (datetime.datetime.now())
    print ("Start closed testing...")
    results = []
        
    while traindata:
        x, yref = traindata.pop()
        yout = tagger.tag(x)
        pr = tagger.marginal('S',0)
        pp = tagger.probability(yout)
        results.append(util.eval(yref, yout, "S"))
    
    tp, fp, fn, tn = zip(*results)
    tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)
    
    p, r = tp/(tp+fp), tp/(tp+fn)
    print ("Total tokens in Train Set:", tp+fp+fn+tn)
    print ("Total S in REF:", tp+fn)
    print ("Total S in OUT:", tp+fp)
    print ("Presicion:", p)
    print ("Recall:", r)
    print ("*******************F1-score:", 2*p*r/(p+r))
    print ("*******************:", pr)
    print ("*******************:", pp)
    print ("*******************:", yout)
    print (datetime.datetime.now())

    return (modelname)

def predic():
    charstop = True # True means label attributes to previous char
    features = 3 # 1=discrete; 2=vectors; 3=both
    dictfile = 'vector/24scbow50.txt'
    modelname = 'datalunyu5001.m'
    vdict = util.readvec(dictfile)
    inputtext = request.form.get('input_text','')
    #li = [line for line in util.text_to_lines(inputtext)]
    li = util.text_to_lines(inputtext)
    
    print(li)
    data = []
    for line in li:
        x, y = util.line_toseq(line, charstop)
        print(x)
        if features == 1:
            d = crf.x_seq_to_features_discrete(x, charstop), y
        elif features == 2:
            d = crf.x_seq_to_features_vector(x, vdict, charstop), y
        elif features == 3:
            d = crf.x_seq_to_features_both(x, vdict, charstop), y
        data.append(d)
    
    tagger = pycrfsuite.Tagger()
    tagger.open(modelname)
    print ("Start testing...")
    results = []
    lines = []
    Spp = []
    Npp = []
    #while data:
    for index in range(len(data)):
        print(len(data))
        xseq, yref = data.pop(0)
        yout = tagger.tag(xseq)
        sp = 0
        np = 0
        for i in range(len(yout)):
            sp = tagger.marginal('S',i)
            Spp.append(sp) #S標記的機率
            print(sp)
            np = tagger.marginal('N',i) 
            Npp.append(np)#Nㄅ標記的機率
            print(np)
        results.append(util.eval(yref, yout, "S"))
        lines.append(util.seq_to_line([x['gs0'] for x in xseq],yout,charstop,Spp,Npp))
        #print(util.seq_to_line([x['gs0'] for x in xseq], (str(sp) +'/'+ str(np)),charstop))

    U_score = 0
    p_Scount = 0
    p_Ncount = 0
    for i in range(len(Spp)):
        _s = 0
        if Spp[i] > Npp[i]:
            _s = Spp[i]
        else :_s = Npp[i]
        _s = (_s - 0.5) * 10
        U_score = U_score + _s
        p_Scount = p_Scount + Spp[i]
        p_Ncount = p_Ncount + Npp[i]
   
    tp, fp, fn, tn = zip(*results)
    tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)
    
    p, r = tp/(tp+fp), tp/(tp+fn)
    score = ''
    score = score + '<br>' + "Total tokens in Test Set:" + repr(tp+fp+fn+tn)
    score = score + '<br>' + "Total S in REF:" + repr(tp+fn)
    score = score + '<br>' + "Total S in OUT:" + repr(tp+fp)
    score = score + '<br>' + "Presicion:" + repr(p)
    score = score + '<br>' + "Recall:" + repr(r)
    score = score + '<br>' + "*******************F1-score:" + repr(2*p*r/(p+r))
    score = score + '<br>' + "======================="
    score = score + '<br>' + "character count:" + str(len(Spp))
    score = score + '<br>' +  "block uncertain rate:" + str((U_score / len(Spp)))

    
    output = ''
    key = 0
    for line in lines:
        #print (line.encode('utf8'))
        
        output = output + '<br>' + line 
        #print (line)
        key = key + 1
        
    #for index_m in ypp:
      #  output = output + '<br>' + line

    output = score + '<br>' + output 

    return (output)

#API用預測
def predic_api(inputtext):
    charstop = True # True means label attributes to previous char
    features = 3 # 1=discrete; 2=vectors; 3=both
    dictfile = 'vector/24scbow50.txt'
    modelname = 'datalunyu5001.m'
    vdict = util.readvec(dictfile)
    inputtext = inputtext
    #li = [line for line in util.text_to_lines(inputtext)]
    li = util.text_to_lines(inputtext)
    
    print(li)
    data = []
    for line in li:
        x, y = util.line_toseq(line, charstop)
        print(x)
        if features == 1:
            d = crf.x_seq_to_features_discrete(x, charstop), y
        elif features == 2:
            d = crf.x_seq_to_features_vector(x, vdict, charstop), y
        elif features == 3:
            d = crf.x_seq_to_features_both(x, vdict, charstop), y
        data.append(d)
    
    tagger = pycrfsuite.Tagger()
    tagger.open(modelname)
    print ("Start testing...")
    results = []
    lines = []
    Spp = []
    Npp = []
    out = []
    #while data:
    for index in range(len(data)):
        print(len(data))
        xseq, yref = data.pop(0)
        yout = tagger.tag(xseq)
        sp = 0
        np = 0
        for i in range(len(yout)):
            sp = tagger.marginal('S',i)
            Spp.append(sp) #S標記的機率
            print(sp)
            np = tagger.marginal('N',i) 
            Npp.append(np)#Nㄅ標記的機率
            print(np)
        results.append(util.eval(yref, yout, "S"))
        lines.append(util.seq_to_line([x['gs0'] for x in xseq],yout,charstop,Spp,Npp))
        #print(util.seq_to_line([x['gs0'] for x in xseq], (str(sp) +'/'+ str(np)),charstop))
        out.append(yout)
    tp, fp, fn, tn = zip(*results)
    tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)
    
    p, r = tp/(tp+fp), tp/(tp+fn)
    score = ''
    score = score + '<br>' + "Total tokens in Test Set:" + repr(tp+fp+fn+tn)
    score = score + '<br>' + "Total S in REF:" + repr(tp+fn)
    score = score + '<br>' + "Total S in OUT:" + repr(tp+fp)
    score = score + '<br>' + "Presicion:" + repr(p)
    score = score + '<br>' + "Recall:" + repr(r)
    score = score + '<br>' + "*******************F1-score:" + repr(2*p*r/(p+r))
    
    output = ''
    print (lines)

    for line in lines:
        #line = unquote(line)
        print ("output:")
        print (line.encode('utf8'))
        #output = output + '<br>' + line
        output += line
        print (line)
    output = score + '<br>' + output

    #output = jsonify({'str': output})
    

    return (out)
