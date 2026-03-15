@echo off
npx.cmd -y create-next-app@latest ./ --ts --tailwind --eslint --app --src-dir --import-alias "@/*" > init_output.txt 2>&1
echo DONE >> init_output.txt
