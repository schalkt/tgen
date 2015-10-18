
set inputs=tgen-base.js tgen-colormaps.js tgen-blends.js tgen-effects.js tgen-filters.js tgen-shapes.js
set options_min=--language_in ECMASCRIPT6 --compilation_level SIMPLE
set options_debug=--language_in ECMASCRIPT6 --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT

rem Google Closure Compiler
rem Download : http://dl.google.com/closure-compiler/compiler-latest.zip
java -jar compiler.jar %options_min% --js %inputs% --js_output_file ./../tgen.min.js
java -jar compiler.jar %options_debug% --js %inputs% --js_output_file ./../tgen.debug.js

pause