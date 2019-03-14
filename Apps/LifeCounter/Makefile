CC=jsbloat
RM=del

all: release

release:
	$(CC) src/*.js src/lang/cz.js -o concat.cz.js -H src/hints.txt
	$(CC) src/*.js src/lang/en.js -o concat.en.js -H src/hints.txt

clean:
	$(RM) concat.cz.js concat.en.js