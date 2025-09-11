const app=require('./src/app');
const connectToDb=require('./src/db/db');
const http=require("http");
connectToDb();
const httpServer=http.createServer(app);

httpServer.listen(3000, () =>
{
    console.log("Server is running on port 3000")
})