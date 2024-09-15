#	'ensure that formatted text option in draw.io is disabled everywhere'

D2J=./das2json/mac/das2json

all: space-skipping

space-skipping: space-skipping.drawio py0d.py
	${D2J} space-skipping.drawio
	python3 main.py . 0D/python "test.scn" main space-skipping.drawio.json

## house-keeping

clean:
	rm -rf *.json
	rm -rf *~
	rm -rf __pycache__

install-js-requires:
	npm install yargs prompt-sync ohm-js

