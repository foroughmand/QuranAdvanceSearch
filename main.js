(function($) {
	$.fn.goTo = function() {
		$('html, body').animate({
			scrollTop: $(this).offset().top + 'px'
		}, 'fast');
		return this; // for chaining...
	}
})(jQuery);

var roots, lems;
var qNum = 5;

function addCondition(conds, cond) {
	if (conds.length != 0)
		conds += " AND ";
	conds += "(" + cond + ")";
	return conds;
}

function generateQuery() {
	qRoot = ""; 
	qDist = "";
	maxQNum = 0;
	words = [];
	for (var i=0; i<qNum; i++) {
		w = $('#w_'+i).val();
		if (w != "") {
			maxQNum = Math.max(maxQNum, i+1);
			if (qRoot != "")
				qRoot  += " AND ";
			qRoot += '(w'+i+'.root="'+w+'")';
		}

		words.push($('#w_'+i+' option:selected').text());

		for (var j=0; j<qNum; j++) {
			wdElement = $('#wd_'+i+'_'+j);
			if (wdElement.length != 0) {
				wd = $('#wd_'+i+'_'+j).val();
				wdt = $('#wdt_'+i+'_'+j).val();
				if (wd.length > 0) {
					maxQNum = Math.max(maxQNum, i+1, j+1);

					wi = "w"+i+".";
					wj = "w"+j+".";

					if (wdt == "word-in-aye" || wdt == "aye" || wdt == "sure")
						qDist = addCondition(qDist, "ABS(" + wi + "sure - " + wj + "sure) <= " + (wdt == "sure" ? wd : 0));
					if (wdt == "word-in-aye" || wdt == "aye")
						qDist = addCondition(qDist, "ABS(" + wi + "aye - " + wj + "aye) <= " + (wdt == "aye" ? wd : 0));
					if (wdt == "word-in-aye")
						qDist = addCondition(qDist, "ABS(" + wi + "word - " + wj + "word) <= " + wd);
					if (wdt == "word-abs")
						qDist = addCondition(qDist, "ABS(" + wi + "word_abs - " + wj + "word_abs) <= " + wd);
					if (wdt == "aye-abs")
						qDist = addCondition(qDist, "ABS(" + wi + "aye_abs - " + wj + "aye_abs) <= " + wd);
				}
			}
		}
	}

	q = qRoot + (qRoot.length > 0 && qDist.length > 0 ? " AND " : "") + qDist;

	q += " LIMIT " + $('#limit').val();

	return {maxQNum, q, words};
}

function showResults(num, results, words) {
	r = $('#r');
	r.empty();
	t = '<table id="results">';
	t += "<thead><tr>";
	for (var j=0; j<num; j++) {
		t += "<th> Word " + j + " (sort)";
		t += "<th> Word " + j + " (" + words[j] + ")";
	}
	t += "</thead><tbody>";
	hiddenColumns = [];
	for (var i in results) {
		item = results[i];
		t += "<tr>";
		for (j in item) {
			wo = item[j];
			t += "<td>" + ('000'+wo.sure).slice(-3) + ":" + ('000'+wo.aye).slice(-3) + ":" + ('0000'+wo.word).slice(-4);
			t += "<td><a target='_blank' href='http://tanzil.ir/#" + wo.sure + ":" + wo.aye + "'>"+
				QuranData.Sura[wo.sure][4] + ":" +
				wo.aye + "</a> " +
				wo.word + "" ;
			hiddenColumns.push(j*2);
		}
	}
	t += '<tbody></table>';
	t = $(t);
	r.append(t);
	t.DataTable({
		"columnDefs": [
			{
			"targets": hiddenColumns,
			"visible": false,
			"searchable": false
			},
		]
	});
}

function search(wCount, q, words) {
		$.getJSON("http://212.16.76.108/~hadi/quran/search/q.php?num="+wCount+"&q="+q)
		.done(function(json){
			console.log('Q RES', json);
			showResults(json.n, json.results, words);
		})
		.fail(function (o, status, error) {
			console.log('error getting result', error);
		});
}

