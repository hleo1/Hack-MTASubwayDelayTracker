To Run:
npm i

node ./index.js

Runs the instance of the service, keeps track of delays from MTA's api, updating every 30 seconds.
Delay times should be in sync with https://new.mta.info/

To maintain the lines that are currently delayed, used a set data structure. Every time the set of delayed
trains change, we can either conclude more trains have been delayed or have been recovered, by doing set 
difference operations.


Challenges:
Figuring out MTA api without that much documentation, ie, how to understand how a "delay" is represented, also how 
they have an internal "timestamp" and that delays have "endtimes" once they can forsee the end of the delay alert.