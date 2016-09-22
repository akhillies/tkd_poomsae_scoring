git status
echo

echo -n "add everything? (y/n): "
read add
if [ "$add" == "n" ] 
then
    echo "nothing happened"
    exit
fi
git add -A

git status
echo

echo -n "commit? (y/n): "
read commit
if [ "$commit" == "n" ] 
then
    echo "added but no commit"
    exit
fi
git commit -m "$1"

git status
echo

echo -n "pull and push? (y/n): "
read puspul 
if [ "$puspul" == "n" ] 
then
    echo "committed but no push"
    exit
fi
git pull --rebase
git push
