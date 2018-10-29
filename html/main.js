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
    override_txt_val="軒轅之時神農氏世衰諸侯相侵伐暴虐百姓而神農氏弗能征於是軒轅乃習用干戈以征不享諸侯咸來賓從而蚩尤最為暴莫能伐炎帝欲侵陵諸侯諸侯咸歸軒轅軒轅乃修德振兵治五氣藝五種撫萬民度四方教熊羆貔貅貙虎以與炎帝戰於阪泉之野三戰然後得其志蚩尤作亂不用帝命於是黃帝乃徵師諸侯與蚩尤戰於涿鹿之野遂禽殺蚩尤而諸侯咸尊軒轅為天子代神農氏是為黃帝天下有不順者黃帝從而征之平者去之披山通道未嘗寧居";
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
                        .css('margin-bottom',$('#wordmargin').val())
                        .attr('id','char')
                        .text(charary[i]);
                    var seg_block = $("<div></div>")
                        .addClass('charblock')
                        .attr('id','seg')
                        .text("　");
                    $("#all-text")
                        .append(char_p)
                        .append(seg_block);
                }
                //elem.textContent=lines[pos];
                //container.appendChild(elem);
        }
    	calc();
	$('#myModal').modal('hide');
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
            $(this).text(',').css('padding-right',14).css('padding-left',14);
        }else if(segary[nowseg] == 1){
            $(this).text('　').css('padding-right',3).css('padding-left',3);
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
        if(resrary[i] == 0){
            ele.text('　').css('background-color','#FFFFFF').css('padding-right',3).css('padding-left',3);
            ele.text(',').css('padding-right',14).css('padding-left',14);
        }else if(resrary[i] == 1){
            ele.text('　').css('padding-right',3).css('padding-left',3);
            ele.text(',').css('background-color','#66FF66').css('padding-right',14).css('padding-left',14);
        }else if(resrary[i] == 2){
            ele.text('　').css('padding-right',3).css('padding-left',3);
            ele.text(',').css('background-color','#33FFFF').css('padding-right',14).css('padding-left',14);
        }else{
            ele.text('　').css('background-color','#FFFFFF').css('padding-right',3).css('padding-left',3);
        }
    }
}

//斷句結果換分頁
function relod(){
    $(document).on('click', '#reload', function(event){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        segload();
    });
}

function getRandom(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    };

//假的斷句結果
function segload(autoary,userary){
    txt_val="軒轅之時神農氏世衰諸侯相侵伐暴虐百姓而神農氏弗能征於是軒轅乃習用干戈以征不享諸侯咸來賓從而蚩尤最為暴莫能伐炎帝欲侵陵諸侯諸侯咸歸軒轅軒轅乃修德振兵治五氣藝五種撫萬民度四方教熊羆貔貅貙虎以與炎帝戰於阪泉之野三戰然後得其志蚩尤作亂不用帝命於是黃帝乃徵師諸侯與蚩尤戰於涿鹿之野遂禽殺蚩尤而諸侯咸尊軒轅為天子代神農氏是為黃帝天下有不順者黃帝從而征之平者去之披山通道未嘗寧居";
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
    showseg(resrary);
    console.log(resrary);
}