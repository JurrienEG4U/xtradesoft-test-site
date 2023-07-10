# Single Sign On

## Inloggen op de marktplaats via SSO

Nexxchange gebruikt een maatwerk oplossing voor SSO (Single Sign On). Aan de hand van de gebruikersgegevens word een URL ontvangen, waarmee automatisch ingelogd kan worden bij de Nexxchange marktplaats.

Elke applicatie of website die deze methode gebruikt, heeft de volgende informatie nodig:

| Sleutel     | Omschrijving |
|:----------- |:------------ |
| `suite-url` | De url waarop de Nexxchange Suite te bereiken is |
| `token`     | Een token die bij de implementatie gecommuniceerd word, die gebruikt word om de applicatie of website te authenticeren. Dit is een 36-teken alfanumerieke code. |
| `origin-id` | Deze Site ID identificeert de applicatie bij de Nexxchange Suite, en is een 24-teken alfanumerieke code. |

## Gebruikersgegevens valideren

**API URL**: `<suite-url>/thirdPartyAuth/validate?authToken=<token>&origin=<origin-id>`

Het valideren van de gebruikersgegevens gaat via een JSON POST aanvraag naar de bovenstaande URL met de volgende parameters:

| Parameter    |     |
|:------------ |:--- |
| `userName`   | **Verplicht** De marktplaats gebruikersnaam, dit is een emailadres |
| `password`   | **Verplicht** De marktplaats wachtwoord |
| `targetPage` | *Optioneel* Een pagina op de marktplaats waarnaar verwezen word an een succesvolle login |

Zie bijvoorbeeld de onderstaande aanvraag:

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

> **LET OP** Deze aanvraag is puur voor demo doeleinden en verwijst niet naar een bestaand systeem. U kunt de daadwerkelijke url vinden in de bijgevoegde implementatie documentatie.

De aanvraag geeft de volgende informatie terug:

| Sleutel   | Type      |     |
|:--------- |:--------- |:--- |
| `success` | `boolean` | Is de aanvraag geslaagd? |
| `data`    | `string`  | De url waarmee automatisch ingelogd kan worden in de Nexxchange Marktplaats |
| `error`   | `string`  | If the request failed, this field will contain the error and will not exist on a successful request |
| `error`   | `string`  | Wanneer de aanvraag mislukt is ( `success` is dus `false` ) staat hier de foutmelding, dit veld is niet aanwezig als de aanvraag successvol is |

## PHP Code Voorbeeld

The following code snippet is an example how this can be implemented based on a form submission in PHP. This uses the same demo information as the example above.

De onderstaande code is een voorbeeld hoe de SSO geïmplementeerd kan worden door middel van PHP. Dit voorbeeld gebruikt dezelfde demo informatie als de bovenstaande aanvraag.

```php
<?php

// Configuratie
$SUITE_URL = 'https://node01.nexxchange.com/golfsuite/thirdPartyAuth/validate';
$AUTH_TOKEN = '12345678-abcd-efgh-ijkl-1234567890yz';
$ORIGIN_ID = '1a2b3c4d5e6f7g8h9i0jklmn';

if(!empty($_POST)) {
  // Bereid de data voor
  $data = json_encode([
    'userName' => $_POST['userName'],
    'password' => $_POST['password'],
    'targetPage' => '/sso/landing'
  ]);

  // Bouw de URL op om mee te communiceren
  $url = $SUITE_URL . '?' . http_build_query([
    'authToken' => $AUTH_TOKEN,
    'origin' => $ORIGIN_ID
  ])
  $c = curl_init($url);

  if (defined('CURLOPT_IPRESOLVE') && defined('CURL_IPRESOLVE_V4')){
    curl_setopt($c, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  }
  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, $data);
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($c, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);

  // Verstuur de aanvraag
  $response = curl_exec($c);
  $json_response = json_decode($response, true);
  curl_close($c);

  // Als de aanvraag succesvol is
  if($json_response['success']) {
    $redirectUrl = $json_response['data'];
    header("Location: $redirectUrl");
    die();
  } else {
    $message = $json_response['error'];
  }
}

// Mocht er iets verkeerd gaan, of er is nog geen aanvraag gedaan, toon het formulier.
?>

<form action="" method="post">
  <?php if($message): ?>
  <p><?php echo $message; ?></p>
  <?php endif; ?>

  <label>Gebruikersnaam:</label>
  <input name="userName" />

  <label>Wachtwoord:</label>
  <input name="password" type="password" />

  <input type="submit" value="Inloggen" />
</form>
```

