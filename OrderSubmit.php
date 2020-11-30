<?php

/*
	* jQuery Simple Cart by Andrey Miasoedov <molotow11@gmail.com>
*/

$config = array(
	'sendTo' 	=> 'test@dummy.com',
	'siteName'	=> 'TestSite',
	'sentFrom'	=> 'order@testsite.com',
	'replyTo'	=> $_POST['email'] ? $_POST['email'] : 'order@testsite.com',
);

if($_POST) {	
	$subject = "Заказ на сайте {$config['siteName']}";
	$message = "Поступил заказ на сайте {$config['siteName']}\r\n";
	$message .= "-------------------------------------------------------------\r\n";
	$message .= $_POST['name'] . "\r\n";
	$message .= $_POST['phone'] . "\r\n";
	$message .= $_POST['email'] . "\r\n";
	$message .= "--------------------------------------------------------------\r\n";
	$message .= $_POST['order'];
	$headers = array(
		'From' => $config['sentFrom'],
		'Reply-To' => $config['replyTo'],
		'X-Mailer' => 'PHP/' . phpversion()
	);

	$res = mail($config['sendTo'], $subject, $message, $headers);
	var_dump($res);
}