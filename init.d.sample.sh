#!/bin/sh
# Init.d Script
# Requires installation of Forever
# @see https://github.com/indexzero/forever

### BEGIN INIT INFO
# Provides:          procrastinator
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts procrastinator queue service
# Description:       starts procrastinator queue service using forever
### END INIT INFO

NAME=procrastinator
APP=/opt/procrastinator/bin/server
LOG=/var/log/procrastinator.log
ERROR_LOG=/var/log/procrastinator.log
PID=/var/run/procrastinator.pid
DAEMON=/usr/local/bin/forever
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin


test -x $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting $NAME: "
        $DAEMON start -o $LOG -e $ERROR_LOG --append --pidfile $PID $APP
        ;;
  stop)
        echo -n "Stopping $NAME: "
        $DAEMON stop $APP
        ;;

  restart|force-reload)
        echo -n "Stopping $NAME: "
        $DAEMON stop $APP
        sleep 1
        echo -n "Starting $NAME: "
        $DAEMON start -o $LOG -e $ERROR_LOG --append --pidfile $PID $APP
        ;;
  *)
        N=/etc/init.d/$NAME
        echo "Usage: $N {start|stop|restart|reload|force-reload}" >&2
        exit 1
        ;;
esac

exit 0
