<?php

$SUITE_URL = 'https://node06.nexxchange.com/ngftest/thirdPartyAuth/validate';
$AUTH_TOKEN = '2c0f0b5d-68b1-4e4f-9711-3c741863ddbd';
$ORIGIN_ID = '61791b74e07dff5a6d742103';

if(!empty($_POST)) {
  $data = json_encode([
    'userName' => $_POST['userName'],
    'password' => $_POST['password'],
    'targetPage' => 'http://groenstaete.com'
  ]);

  $curlurl = "$SUITE_URL?authToken=$AUTH_TOKEN&origin=$ORIGIN_ID";
  #echo '>>> calling ' . $curlurl . PHP_EOL;
  #echo '>>> with data ' . $data . PHP_EOL;

  $c = curl_init($curlurl);

  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, $data);
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($c, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);

  $response = curl_exec($c);
  #echo '>>> called, got result: ' . print_r($response, true) . PHP_EOL;
  #echo '>>> response info: ' . print_r(curl_getinfo($c, CURLINFO_HTTP_CODE), true) . PHP_EOL;

  if(curl_getinfo($c, CURLINFO_HTTP_CODE) == 200) {
    $json_response = json_decode($response, true);

    curl_close($c);

    die(json_encode([
      'url' => $json_response['data']
    ]));
  } else {
    die(json_encode([
      'error' => 'Failed to login'
    ]));
  }
} else {
  header('HTTP/1.0 403 Forbidden');
  die('Forbidden');
}
