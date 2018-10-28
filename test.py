# -*- coding: utf8 -*-
import sys
import glob
import util
import datetime
import random, nltk, math
import numpy as np
from nltk.corpus import names
import nltk.metrics
import collections
import crf
from nltk.metrics import *

material = 'data/24s/*'
#material = "data/sjw/A05*"
size = 30000 
trainportion = 0.9
dictfile = 'data/vector/24scbow300.txt'
crfmethod = "l2sgd"  # {‘lbfgs’, ‘l2sgd’, ‘ap’, ‘pa’, ‘arow’}
charstop = True # True means label attributes to previous char
features = 1 # 1=discrete; 2=vectors; 3=both
random.seed(101)

#宣告指令式
"python runcrf.py 'data/sjw/*' 80 data/vector/vectors300.txt 1 1"
args = sys.argv
if len(args)>1:
    material = args[1]
    size = int(args[2])
    #dictfile = args[3]
    features = int(args[4])
    charstop = int(args[5])
cut = int(size*trainportion)

#訓練模型名稱
modelname = material.replace('/','').replace('*','')+str(size)+str(charstop)+".m"

print ("Material:", material)
print ("Size:", size, "entries,", trainportion, "as training")

print (datetime.datetime.now())

# Prepare li: list of random lines
if features > 1:
    vdict = util.readvec(dictfile)#先處理文本
    print ("Dict:", dictfile)
li = [line for line in util.file_to_lines(glob.glob(material))]#已經切成陣列
print(len(li))
random.shuffle(li)#做亂數取樣
li = li[:size]


# Prepare data: list of x(char), y(label) sequences
data = []
alldata = []
for line in li:
    x, y = util.line_toseq(line, charstop)
    #print(x)
    #print(y)
    if features == 1: #可以用
        d = crf.x_seq_to_features_discrete(x, charstop), y
        a = crf.x_seq_to_features_discrete(x, charstop)
        for key in range(len(x)):
            alldata.append((a[key],y[key]))
            
    elif features == 2:
        d = crf.x_seq_to_features_vector(x, vdict, charstop), y
    elif features == 3:
        d = crf.x_seq_to_features_both(x, vdict, charstop), y
    
    #data.append(d)
print(data[7])
#traindata = data[:cut]
#testdata = data[cut:]
traindata = alldata[:cut]
testdata = alldata[cut:]
'''
classifier = nltk.NaiveBayesClassifier.train(traindata)
# 通过测试集来估计分类器的准确性
print(nltk.classify.accuracy(classifier, testdata))
# 如果一个人的名字的最后一个字母是‘a’，那么这个人是男还是女
classifier.show_most_informative_features(5)

refsets = collections.defaultdict(set)
testsets = collections.defaultdict(set)

for i, (feats, label) in enumerate(testdata):
    refsets[label].add(i)
    observed = classifier.classify(feats)
    testsets[observed].add(i)
print ('S precision:', nltk.precision(refsets['S'], testsets['S']))
print ('S recall:', nltk.recall(refsets['S'], testsets['S']))
print ('S F-measure:', nltk.f_measure(refsets['S'], testsets['S']))
print ('N precision:', nltk.precision(refsets['N'], testsets['N']))
print ('N recall:', nltk.recall(refsets['N'], testsets['N']))
print ('N F-measure:', nltk.f_measure(refsets['N'], testsets['N']))

'''

'''
trainer = pycrfsuite.Trainer()
#print trainer.params()
print(traindata[0])
for t in traindata:
    x, y = t
    
    trainer.append(x, y)

trainer.select(crfmethod)#做訓練
trainer.set('max_iterations',100) #測試迴圈
#trainer.set('delta',0)
print ("!!!!before train", datetime.datetime.now())
trainer.train(modelname)
print ("!!!!after train", datetime.datetime.now())


tagger = pycrfsuite.Tagger()
#建立訓練模型檔案
tagger.open(modelname)
tagger.dump(modelname+".txt")

print (datetime.datetime.now())
print ("Start testing...")
results = []
while testdata:
    x, yref = testdata.pop()
    yout = tagger.tag(x)
    results.append(util.eval(yref, yout, "S"))

tp, fp, fn, tn = zip(*results)
tp, fp, fn, tn = sum(tp), sum(fp), sum(fn), sum(tn)

p, r = tp/(tp+fp), tp/(tp+fn)
print ("Total tokens in Test Set:", tp+fp+fn+tn)
print ("Total S in REF:", tp+fn)
print ("Total S in OUT:", tp+fp)
print ("Presicion:", p)
print ("Recall:", r)
print ("*******************F1-score:", 2*p*r/(p+r))


print (datetime.datetime.now())
print ("Start closed testing...")
results = []
while traindata:
    x, yref = traindata.pop()
    yout = tagger.tag(x)
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
print (datetime.datetime.now())
'''