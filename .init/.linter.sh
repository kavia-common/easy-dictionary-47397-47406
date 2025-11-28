#!/bin/bash
cd /home/kavia/workspace/code-generation/easy-dictionary-47397-47406/dictionary_frontend
npx eslint 
$ESLINT_EXIT_CODE
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

