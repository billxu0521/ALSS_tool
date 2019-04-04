/*
主功能的js
 */

//目前時間
function gettime() {
	var time=new Date();
    $('#timebar').text(
    	(time.getHours()<10?('0'+time.getHours()):time.getHours())+':'+
    	(time.getMinutes()<10?('0'+time.getMinutes()):time.getMinutes())
    );
    return time;
}

//本地儲存資料到local
function saveLocalStorage(user,data){
    console.log('Loacl-SAVE');
    localStorage.setItem(user,JSON.stringify(data));
}

//
function creatUserName(){
    var user = $('#username').val();
    localStorage.setItem('username',user);
    console.log('Creat User:' + user);
}

function saveAllLocalStorage(){
    var user = localStorage.getItem('username');
    var alldata = loadAllTextData();
    console.log('SAVE' + user + ':' + alldata);
    saveLocalStorage(user,alldata);
}

//本地儲存資料到session
function saveLocalData(num,data){
    var obj = calsegary(data);
    console.log('textarea' + num + '-SAVE');
    //console.log(obj);
    sessionStorage.setItem(num,JSON.stringify(obj));
}

//讀取session本地資料
function loadLocalData(num){
    console.log('textarea' + num + '-LOAD');
    //console.log(obj);
    obj = sessionStorage.getItem(num);
    return obj;
}

//儲存資料目錄到session 
function saveLocalList(ary){
    sessionStorage.setItem('text_list',JSON.stringify(ary));
    console.log('Save text list:' + ary);
}

//讀取session 資料目錄
function loadLocalList(){
    console.log('LOAD text list');
    textlist = sessionStorage.getItem('text_list');
    textlist = JSON.parse(textlist);
    return textlist
}

//儲存全部文本
function saveAllTextData(){

}

//讀取全部文本
function loadAllTextData(){
    textlist = loadLocalList();
    console.log(textlist);
    all_obj = new Object;;
    for(var i = 1;i <= textlist.length;i++){
        _json_obj = loadLocalData(i);
        _obj = (JSON.parse(_json_obj));
        all_obj[i] = _obj;
    }
    return all_obj;
}

//計算文字中的斷句成陣列
function calsegary(data){
    var dataary = data.split('');
    var segary = [];
    var datatext = '';
    for(var i in dataary){
        if(dataary[i] == ',' || dataary[i] == '，' || dataary[i] == '。' || dataary[i] == '：' || dataary[i] == '《' || dataary[i] == '》' || dataary[i] == '、'){
            segary.pop();
            segary.push(1);//有斷句
            continue;
        }else{
            segary.push(0);//無斷句
            datatext += dataary[i];
        }
    }
    var obj = {
        'text':datatext,
        'seg':segary
    }
    return obj;
}

