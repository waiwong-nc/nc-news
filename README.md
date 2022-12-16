# NC-NEWS


## $URL
To use the application , please go to [here](https://nc-news-kzwk.onrender.com/api)
<br /> <br /> 

## Summary
NC-NEWS is an application that help to view article and leave you comment on articles.
Articles in our database contains background details , eg: title, topic, author, body, created date and number of votes.
You can also leave your opinion of the article.
All articles are categorised by topic. You can therefore search article by topic.
<br /> <br />



## APIs
- GET /api
- GET /api/topics
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- GET /api/users
- DELETE /api/comments/:comment_id
<br /> <br /> <br /><br />




# Setting

## 1. Clone the repo.  In terminal type :
```
git clone https://github.com/waiwong-nc/nc-new.git
```
<br />

## 2. Install the essential packages. In terminal type :
```
npm install 
```
<br />

## 3. Create environment variables in .env. file
[Please refer to Environment Variables](#environment-variables)
<br /> <br /> <br /> 


## 4. Create database in PSQL
```
 npm run setup-dbs
```
<br />

## 5.  Insert Data to database (seeding). In terminal type :
```
npm run seed
```
<br />

## 6. Test if database work expectedly. In terminal type:
```
npm run test
```

<br /><br /><br /><br />




# Environment Variables
To use the application in test or development mode. you will need to creaet<span style="color:orange"> ***environment varaibles*** </span> in .env. files
<br /><br />

## 1. .env. file to store environment variables
You have to create two .env files --<span style="color:orange"> **.env.test** </span> and <span style="color:orange">**.env.development** </span>.
You will need to set environment variables in the **.env files**. like :
```
PGDATABASE=<database_name_here>
```
<br />

## 2. Create the file via terminal:
###  create and set .env. in terminal: 
```
echo 'PGDATABASE="nc_news_test"'>.env.test 
echo 'PGDATABASE="nc_news"'>.env.development
```
<br />

## 3. Set Manually *(Optional)*
create a file ***.env.test*** , in which type  <span style="color:green">PGDATABASE="nc_news_test"</span>. <br/>
create a file ***.env.development*** , in which type  <span style="color:green">PGDATABASE="nc_news"</span>.



<br/>
<br/>
<br/>
<br/>



# Requirements
The application run best in the following version of Node and Postgres
- Node v16.13.2
- postgres (PostgreSQL) 14.3