/*!
 * Knuth suffle seeded
 * v1.0.6 / Jan 31, 2015 
 * https://github.com/TimothyGu/knuth-shuffle-seeded
 */
!function(n){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var r;"undefined"!=typeof window?r=window:"undefined"!=typeof global?r=global:"undefined"!=typeof self&&(r=self),r.shuffle=n()}}(function(){return function n(r,e,t){function o(i,u){if(!e[i]){if(!r[i]){var a="function"==typeof require&&require;if(!u&&a)return a(i,!0);if(f)return f(i,!0);var d=new Error("Cannot find module '"+i+"'");throw d.code="MODULE_NOT_FOUND",d}var l=e[i]={exports:{}};r[i][0].call(l.exports,function(n){var e=r[i][1][n];return o(e||n)},l,l.exports,n,r,e,t)}return e[i].exports}for(var f="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(n,r,e){"use strict";var t=n("seed-random");r.exports=function(n,r){var e,o,f,i;if(i=null==r?t():t(r),n.constructor!==Array)throw new Error("Input is not an array");for(e=n.length;0!==e;)f=Math.floor(i()*e--),o=n[e],n[e]=n[f],n[f]=o;return n}},{"seed-random":2}],2:[function(n,r,e){(function(n){"use strict";function e(n){var r,e=n.length,t=this,o=0,i=t.i=t.j=0,u=t.S=[];for(e||(n=[e++]);f>o;)u[o]=o++;for(o=0;f>o;o++)u[o]=u[i=c&i+n[o%e]+(r=u[o])],u[i]=r;(t.g=function(n){for(var r,e=0,o=t.i,i=t.j,u=t.S;n--;)r=u[o=c&o+1],e=e*f+u[c&(u[o]=u[i=c&i+r])+(u[i]=r)];return t.i=o,t.j=i,e})(f)}function t(n,r){for(var e,t=n+"",f=0;f<t.length;)r[c&f]=c&(e^=19*r[c&f])+t.charCodeAt(f++);return o(r)}function o(n){return String.fromCharCode.apply(0,n)}var f=256,i=[],u=void 0===n?window:n,a=Math.pow(f,6),d=Math.pow(2,52),l=2*d,c=f-1,s=Math.random;r.exports=function(n,c){if(c&&!0===c.global)return c.global=!1,Math.random=r.exports(n,c),c.global=!0,Math.random;var s=[],p=(t(function n(r,e){var t,o=[],f=(typeof r)[0];if(e&&"o"==f)for(t in r)try{o.push(n(r[t],e-1))}catch(n){}return o.length?o:"s"==f?r:r+"\0"}(c&&c.entropy||!1?[n,o(i)]:0 in arguments?n:function(n){try{return u.crypto.getRandomValues(n=new Uint8Array(f)),o(n)}catch(n){return[+new Date,u,u.navigator&&u.navigator.plugins,u.screen,o(i)]}}(),3),s),new e(s));return t(o(p.S),i),function(){for(var n=p.g(6),r=a,e=0;d>n;)n=(n+e)*f,r*=f,e=p.g(1);for(;n>=l;)n/=2,r/=2,e>>>=1;return(n+e)/r}},r.exports.resetGlobal=function(){Math.random=s},t(Math.random(),i)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});

/*!
 * Custom code
 */
var key = 13;
var out_len_long = 128;
var out_len_short = 25;
var charset = [
	"ABCDEFGHIJKLMNOP",
	"QRSTUVWXYZAEIOUY",
	"abcdefghijklmnop",
	"qrstuvwxyzaeiouy",
	"0123456789135790",
	"~!?#%^&-_.,<>{}+"
];

function convertstring (str, seed) {
	var out = "";
	for (let i = 0; i < str.length; i++) {
		var n = parseInt("0x" + str[i]);
		var idx = Math.floor((seed + i) % charset.length);
		out += charset[idx].substr(n, 1);
	}
	return out;
}

function hashstring (str, id, len) {
	var hash = str + str.length + key + id;
	var seed = str.length;
	for (let i = 0; i < str.length; i++) {
		hash = shake256(hash, 4096);
	}

	var pass_b16 = hash.substring(0, len);
	var pass_out = convertstring(pass_b16, seed);

	var shuffle_seed = hash.substring(len, 64);
	pass_out = shuffle(pass_out.split(""), shuffle_seed).join("");
	return pass_out;
}

function runhash (len) {
	$("textarea.form-control-lg").each (function (index) {
		var out = hashstring($( "input#pass" ).val(), index, len);
		$(this).val(out);
	});
	$( "input#pass" ).val("");
}

function showalert (message, alerttype) {
	$("body").append ("<div id='alertdiv' class='alert alert-" +  alerttype + " m-2'><span>" + message + "</span></div>");
	setTimeout (function() {$("#alertdiv").remove()}, 10000);
}

var clipboard = new ClipboardJS(".cpybtn");
clipboard.on ("success", function(e) {
	showalert ("Copied: " + e.text, "success");
	e.clearSelection();
	$("textarea").each (function (i) {$(this).val("")});
});

clipboard.on ("error", function(e) {showalert ("Error copying text", "danger")});

$( "#submit-long" ).click (function() {
	runhash(out_len_long);
});

$(document).on ("keypress",function(e) {
	if(e.which == 13) {
		runhash(out_len_long);
	}
});

$( "#submit-short" ).click (function() {
	runhash(out_len_short);
});
