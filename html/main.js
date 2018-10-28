/*
主功能的js
 */


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
                var char = lines[pos].split("");
                console.log(char);
                for(var i in char){
                    var char_p = $("<div></div>")
                        .addClass('charblock')
                        .text(char[i]);
                    var seg_block = $("<div></div>")
                    .addClass('charblock')
                    .text("_");
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

function infoswitch() {
	$('#infobar>p').fadeToggle(200);
}