# passAuth
Login authentication using node, express, mongodb, mongoose and basic html (no templates).

This is a simple node app primarily focusing on password authentication, session creation and and password hashing.

I have used express framework over node runtime environment.

MongoDB is used since it easy to understand and easily implementable.
Mongoose is used over mongodb.

BCRYPT algorithm is used for password hashing since it is better than all those crappy hashing algos out there.
Virtually non vulnerable to brute force attacks, bit slower though.

I have deployed simple HTML pages and not used any template engine just to keep it easily understandable.

NOTE:

Install all the dependencies from npm.

>npm instal express body-parser client-sessions mongoose bcrypt

To run

>node app.js
