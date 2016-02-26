#/bin/bash
read input
export input
export uri="`perl -e '$_=$ENV{\"input\"};@get=split(/ /);$_=$get[1];@url=split(/[\?]/);print $url[0];'`"
perl -e 'print "HTTP/1.1 200 OK\r\n"'
export mime="`file --mime-type /mnt/www$uri`"
export len="`cat /mnt/www$uri|wc -c`"
perl -e '$_=$ENV{"mime"};@x=split(/ /);$len=$ENV{"len"};print "Content-Type: $x[1]\r\nContent-Length: $len\r\n\r\n"'
cat /mnt/www$uri