//讀取全部文本
function loadall() {
    var alltext = $('#inputalltxt').val().replace(/\r\n|\n/g,"").replace(/\s+/g, "").split('--');
    alltext = TEXT.replace(/\r\n|\n/g,"").replace(/\s+/g, "").split('--');
    var textindex = [];
    for(var i in alltext){
        var _a = (parseInt(i)+1);
        saveLocalData(_a,alltext[i]);
        console.log(alltext[i]);
        if(i == 0){
            textindex.push(0);
            continue;
        }else{
            var menubtn = $('<a></a>');
            //menubtn.addClass("list-group-item").attr('id','row-text').attr('key',_a).attr('value','0').text('第'+ _a +'區塊\n\n不確定值:').append('<div id="u_score">--</div>');
            menubtn.addClass("list-group-item").attr('id','row-text').attr('key',_a).attr('value','0').text('第'+ _a +'區塊');
            $('.list-group').append(menubtn);
            textindex.push(0);
        }
    }
    saveLocalList(textindex); //紀錄有多少篇文本
    var obj = sessionStorage.getItem('1');
    rowtext = (JSON.parse(obj)).text;
    serary = (JSON.parse(obj)).seg;
    load(rowtext,serary);
    relodpage('a[key="1"]');
    creatUserName();
    $('#mainshowtext').css('visibility','visible');
    $('#alltextlist').css('visibility','visible');
    $('#textmenu').css('visibility','visible');
    $('.custombtn').css('visibility','hidden');
    $('.col-lg-9').css('flex','0 0 75%');
    $('#inputAllModal').modal('hide');
}
//讀取文本
function load(row_text=null,ser_ary=null) {
    var serary = ser_ary;
    var rowtext = row_text;

    if (row_text == ''){
        obj = sessionStorage.getItem("1");
        rowtext = (JSON.parse(obj)).text;
        serary = (JSON.parse(obj)).seg;
    }
    var lines=(rowtext||$('#txt').val()).split('\n'),
    container=document.getElementById('all-text');
    $(container)
    	.text('')
        .css('font-size',$('#fontsize').val())
        .css('color',$('#color').val())
        .css('background-color',$('#bgcolor').val())
        .css('max-width',$('#maxwidth').val());
    $('#js-style')
       	.text('#container>p{margin-bottom:'+$('#margin').val()+';}');
	for(var pos=0;pos<lines.length;pos++) {
                var elem= document.createElement('p');
                var charary = lines[pos].split("");
                for(var i in charary){
                    var char_block = $("<div></div>")
                        .addClass('charblock')
                        .attr('id','char')
                        .text(charary[i]);
                    if(serary[i] == 1){
                        var seg_block = $("<div></div>")
                            .addClass('charblock')
                            .attr('id','seg')
                            .text(',')
                            .css('padding-right',15)
                            .css('padding-left',10)
                            .append("<div id='segline'></div>");
                    }else{
                        var seg_block = $("<div></div>")
                            .addClass('charblock')
                            .attr('id','seg')
                            .text('　')
                            .append("<div id='segline'></div>");
                    }
                    var char_seg = $("<div></div>")
                        .addClass('charseg')
                        //.attr('title','請點擊進行標註')
                        .append(char_block)
                        .append(seg_block);
                    $("#all-text")
                        .append(char_seg);
                }
                //elem.textContent=lines[pos];
                //container.appendChild(elem);
        }
    	calc();
    //$('.charseg').tooltip();
	$('#inputModal').modal('hide');
    textprogressbar();
}

//整理顯示和標注的文本
function calalltext(textary){
    var alltext = "";
    for(var i in textary){
        var _char = textary[i].textContent;
        if(_char == '　'){
            continue;
        }else{
            alltext += _char;
        }
    }
    return alltext
}

//當輸入視窗被打開時讀取
function showinport(){
    $('#inputModal').on('shown.bs.modal', function (e) {
        var alltxt = getpagetext("div.charblock");
        $('textarea#txt').val(alltxt);
    })
}

//當輸出視窗被打開時讀取
function showexport(){
    $('#ouputModal').on('shown.bs.modal', function (e) {
        var alltxt = getpagetext("div.charblock");
        $('textarea#outputtxt').val(alltxt);
    })
}

//輸出文本
function exporttxt(){
    var alltxt = $('textarea#outputtxt').val();    
    console.log(alltxt);
}

//讀檔
function loadfile(fil) {
	var fr=new FileReader();
    fr.onload=function() {
    	$('#txt').val(fr.result);
	}
    fr.readAsText(fil.files[0]);
    }

function calc() {
	window.reading_prog=(document.body.clientHeight+$(window).scrollTop())*100/$(document).height();
    //$('#prog').text(Math.ceil(reading_prog)+'%');
    $('#light').css('top',reading_prog+'%');
    $('#x-top').css('top',$(window).scrollTop());
    $('#x-bottom').css('top',Math.min(document.body.clientHeight+$(window).scrollTop(),$(document).height()-4));
}

