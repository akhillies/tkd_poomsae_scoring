git status
git add -A
git commit -m "$1"
git pull
git push origin master
git checkout gh-pages
git pull
git rebase master
git push origin gh-pages
git checkout master
