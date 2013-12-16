$( document ).ready(function() {

$('#login1').bind('click',function(e){
	e.preventDefault();
	loadOverlay(this);
});

});

function loadOverlay(element) {
	$('body').prepend('<div class="displayOverlay"><div id="login"><a class="exit" href=""><img class="exit" src="pics/X.gif" height="42" width="42"></img></a><h2>Login:</h2>'+
		'<form name="signup" action="/login" method="post">Username: <input type="text" name="username"> Password: <input type="password" name="password"><br><input type="submit" value="Submit"></form>');
	$('.exit').bind('click',function(e){
		e.preventDefault();
		$('.displayOverlay').remove();
		$('.exit').unbind('click');
	});
}