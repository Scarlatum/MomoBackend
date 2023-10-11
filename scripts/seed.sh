for x in ./queries/*.surql
do
  surreal import --conn http://127.0.0.1:5000 -u default -p default --ns 0 --db 0 $x
done