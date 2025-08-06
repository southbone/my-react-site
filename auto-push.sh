#!/bin/bash
git add .
git commit -m "🧠 autosave $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
git push > /dev/null 2>&1