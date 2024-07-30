#!/bin/bash

##########################################################################################################################################################
# Set Up the test
##########################################################################################################################################################

# Get the current timestamp
current_timestamp=$(date +"%Y-%m-%d %H:%M:%S")
# Echo the timestamp
echo "### Current timestamp: $current_timestamp" > ./Report.txt ; echo >> ./Report.txt

# init the db
echo "### Init the db" >> ./Report.txt
curl -X POST -d "dbName=db&tableName=posts&channelTableName=channels&UserTable=users" http://localhost:8080/init >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# delete the tables
echo "### Delete the tables" >> ./Report.txt
curl -X POST http://localhost:8080/delete >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# register admin
echo "### Register admin" >> ./Report.txt
curl -X POST -d "username=admin&password=admin&name=Admin" http://localhost:8080/register >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt


##########################################################################################################################################################
# Test basic system functionality
##########################################################################################################################################################

# register a user
echo "### Register a user" >> ./Report.txt
curl -X POST -d "username=TestUser&password=TestPassword&name=TestUser" http://localhost:8080/register >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# get all users
echo "### Get all users" >> ./Report.txt
curl -X GET http://0.0.0.0:8080/getallusers | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# login
echo "### Login" >> ./Report.txt
curl -X POST -d "username=TestUser&password=TestPassword" -c ./cookie.txt http://localhost:8080/login >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a channel
echo "### Create a channel" >> ./Report.txt
curl -X POST -d "channelName=Testchannel" -b ./cookie.txt http://localhost:8080/addchannel >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# get all channels
echo "### Get all channels" >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getchannels | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a post
echo "### Create a post" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=null" -F "data=Test post 1" -F "image=@./TestImage/testimage.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt
echo >> ./Report.txt

# create a post
echo "### Create a second post" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=null" -F "data=Test post 2" -F "image=@./TestImage/testimage1.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a post
echo "### Create a third post" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=null" -F "data=Test post 3" -F "image=@./TestImage/testimage2.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a post
echo "### Create a fourth post reply to the first" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=1" -F "data=Test post 4 child of post 1" -F "image=@./TestImage/testimage3.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a post
echo "### Create a fifth post reply to the second" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=2" -F "data=Test post 5 child of post 2" -F "image=@./TestImage/testimage4.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# create a post
echo "### Create a sixth post reply to the third" >> ./Report.txt
curl -X POST -F "channelID=1" -F "parentID=3" -F "data=Test post 6 child of post 3" -F "image=@./TestImage/testimage5.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt

# get all posts
echo "### Get all posts" >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getallposts | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt


##########################################################################################################################################################
# test for the admin
##########################################################################################################################################################
# create before deleting
echo "### Test for the admin. Create a channel, user, and post" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# create a channel
echo "### Create a channel" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X POST -d "channelName=Testchannel2" -b ./cookie.txt http://localhost:8080/addchannel >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
#create a user
echo "### Create a user" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X POST -d "username=TestUser2&password=TestPassword2&name=TestUser2" -b ./cookie.txt http://localhost:8080/register >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# create a post
echo "### Create a post" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X POST -F "channelID=2" -F "parentID=null" -F "data=Test post 7" -F "image=@./TestImage/testimage.png" -b ./cookie.txt http://localhost:8080/addpost >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt


# show the channel, user, and post exists
echo "### Show the channel, user, and post exists" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all users
echo "### Get all users" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET http://0.0.0.0:8080/getallusers | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all channels
echo "### Get all channels" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getchannels | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all posts
echo "### Get all posts" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getallposts | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt

# login as admin
# login
echo "### Login" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X POST -d "username=admin&password=admin" -c ./cookie.txt http://localhost:8080/login >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt


# delete the channel, user, and post
echo "### Delete the channel, user, and post" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# Delete the channel
echo "### Delete the channel" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X POST -d "channelID=2" -b ./cookie.txt http://localhost:8080/removechannel >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# Delete the user
echo "### Delete the user" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# Assuming you have the userID from the previous registration response or another method
curl -X POST -d "userID=3" -b ./cookie.txt http://localhost:8080/removeuser >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# Delete the post
echo "### Delete the post" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# Assuming you have the postID from the previous post creation response or another method
curl -X POST -d "postID=7" -b ./cookie.txt http://localhost:8080/removepost >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt


# show that the channel, user, and post have been deleted
echo "### Show that the channel, user, and post have been deleted" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all users
echo "### Get all users" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET http://0.0.0.0:8080/getallusers | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all channels
echo "### Get all channels" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getchannels | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
# get all posts
echo "### Get all posts" >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
curl -X GET -b ./cookie.txt http://0.0.0.0:8080/getallposts | grep -o '{[^}]*}' | tr '{' '\n' >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt ; echo >> ./Report.txt ; echo  >> ./Report.txt
##########################################################################################################################################################

# Get the current timestamp
current_timestamp=$(date +"%Y-%m-%d %H:%M:%S")
# Echo the timestamp
echo "### Current timestamp: $current_timestamp" >> ./Report.txt
echo >> ./Report.txt
