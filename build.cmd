
set inputs=src/tgen-base.js src/tgen-colormaps.js src/tgen-blends.js src/tgen-effects.js src/tgen-filters.js src/tgen-shapes.js
set options_min=--language_in ECMASCRIPT5 --compilation_level SIMPLE_OPTIMIZATIONS
set options_debug=--language_in ECMASCRIPT5 --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT

rem Google Closure Compiler
rem Download : http://dl.google.com/closure-compiler/compiler-latest.zip
java -jar closure-compiler.jar %options_min% --js %inputs% --js_output_file ./tgen.min.js
java -jar closure-compiler.jar %options_debug% --js %inputs% --js_output_file ./tgen.debug.js

pause