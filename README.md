# Demo Site

Html source can be found in `src/`.
The authentication script is `src/auth.php`.

## Running

It runs on docker:

```
cp -n .env{.example,}
docker compose up -d
```

Then you can open the site on [localhost:8082](http://localhost:8082)

## Styling

Only configuration of styling is present in `src/css/main.css`.

```
/*
/* a.a. Variables
/* =================================================================== */
:root {
	--background-color: #0e1015;
	--background-color-light: #ecf0f1;
	--text-color: #575859;
	--accent-color: #56b9f1;
	--accent-hover-color: #000000;
	--accent-hover-alt: #27a5ed;
	--header-color: #252525;
	--lead-color: #707273;
	--muted-color: #7d7e80;

  [...]
```

## PHPStan
```sh
docker-compose exec php composer phpstan
```