//標註斷句符號的功能
function annosegment(){
    $(document).on('click', '.charseg', function(event){
        var segary = segmentcount();
        var nowseg = $('div.charseg').index(this);
        //console.log(nowseg);
        if(segary[nowseg] == 0){
            $(this).find('#seg')
                .text(',')
                .css('padding-right',15)
                .css('padding-left',10)
                .css('right',5)
                .append("<div id='segline'></div>");
            $(this).find('#seg').find('#segline')
                .css('border-width','1px')
                .css('width','90%')
                .css('z-index','-1')
                .css('background-color','#CCEEFF')
                .animate({
                    right: '5px',
                    width: '65%'
                });
        }else if(segary[nowseg] == 1){
            $(this).find('#seg')
                .text('')
                .css('right',5)
                .css('padding-right',0)
                .css('padding-left',0)
                .append("<div id='segline'></div>");
            $(this).find('#seg').find('#segline')
                .css('border-width','1px')
                .css('background-color','FFFFFF')
                .css('z-index','-1')
                .animate({
                    right: '5px',
                    width: '65%'
                });
        }
        var segary = segmentcount();
        var time = gettime();
        //console.log(time + "////回傳斷句" + segary);
    });
    $(document).on('mouseenter', '#char', function(event){
        $(this).parent('.charseg').find('#seg').find('#segline')
        .animate({
            right: '5px',
            borderWidth:'1px',
            width: '65%'
        });
        $(this).parent('.charseg').find('#seg').animate({     
            paddingRight:'15px',
            paddingLeft:'10px',
            right: '5px',
            width: '30px'

        });
    });
    $(document).on('mouseleave', '#char', function(event){
        var segary = segmentcount();
        var nowseg = $('div#char').index(this);
        //console.log(nowseg);
        if(segary[nowseg] == 0){
            $(this).parent('.charseg').find('#seg').find('#segline')
            .css('background-color','rgba(255, 0, 0, 0)')
            //.css('background-color','rgba(255,255,255,0)')
            .animate({
                borderWidth:'0px',
                width: '0%'
            })
            $(this).parent('.charseg').find('#seg').animate({
                paddingRight:'5px',
                paddingLeft:'0px',
                width: '0px'
            });
        }else if(segary[nowseg] == 1){
            $(this).parent('.charseg').find('#seg').find('#segline')
            //.css('background-color','rgba(255,255,255,0)')
            .css('border-width','0px')
            .css('width','0%')
            $(this).parent('.charseg').find('#seg').animate({
                paddingRight:'5px',
                paddingLeft:'0px',
                width: '0px'
            });
        }
    });
}

//計算標註陣列
function segmentcount(){
    var segary = []; //紀錄是否斷句 0=沒斷 1=有斷
    var textary=$("div#seg").toArray();
    for(var i in textary){
        if(textary[i].textContent == ','){
            segary.push(1);
        }else{
            segary.push(0);
        }
    }
    return segary;
}

function infoswitch() {
	$('#infobar>p').fadeToggle(200);
}

//產出標點符號
function showseg(resrary){
    for(var i in resrary){
        var ele=$("div#seg").eq(i);
        if(resrary[i] == 'N'){
            ele.text('　').css('background-color','#FFFFFF').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
        }else if(resrary[i] == 'S'){
            ele.text('　').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
            ele.text(',').css('background-color','#66FF66').css('padding-right',10).css('padding-left',10).append("<div id='segline'></div>");
        }
    }
}


