#!/bin/sh

echo ""
ls -al

echo ""
echo "Please enter prefix to change"
echo ""

# IFS = Internal Field Separator
# it's default value is ' ', tab or newline 
# I'm making it '' so I can include any spaces that the user types in
IFS="" read prefix

echo ""
echo "Please enter prefix to change"
echo ""

echo ""
echo "These folders"
echo ""

echo ${#prefix}

for dir in "${prefix}"*; do
  echo ${dir}
done

echo ""
echo "Will become these folders"
echo ""

for dir in "${prefix}"*; do
  echo ${dir#${prefix}}
done

echo ""
echo "Do you accept? y/n"
echo ""

read permission

echo ""

if [ $permission=="y" ]; then
  for dir in "${prefix}"*; do
    mv "${dir}" "${dir#${prefix}}"
  done
else
  echo "Script exited successfully"
  echo ""
fi
