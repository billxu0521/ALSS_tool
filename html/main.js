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
}

//讀取文本
function load(override_txt_val) {
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
            $(this).text(',');
        }else if(segary[nowseg] == 1){
            $(this).text(' ');
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