function init() {
	if (/*lems === undefined || */roots === undefined) {
		console.log('Init waiting ...');
		return;
	}
	s = $('#s');
	s.empty();
	qNum = parseInt($('#qNum').val());
	console.log('INIT');
	q = "<header><h2>Select Some Roots</h2></header>";
	for (var i=0; i<qNum; i++) {
		q += "<br>Word " + (i+1) + " <select id='w_"+i+"' class='root-selector chosen-select'>";
		q += "<option value=''></option>";
		$.each(roots.roots, function(i, item) {
			q += "<option value='" + item.root + "'>" + item.persian + "</option>";
		});
		q += "</select>";

		/*
		q += "Lem " + (i+1) + " <select id='l_"+i+"' class='root-selector chosen-select'>";
		q += "<option value=''></option>";
		$.each(lems.lems, function(i, item) {
			q += "<option value='" + item.lem + "'>" + item.persian + "</option>";
		});
		q += "</select>";
		*/
	}
	s.append(q);

	t = "<br><br>";
	t += "<header><h2>Select Some Distances Between roots</h2></header>";

	t += "<table class='table table-bordered'>";
	t += "<thead><tr><td>";
	for (var j=1; j<qNum; j++) {
		t += "<td>Word "+(j+1);
	}
	t += "</thead><tbody>";
	for (var i=0; i<qNum-1; i++) {
		t += "<tr>";
		t += "<td>Word "+(i+1);
		for (var j=1; j<qNum; j++) {
			t += "<td>";
			if (i<j) {
				t += "<input id='wd_"+i+"_"+j+"' size=3 class='numeric'/>";
				t += "<select id='wdt_"+i+"_"+j+"'>";
				t += "<option value='word-in-aye'>Word (Same Aye)</option>";
				t += "<option value='word-abs'>Word</option>";
				t += "<option value='aye'>Aye (Same Sure)</option>";
				t += "<option value='aye-abs'>Aye</option>";
				t += "<option value='sure'>Sure</option>";
				t += "</select>";
			}
		}
	}
	t += "<tbody></table>";

	//t += '<input id="limit" value=1000 size=4></input>';
	s.append(t);


	//searchButton = $('<a href="#results">Search</a>');
	searchButton = $('#search');
	searchButton.click( function() {
			console.log('search');
			nq = generateQuery();
			console.log("Query= " + nq.q)
			if (nq.maxQNum == 0) {
				alert("You entered nothing, please fill the search parameters");
				$('#search-q').goTo();
			} else
				search(nq.maxQNum, nq.q, words);
	});
	//s.append(searchButton);
	$('#search-q').show();
	$('.chosen-select').chosen();
	//$('.numeric').numeric();
	$('.numeric').keypress(function (e) {
		//if the letter is not digit then display error and don't type anything
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			//display error message
			//$("#errmsg").html("Digits Only").show().fadeOut("slow");
			return false;
		}
	});
	$('input').click(function() {return false; });
}
$(document).ready(function(){
	//$('#init').click(function() {
	//	console.log('LOAD');
		$.getJSON("http://212.16.76.108/~hadi/quran/search/root.php")
		.done(function(json){
			console.log('GET', json);
			roots = json;
			roots.roots.sort(function (a, b) {
				if (a.persian == b.persian)
					return 0;
				return (a.persian < b.persian) ? -1 : 1;
			});
			init();
		})
		.fail(function (o, status, error) {
			console.log('error', error);
		});
		/*
		$.getJSON("http://212.16.76.108/~hadi/quran/search/lem.php")
		.done(function(json){
			console.log('GET', json);
			lems = json;
			lems.lems.sort(function (a, b) {
				if (a.persian == b.persian)
					return 0;
				return (a.persian < b.persian) ? -1 : 1;
			});
			init();
		})
		.fail(function (o, status, error) {
			console.log('error', error);
		});
		*/
	//});
	$('#init').click(init);
});

