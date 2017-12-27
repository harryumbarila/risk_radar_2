<?php
//composer require mailgun/mailgun-php:~1.7.2
require 'vendor/autoload.php';
use Mailgun\Mailgun;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	if (isset($_POST['sname'])) {
	$sname=$_POST['sname'];
	$to = "hello@joboxapp.com";
	$subject = "contact from joboxapp.com";
	$msg = $_POST['msg'];
	$msgtype = 'html';
	if($msgtype=='text'){
	    $html='';
	}
	else{
	$msg = htmlentities($msg);
	$html=$msg;
	$msg='';
	}
	 
	$mgClient = new Mailgun('key-6777a830147ff8494d5f12016c7962a3');
	$domain = "https://api.mailgun.net/v3/notifications.joboxapp.com";

	# Make the call to the client.
	$result = $mgClient->sendMessage($domain, array(
	"from" => "$sname <mailgun@notifications.joboxapp.com>",
	 "to" => "joboxapp <$to>",
	 "subject" => "$subject",
	 "text" => "$msg",
	 'html' => "$html"
	));
	}

}
echo "ok";

?>