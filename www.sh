export INC=/usr/share/perl5
cd ..
while true;
do
  ncat --sh-exec "./bash/response.sh" -p 8888 -l --keep-open -m 100
done 
