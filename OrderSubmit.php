<?php

/*
	* jQuery Simple Cart by Andrey Miasoedov <molotow11@gmail.com>
*/

$config = array(
	'sendTo' 	=> 'molotow11@gmail.com',
	'siteName'	=> 'Steckermann',
	'sentFrom'	=> 'order@steckermann.ru',
	'replyTo'	=> $_POST['email'] ? $_POST['email'] : 'order@steckermann.ru',
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