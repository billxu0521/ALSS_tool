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

//讀取文本
function load(override_txt_val) {
    //override_txt_val="軒轅之時神農氏世衰諸侯相侵伐暴虐百姓而神農氏弗能征於是軒轅乃習用干戈以征不享諸侯咸來賓從而蚩尤最為暴莫能伐炎帝欲侵陵諸侯諸侯咸歸軒轅軒轅乃修德振兵治五氣藝五種撫萬民度四方教熊羆貔貅貙虎以與炎帝戰於阪泉之野三戰然後得其志蚩尤作亂不用帝命於是黃帝乃徵師諸侯與蚩尤戰於涿鹿之野遂禽殺蚩尤而諸侯咸尊軒轅為天子代神農氏是為黃帝天下有不順者黃帝從而征之平者去之披山通道未嘗寧居";
	var lines=(override_txt_val||$('#txt').val()).split('\n'),
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
                    var char_p = $("<div></div>")
                        .addClass('charblock')
                        .attr('id','char')
                        .text(charary[i]);                    
                    var seg_block = $("<div></div>")
                        .addClass('charblock')
                        .attr('id','seg')
                        .attr('title','請點擊此框進行標註')
                        .text('　')
                        .append("<div id='segline'></div>");
                        $("#all-text")
                        .append(char_p)
                        .append(seg_block);
                }
                //elem.textContent=lines[pos];
                //container.appendChild(elem);
        }
    	calc();
    $('.charblock').tooltip();
	$('#inputModal').modal('hide');
}

//當輸出視窗被打開時讀取
function showexport(){
    $('#ouputModal').on('shown.bs.modal', function (e) {
        var alltxtary = [];
        var alltxt = "";
        var textary=$("div.charblock").toArray();
        //var segary=$("div#seg").toArray();
        for(var i in textary){
            var _char = textary[i].textContent;
            //alltxtary.push(_char);
            if(_char == '　'){
                continue;
            }else{
                alltxt += _char;
            }
        }
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

//標註斷句
function annosegment(){
    $(document).on('click', '#seg', function(event){
        var segary = segmentcount();
        var nowseg = $('div#seg').index(this);
        if(segary[nowseg] == 0){
            $(this).text(',').css('padding-right',14).css('padding-left',14).append("<div id='segline'></div>");
        }else if(segary[nowseg] == 1){
            $(this).text('　').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
        }
        var segary = segmentcount();
        var time = gettime();
        console.log(time + "////回傳斷句" + segary);
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


//送出預測文本
function sendtext(){
    $(document).on('click', 'button[name="sendtext"]', function(event){
        $.ajax({
            url: 'http://localhost:5000/preseg',
            data: $('textarea#txt').serialize(),
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


//產出標點符號temp
function showseg_temp(resrary){
    for(var i in resrary){
        var ele=$("div#seg").eq(i);
        var ele_bk=$("#seg > #segline").eq(i);
        if(resrary[i] == 0){
            ele.text('　').css('background-color','#FFFFFF').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
            ele.val(',').css('padding-right',14).css('padding-left',10).append("<div id='segline'></div>");

        }else if(resrary[i] == 1){
            ele.text('　').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
            ele.children('#segline').text(',').css('background-color','#66FF66').css('padding-right',10).css('padding-left',10).css('line-height','30%');
        }else if(resrary[i] == 2){
            ele.text('　').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
            ele.children('#segline').text(',').css('background-color','#33FFFF').css('padding-right',10).css('padding-left',10).css('line-height','30%');
        }else{
            ele.text('　').css('background-color','#FFFFFF').css('padding-right',3).css('padding-left',3).append("<div id='segline'></div>");
        }
    }
}


//斷句結果換分頁
function relod(){
    $(document).on('click', '#reload', function(event){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        console.log($(this).attr('value'));
        if($(this).attr('value') == 1){
            segload(1);
        }else if($(this).attr('value') == 2){
            segload(2);
        }else if($(this).attr('value') == 3){
            segload(3);
        }
    });
}

function getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    };

//假的斷句結果
function segload(num){
    if(num == 1){
        txt_val="軒轅之時神農氏世衰諸侯相侵伐暴虐百姓而神農氏弗能征於是軒轅乃習用干戈以征不享諸侯咸來賓從而蚩尤最為暴莫能伐炎帝欲侵陵諸侯諸侯咸歸軒轅軒轅乃修德振兵治五氣藝五種撫萬民度四方教熊羆貔貅貙虎以與炎帝戰於阪泉之野三戰然後得其志蚩尤作亂不用帝命於是黃帝乃徵師諸侯與蚩尤戰於涿鹿之野遂禽殺蚩尤而諸侯咸尊軒轅為天子代神農氏是為黃帝天下有不順者黃帝從而征之平者去之披山通道未嘗寧居";
    }else if(num == 2){
        txt_val="東至于海登丸山及岱宗西至于空桐登雞頭南至于江登熊湘北逐葷粥合符釜山而邑于涿鹿之阿遷徙往來無常處以師兵為營衛官名皆以雲命為雲師置左右大監監于萬國萬國和而鬼神山川封禪與為多焉獲寶鼎迎日推筴舉風后力牧常先大鴻以治民順天地之紀幽明之占死生之說存亡之難時播百穀草木淳化鳥獸蟲蛾旁羅日月星辰水波土石金玉勞勤心力耳目節用水火材物有土德之瑞故號黃帝";
    }else if(num == 3){
        txt_val="黃帝居于軒轅之丘而娶于西陵之女是為嫘祖為黃帝正妃生二子其後皆有天下其一曰玄囂是為青陽青陽降居江水其二曰昌意降居若水昌意娶蜀山氏女曰昌仆生高陽高陽有聖德焉黃帝崩葬橋山其孫昌意之子高陽立是為帝顓頊也";
    }

    load(txt_val);
    var textary = txt_val.split("");
    var autoary = [];
    var userary = [];
    var resrary = [];
    for(var i in textary){
        var ran = getRandom(1,15);
        if(ran == 1){
            autoary.push(1);
        }else{
            autoary.push(0);
        }
    }

    for(var i in textary){
        var ran = getRandom(1,10);
        if(ran == 1){
            userary.push(1);
        }else{
            userary.push(0);
        }
    }

    //0兩邊ㄧ樣 1電腦 2使用者
    for(var i in autoary){
        if(autoary[i] == 1 && userary[i] == 1){
            resrary.push(0);
        }else if(autoary[i] == 1){
            resrary.push(1);
        }else if(userary[i] == 1){
            resrary.push(2);
        }else{
            resrary.push(3);
        }
    }
    showseg_temp(resrary);
    console.log(resrary);
}