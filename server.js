import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import morgan from "morgan";
import cron from "node-cron";

const app = express();
const port = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";

app.use(morgan("dev"));

let saveEmail = async (data) => {
  console.log(data);
  let dataArray = data.split("<div");
  dataArray.map((tiem) => {
    if (tiem.includes("@icloud.com")) {
      let email = "";
      let caRindex = tiem.search("@") - 20;

      for (let index = 0; index < 31; index++) {
        email += tiem.charAt(caRindex);
        caRindex++;
      }

      email = email.slice(email.indexOf(">") + 1);
      email = email.slice(email.indexOf(" ") + 1);
      email = email.slice(email.indexOf(" ") + 1);
      email = email.slice(email.indexOf(" ") + 1);
      if (email.includes('"')) {
        email = "";
      }
      console.log(email);
      try {
        fs.appendFile("email.txt", email + "\n", function (err) {
          if (err) throw err;
          console.log("Updated!");
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
};

let Indexs = {
  twitterIndex: 10,
  linkedin: 10,
};

const handelreqforbing = async (index, sitename) => {
  let respond = await fetch(
    `https://www.bing.com/search?q=site%3a${sitename}+%22%40icloud.com%22&search=&first=${
      index + 1
    }&FORM=PERE1`
  ).catch((error) => {
    console.log(error);
  });

  let data = await respond.text();
  saveEmail(data);
};
const handlrequest = async (index, sitename) => {
  let respond = await fetch(
    `https://www.google.com/search?q=site:${sitename}++%22%40icloud.com%22&newwindow=6&sxsrf=ALiCzsYDPe3Rl9A_CCQ20-uiFMNPqV3hpQ:1653907928112&ei=2KGUYqm6BoCQ9u8PrMuKmAs&start=${index}&sa=N&ved=2ahUKEwiphq-Uh4f4AhUAiP0HHaylArM4FBDy0wN6BAgBEDo&biw=1536&bih=752&dpr=1.25`
  ).catch((error) => {
    console.log(error);
  });

  let data = await respond.text();
  saveEmail(data);
};

//handleReq();

cron.schedule("1 * * * * *", () => {
  console.log("twitter run ");
  //for twitter

  handlrequest(Indexs.twitterIndex, "twitter.com");
  // handelreqforbing(Indexs.twitterIndex, "twitter.com");
  console.log("---------------");
  Indexs.twitterIndex += 10;
});
// for Linkedin
cron.schedule("1 * * * * *", () => {
  console.log("linkedin run ");
  handlrequest(Indexs.linkedin, "linkedin.com");
  //handelreqforbing(Indexs.linkedin, "linkedin.com");
  Indexs.linkedin += 10;
});
// //handelreqforbing(11, "linkedin.com");
//handlrequest(Indexs.twitterIndex, "twitter.com");

app.listen(port, () => {
  console.log("run--------->");
});
