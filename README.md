# Single Sign On

## Using SSO to login to the marketplace

Nexxchange uses a custom solution for SSO (Single Sign On). The basic flow of this solution is requesting the validation of user credentials and receiving an url with which automatically can be logged into the Nexxchange Marketplace.

Any application or site that uses this authentication method, requires the following information:

| Key         | Description |
|:----------- |:----------- |
| `suite-url` | This is the url at which the Nexxchange Suite can be reached. |
| `token`     | This is a requested token, which is used to authenticate the application or site. This is always a 36 character long alphanumeric token. |
| `origin-id` | This identifies the application at the Nexxchange Suite. This is always a 24 character long alphanumeric token. |

## Validating credentials

**API URL**: `<suite-url>/thirdPartyAuth/validate?authToken=<token>&origin=<origin-id>`

Validating the user credentials is done through a JSON POST request to the above URL with the following parameters:

| Parameters   |     |
|:------------ |:--- |
| `userName`   | **Required** The marketplace username, this is an email address |
| `password`   | **Required** The marketplace password |
| `targetPage` | *Optional* A page on the marketplace to redirect the user to upon login |

See for example the request below:

```
curl \
  --location https://node01.nexxchange.com/golfsuite/thirdPartyAuth/validate?authToken=12345678-abcd-efgh-ijkl-1234567890yz&origin=1a2b3c4d5e6f7g8h9i0jklmn \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "userName": "user@example.com",
  "password": "user-password",
  "targetPage": "/sso/landing"
}'
```

> **Warning** Please note that this url is just for demo purposes, and does not actually work. Please find the correct Nexxchange Suite URL in the provided documentation.

This will return the following information:

| Key | Type |     |
|:--- |:---- |:--- |
| `success` | `boolean` | Did the request succeed? |
| `data`    | `string`  | The login URL which will automatically log the user into the Nexxchange Marketplace |

In case this request fails, `success` will be `false` and an `error` field will be present, showing the reason for failure.

## PHP Example

The following code snippet is an example how this can be implemented based on a form submission in PHP. This uses the same demo information as the example above.

```php
<?php

// Configuration
$SUITE_URL = 'https://node01.nexxchange.com/golfsuite/thirdPartyAuth/validate';
$AUTH_TOKEN = '12345678-abcd-efgh-ijkl-1234567890yz';
$ORIGIN_ID = '1a2b3c4d5e6f7g8h9i0jklmn';

if(!empty($_POST)) {
  // Prepare the data
  $data = json_encode([
    'userName' => $_POST['userName'],
    'password' => $_POST['password'],
    'targetPage' => '/sso/landing'
  ]);

  // Prepare the connection
  $c = curl_init("$SUITE_URL?authToken=$AUTH_TOKEN&origin=$ORIGIN_ID");

  if (defined('CURLOPT_IPRESOLVE') && defined('CURL_IPRESOLVE_V4')){
    curl_setopt($c, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  }
  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, $data);
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($c, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);

  // Send the request
  $response = curl_exec($c);
  $json_response = json_decode($response, true);
  curl_close($c);

  // If the request is successful
  if($json_response['success']) {
    $redirectUrl = $json_response['data'];
    header("Location: $redirectUrl");
    die();
  } else {
    $message = $json_response['error'];
  }
}

// If there is something wrong, fall back to the form
?>

<form action="" method="post">
  <?php if($message): ?>
  <p><?php echo $message; ?></p>
  <?php endif; ?>

  <label>Username:</label>
  <input name="userName" />

  <label>Password:</label>
  <input name="password" type="password" />

  <input type="submit" value="Login" />
</form>
```

