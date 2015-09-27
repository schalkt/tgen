
set inputs=tgen-base.js tgen-blends.js tgen-effects.js tgen-filters.js tgen-shapes.js

rem Google Closure Compiler
java -jar compiler.jar --language_in ECMASCRIPT6 --compilation_level SIMPLE --js %inputs% --js_output_file ./../tgen.min.js
java -jar compiler.jar --language_in ECMASCRIPT6 --formatting PRETTY_PRINT --compilation_level WHITESPACE_ONLY --js %inputs% --js_output_file ./../tgen.debug.js

pause