//送出文本建立模型
//1:CRF
function buildModel(){
    var def_rul = '';
    model = 1;
    if(model === 1){
        def_rul = 'http://localhost:5000/buildcrfmodel';
    }else if(model === 2){

    }else if(model === 3){

    }
    $(document).on('click', 'button[name="buildmodel"]', function(event){
        console.log($('textarea#outputtxt'));
        $.ajax({
            url: def_rul,
            data: $('textarea#outputtxt').serialize(),
            type: 'POST',
            success: function(response) {
                obj = JSON.parse(response);
                //console.log(decodeURIComponent(obj.data));
                res = decodeURIComponent(obj.data);
                alert('已建立模型:'+res);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}

//送出文本訓練預測 回來是分數
function sendtext(){
    $(document).on('click', 'button[name="sendtext"]', function(event){
        //console.log($('textarea#outputtxt'));
        //這邊需要一個偵測現在的文本區塊
        var num = $('.list-group-item.active').attr('key');
        num = parseInt(num);
        var alltxt = getpagetext("div.charblock");
        //alltxt = '至虛之中，泱儿無垠，而萬有實之。實居於虛之中，寥漠無際，一氣虛之。非虛則物不能變化周流，若無所容以神其機，而實者有訕信聚散存焉；非實則氣之綑組闔闢，若無所馮以藏其用，而虛者有升降消長擊焉。夫天地之大，以太虛為體，而萬物·生生化化於兩問而不息者，一陰一陽、動靜往來而已矣。凡寒暑之變，晝夜之殊，天之運而不息者，昭而日星，威而雷霆，潤而風雨霜露；地之運而不息者，峙而山嶽，流而江海，蕃而草木烏獸。若洪鐵高下之眾，肖翹蚊動之微，一皆囿於至虛之中，而不可測其幽微神妙者，所謂道也，理也。非道之大，理之精，其能宰乎至神至妙之機也乎。是所以範圍天地，發育萬物，以盡夫參贊之道者焉。故知道者，不觀於物而觀乎心也。蓋心統性情，而理具於心，氣囿於形，皆天命流行而賦焉。曰虛靈、日太極、日中、日一，皆心之本然也，是日心為太極也。物物皆具是性焉。凡物之形色紛錯，音聲鏗戛，皆有無混融之不齊。而品物流行者，特氣之糟粕煨燼也。人與萬物同居於虛者也。然以方寸之微，而能充乎宇宙之大，萬物之眾，與天地並行而不違者，心虛則萬有皆備於是矣。何喜怒欣戚、一辰樂得喪、足以窒吾之虛，塞吾之通哉。庶乎虛則其用不勤矣，吾《老子》日：道沖而用之或不盈，淵乎似萬物之宗。沖猶虛也。《莊子》曰：惟道集虛。《列子》日：虛也得其居矣，惟虛足以容也。道集則神凝，神凝則氣化，氣化則與太虛同體，天地同流，而二氣五行周流六虛，往來不息者，淑優交馳同其用矣。苟虛心諍慮，守之以一，則中虛而不盈，外徹而不徊，若淵之深，若鑑之瑩，則吾固有之性與天德同符，豈不為萬物之宗哉。是故養其體也，去芬華，忘物我，絕氛垢，以盡致虛守靜之工，則復命歸根也，深根固蒂也，滌除玄覽也。抱一守中也，則谷神長存，思淨欲寡，虛極靜篤，復歸無極。則虛寂明通，物不吾役而物吾役矣。充其用也，墮肢體，黜聰明，以本為精，以物為粗，以探為根，以約為紀，則未有以見。夫天地之先，氣形質之始，日太初、太始、太素者，混沌之昆侖也。及判清濁分，精出耀布，度物施生，精日三光，曜日五行，行生情，情生汁中，汁中生神明，神明生道德，道德生文章。陽不動無以生其教，陰不靜無以成其化。以之治國，以之愛民，託於天下，而天下清靜而正也。是皆以清靜無為為宗，以謙約不爭為本，其所謂內聖外王之道也歟。然塞乎無形無極之問者，皆天道之用乎。是有相盪相生，相傾相形，相倚相伏之不可齊，不可測也。其神之無方，易之無體者乎。而天地之機，事物之數，可以前知，可以祕藏。由虛則靈，而神運其中，發其知也。雖有萬變萬化，由斯出焉。惟以誠事天，以和養生，以慈利物，則上天之載，感通無問矣。非有甚高難行之事，非常可喜之論也。尚何譎誕神怪之謂也哉，特沖氣以和，順物自然而已矣。昔之用而驗者，廣成之授軒轅，曹參之舍蓋公，黃石之訓留侯，漢以清靜而治是也。或謂竊是以濟其術，而自利不知有害夫義也。殆亦過歟！而史稱黃老刑名，處士橫議，雖雜老莊於管晏，以申、韓、田、慎、縐、孫、商、呂、晁、淳、尸、吁之徒出於是焉。流而為蘇、張、甘、蔡縱橫之術，因以其為害慘矣。固不惟以虛無寂滅病之，蓋由魏晉劉、阮、王、何，高談妄肆，倫理顛喪，而韓愈氏謂甚於楊墨，而以老莊亡者也。奈何學之之徒，溺於偏而失於放，卒所以致傾敗之患。亦宜幾何其不取世之紙排訾斥也哉。殆有甚於刑名橫議者矣！．雖然必審之精，求之約也。然後知老莊之道，大且博焉。噫，道一也，微妙玄通之體，神應幾微之妙，豈岐而二哉。且窈冥有精，惚恍有象，吾中黃之肩，內虛外融，暢於四體，合乎百靈，則五氣凝布，而與天地健順之德合矣乎。其要也，一其性，養其氣，遊乎萬物之所始終，而得夫純氣之守焉耳矣。抑司馬公日：萬物皆祖於虛，生於氣，氣以成體，體以受性，性以辨名，名以立行，行以俟命。故虛者，物之府也，彼之謂虛也。虛之焉行，始於五行，一六置後，二七置前，三八置左，四九置右，通以五十五行，所謂虛以惟玄也。是亦衛數之一端歟。惟虛其中，則窮神知化，原始返終之道得矣。若夫制鍊形魄，排空御氣，乘天地之正，御六氣之辨，神遊八極，後天而終，以盡返復無窮之世變，而遊心於澹，合氣於漠，以超乎胚輝馮翼之初，瞑津鴻濛之表。洞視萬古猶一息也，死生猶旦暮也。若蟬之蛻，若息之吹。前乎天地之始，後乎天地之終，皆吾虛之運乎。又豈徇生執有物而不化者比焉。苟徒竊名徹譽於時，其蔽於詖陷於淫，孳孳汲汲，與塵垢枇糠者殆何異焉。其亦尸名盜誇之徒也.嗚呼！知致虛則明，明則諍，諍則通，通則神，神則不疾而速，不行而至，無不應，無不達矣。否是則豈善學吾老氏哉，其可與語至，虛也乎。'
        saveLocalData(num,alltxt);
        textlist = loadLocalList();
        alltext = loadAllTextData();//讀取全部文本
        console.log(alltext);
        
        textlist[num-1] = 1;
        saveLocalList(textlist);

        //組成訓練文本測試文本
        var alldata = new Object;
        var trainary = new Object;
        var testary = new Object;

        for(var i in textlist){
            a = parseInt(i) + 1;
            console.log(a);
            if(textlist[i] == 0){
                //這邊是測試資料
                testary[i] = alltext[a]
                //alldata['testdata'] = alltext[i]
            }else{
                //這邊是訓練資料
                trainary[i] = alltext[a];
                //alldata['traindata'] = alltext[i]
            }
        }
        alldata['testdata'] = testary;
        alldata['traindata'] = trainary;
        console.log(alldata);
        $.ajax({
            url: 'https://alssapi.herokuapp.com/trainAndpredic_api',
            //url: 'http://localhost:5000/trainAndpredic_api',
            //data: $('textarea#outputtxt').serialize(),
            data: $('textarea#outputtxt').val(JSON.stringify(alldata)),
            type: 'POST',
            success: function(response) {
                obj = JSON.parse(response);
                //console.log(decodeURIComponent(obj.data));
                res = decodeURIComponent(obj.data);
                //var resary = res.split(",");
                //resary.shift();
                scoreary = obj.data;
                console.log(scoreary);
                if(scoreary.length == 0){
                    alert('文本全部結束');
                    return;
                }
                //處理排行
                var topkey = scoreRank(scoreary);
                console.log('top:'+topkey.key);
                //更動選單內資訊
                setTextMenu(scoreary);
                //showseg(resary);
                showTextScore(topkey.value)
                //更改畫面
                setCommanText(num,topkey.key);
                //存擋
                saveAllLocalStorage();
                
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}

function setTextMenu(ary){
    $('.list-group-item #u_score').text('--');
    for(var i in ary){
        _x = (parseInt(ary[i][0]) + 1);
        _score = roundFun(ary[i][1]);
        $('a[key="'+ _x +'"] #u_score').text(_score);
    }
}
//處理不確定採樣排行
function scoreRank(ary){
    var _ary = [];
    for(var i in ary){
        console.log(ary[i]);
        _ary.push({'key':ary[i][0],'value':ary[i][1]});
    }
    console.log(_ary);
    _ary = _ary.sort(function (a, b) {
        return a.value > b.value ? -1 : 1;
    });
    var top = _ary[0];
    console.log(top);
    return top
}

//根據排行調整畫面
function setCommanText(key,topkey){
    console.log('change');
    topkey = parseInt(topkey);
    topkey = topkey+1
    var  _list= loadLocalList();
    var checkround = 0;
    for(var i in _list){
        if(_list[i] == 1){
            checkround ++;
        }
    }
    console.log(checkround);
    $('#round').html((parseInt(checkround) + 1));
    relodpage('a[key="'+topkey+'"]');
    //$('a[key="'+key+'"]').removeClass('active').addClass('disabled');
}

//讀取頁面資料
function getpagetext(selector){
    var alltxt =$(selector).toArray();
    var text = calalltext(alltxt);
    return text;
}
//取小數n為
function roundFun(value, n) {
    return Math.round(value * 100000) / 100000 // 18.63
};

//顯示不確定抽樣分數資訊
function showTextScore(score){
    console.log(score);
    var _score = roundFun(score)
    console.log(_score);
    $('#text_score').html(_score);
}

//顯示字數資訊
function showTextCount(count){
    $('#text_count').html(count);
}

//按鍵換頁
function relodpage(selector){
    var alltxt = getpagetext("div.charblock");
    var num = $('.list-group-item.active').attr('key') ;
    saveLocalData(num,alltxt);
    $('.list-group-item').siblings().removeClass('active').addClass('disabled');
    $(selector).removeClass('disabled').addClass('active');

    var part = $(selector).attr('key') ;
    obj = sessionStorage.getItem(part);
    rowtext = (JSON.parse(obj)).text;
    serary = (JSON.parse(obj)).seg;
    load(rowtext,serary);
    showTextCount(rowtext.length);
}


//斷句結果換分頁
function changepage(){
    $(document).on('click', '#row-text', function(event){
        if($(this).is('.list-group-item.disabled')){
            return;
        }else{
            relodpage(this);
        }
    });
}

function getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1)/10)+min;
    };

function outputText(){
    $(document).on('click', '#savetextbtn', function(event){
        console.log('SAVE');
        var txtFile = "test.txt";
        var user = $('#username').val();
        
        var content = localStorage.getItem(user);
        // any kind of extension (.txt,.cpp,.cs,.bat)
        
        var blob = new Blob([content], {
         type: "text/plain;charset=utf-8"
        });
        saveAs(blob, txtFile);
    });
}

function textprogressbar(){
    var getMax = function() {
        return $("#all-text").prop("scrollHeight") - $("#all-text").height();
        //return $(document).height() - $(window).height();
    }
    var getValue = function() {
        return $('#all-text').scrollTop();
    }
    if ('max' in document.createElement('progress')) {
        var progressBar = $('progress');
        progressBar.attr({
            max: getMax()
        });

        $('#all-text').on('scroll', function() {
            progressBar.attr({
                value: getValue()
            });
            
        });
        $('#all-text').resize(function() { 
            progressBar.attr({
                max: getMax(),
                value: getValue()
            });
        });
    } else {
        var progressBar = $('.progress-bar'),
            max = getMax(),
            value, width;

        var getWidth = function() {
            
            value = getValue();
            width = (value / max) * 100;
            width = width + '%';
            return width;
        }

        var setWidth = function() {
            progressBar.css({
                width: getWidth()
            });
        }

        $(document).on('scroll', setWidth);
        $(window).on('resize', function() {
            
            max = getMax();
            setWidth();
        });
    }
}
