all:
	@cd src; grunt

install:
	@cd src; npm install; npm update

lint:
	@find . -not \( -path '*/src/*' -prune \) -type f -iname '*.php' -print0 | xargs -0 -I {}  sh -c "php -l {} || true" >/dev/null
