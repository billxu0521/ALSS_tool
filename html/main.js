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

//本地儲存資料session temp
function saveLocalDataTemp(){
    sessionStorage.setItem("text-1","軒,轅之,時神農氏世衰諸侯相侵伐暴虐百,姓而神農氏弗能征於是軒轅乃習用干戈以征不享諸侯咸來賓從而蚩尤最為暴莫能伐炎帝欲侵陵諸侯諸侯咸歸軒轅軒轅乃修德振兵治五氣藝五種撫萬民度四方教熊羆貔貅貙虎以與炎帝戰於阪泉之野三戰然後得其志蚩尤作亂不用帝命於是黃帝乃徵師諸侯與蚩尤戰於涿鹿之野遂禽殺蚩尤而諸侯咸尊軒轅為天子代神農氏是為黃帝天下有不順者黃帝從而征之平者去之披山通道未嘗寧居"); //儲存資料，方法3
    sessionStorage.setItem("text-2","東至于海登丸山及岱宗西至于空桐登雞頭南至于江登熊湘北逐葷粥合符釜山而邑于涿鹿之阿遷徙往來無常處以師兵為營衛官名皆以雲命為雲師置左右大監監于萬國萬國和而鬼神山川封禪與為多焉獲寶鼎迎日推筴舉風后力牧常先大鴻以治民順天地之紀幽明之占死生之說存亡之難時播百穀草木淳化鳥獸蟲蛾旁羅日月星辰水波土石金玉勞勤心力耳目節用水火材物有土德之瑞故號黃帝"); //儲存資料，方法3
    //sessionStorage.removeItem("test1"); //刪除key值為test1這筆資料
    //sessionStorage.clear(); //刪除localStorage裡所有資料
    row_text = sessionStorage.getItem("text-1");
    obj = calsegary(row_text);
    console.log(obj);
    sessionStorage.setItem('1',JSON.stringify(obj));
}


//本地儲存資料session
function saveLocalData(num,data){
    var obj = calsegary(data);
    console.log(num + '-SAVE');
    //console.log(obj);
    sessionStorage.setItem(num,JSON.stringify(obj));
}


//計算文字中的斷句成陣列
function calsegary(data){
    var dataary = data.split('');
    var segary = [];
    var datatext = '';
    for(var i in dataary){
        if(dataary[i] == ','){
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
    for(var i in alltext){
        var _a = (parseInt(i)+1);
        saveLocalData(_a,alltext[i]);
        if(i == 0){
            continue;
        }else{
            var menubtn = $('<a></a>');
            menubtn.addClass("list-group-item").attr('id','row-text').attr('value',_a).text('第'+ _a +'區塊');
            $('.list-group').append(menubtn);
        }
    }
    var obj = sessionStorage.getItem('1');
    rowtext = (JSON.parse(obj)).text;
    serary = (JSON.parse(obj)).seg;
    load(rowtext,serary);

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
                        .attr('title','請點擊進行標註')
                        .append(char_block)
                        .append(seg_block);;
                    $("#all-text")
                        .append(char_seg);
                }
                //elem.textContent=lines[pos];
                //container.appendChild(elem);
        }
    	calc();
    $('.charseg').tooltip();
	$('#inputModal').modal('hide');
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
                .append("<div id='segline'></div>");
            $(this).find('#seg').find('#segline')
                .css('border-width','1px')
                .css('width','90%')
                .css('background-color','#CCEEFF')
                .animate({width: '65%'});
        }else if(segary[nowseg] == 1){
            $(this).find('#seg')
                .text('　')
                .css('padding-right',0)
                .css('padding-left',0)
                .append("<div id='segline'></div>");
            $(this).find('#seg').find('#segline')
                .css('border-width','1px')
                .css('background-color','#FFFFFF')
                .css('z-index','0')
                .css('width','90%')
                .animate({width: '65%'});
        }
        var segary = segmentcount();
        var time = gettime();
        //console.log(time + "////回傳斷句" + segary);
    });
    $(document).on('mouseenter', '.charseg', function(event){
        $(this).find('#seg').find('#segline')
        .animate({
            borderWidth:'1px',
            width: '65%'
        });
        $(this).find('#seg').animate({
            width: '30px'
        });
    });
    $(document).on('mouseleave', '.charseg', function(event){
        $(this).find('#seg').find('#segline')
        .css('background-color','#FFFFFF')
        .animate({
            borderWidth:'0px',
            width: '0%'
        });
        $(this).find('#seg').animate({
            width: '5px'
        });
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

//送出預測文本
function sendtext(){
    $(document).on('click', 'button[name="sendtext"]', function(event){
        //console.log($('textarea#outputtxt'));
        $.ajax({
            url: 'http://localhost:5000/preseg',
            data: $('textarea#outputtxt').serialize(),
            type: 'POST',
            success: function(response) {
                obj = JSON.parse(response);
                //console.log(decodeURIComponent(obj.data));
                res = decodeURIComponent(obj.data);
                var resary = res.split(",");
                resary.shift();
                console.log(resary);
                showseg(resary);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}


//讀取頁面資料
function getpagetext(selector){
    var alltxt =$(selector).toArray();
    var text = calalltext(alltxt);
    return text;
}

//斷句結果換分頁
function relodpage(){
    $(document).on('click', '#row-text', function(event){
        var alltxt = getpagetext("div.charblock");
        var num = $('.list-group-item.active').attr('value') ;
        saveLocalData(num,alltxt);
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var part = $(this).attr('value') ;
        obj = sessionStorage.getItem(part);
        rowtext = (JSON.parse(obj)).text;
        serary = (JSON.parse(obj)).seg;
        load(rowtext,serary);
    });
}

function getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    };
