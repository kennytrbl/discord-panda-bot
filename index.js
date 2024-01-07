const Discord = require("discord.js");
const puppeteer = require("puppeteer");
const { MessageAttachment } = require("discord.js");
const MongoClient = require("mongodb").MongoClient;
const bot = new Discord.Client();

const prefix = "!";
// const url = ""; //paste mongodb database url

// languages
const c = "761802356420509696";
const cplusplus = "761802113101463552";
const csharp = "775137620388085781";
const golang = "761802484733444096";
const java = "761802009359024128";
const javascript = "761802263890493501";
const matlab = "761803091712016424";
const php = "775138750756945953";
const python = "761802181539397664";
const ruby = "775138938833731584";
const scala = "761802623820496928";
const swift = "775139213858308096";

// pronouns
const sheher = "775127215292940338";
const hehim = "775127950156627979";
const theythem = "775128011690344448";
const other = "775128242151620622";

bot.on("ready", () => {
  console.log("panda bot is online");
  bot.user.setActivity("!help", { type: "LISTENING" });
});

bot.on("message", (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content.includes("hello")) {
    message.channel.send("```hello 👋```");
    return;
  }
  if (!message.content.startsWith(prefix)) {
    return;
  }

  async function scrape(url) {
    message.channel.send("```loading...```");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForXPath(
      '//*[@id="export-chart-element"]/div/section/div[1]/div[1]/div[2]/div'
    );
    const [el] = await page.$x(
      '//*[@id="export-chart-element"]/div/section/div[1]/div[1]/div[2]/div'
    );
    const txt = await el.getProperty("textContent");
    const rawText = await txt.jsonValue();

    message.channel.send("```" + rawText + "\nlink: " + url + "```");

    browser.close();
  }

  let args = message.content.substring(prefix.length).split(" ");
  switch (args[0]) {
    case "btc":
      scrape("https://www.coindesk.com/price/bitcoin");
      break;

    case "eth":
      scrape("https://www.coindesk.com/price/ethereum");
      break;

    case "doge":
      scrape("https://www.coindesk.com/price/dogecoin");
      break;

    case "help":
      if (!message.channel.name.includes("bot-spam")) {
        message.channel.send("```error: invalid channel to send commands```");
        return;
      }
      message.channel.send(
        "```commands:\n!btc, !eth, !doge\n!feed\n!gif, gif <value>\n!mute\n!unmute\n!role, role <value>, role remove <value>```"
      );
      break;

    case "feed":
      if (!message.channel.name.includes("bot-spam")) {
        message.channel.send("```error: invalid channel to send commands```");
        return;
      }
      var counter = 0;
      var date = new Date();
      message.react("❤️");
      var images = [
        "./images/panda.png",
        "./images/panda2.png",
        "./images/panda3.jpg",
        "./images/panda4.jpg",
      ];
      var num = Math.floor(Math.random() * images.length);
      const attachment = new MessageAttachment(images[num]);
      MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("discord-panda-bot");
          dbo
            .collection("feed-counter")
            .find({})
            .toArray(function (err, result) {
              if (err) throw err;
              counter = result.length;
              message.channel.send(
                "```thank you kind stranger!\nso far i have been fed " +
                  counter +
                  " times\nhave a great day!```"
              );
              message.channel.send(attachment);
              var obj = {
                feed: counter,
                user: message.member.user.tag,
                date: date,
              };
              dbo
                .collection("feed-counter")
                .insertOne(obj, function (err, res) {
                  if (err) throw err;
                  db.close();
                });
            });
        }
      );
      break;

    case "gif":
      if (!args[1]) {
        message.channel.send("```error: no second argument```");
      }
      if (args[1] === "popcorn") {
        const attachment = new MessageAttachment("./gifs/popcorn.gif");
        message.channel.send(attachment);
      }
      if (args[1] === "cat") {
        const attachment = new MessageAttachment("./gifs/cat.gif");
        message.channel.send(attachment);
      }
      break;

    case "mute":
      if (!message.member.roles.cache.some((r) => r.name === "officers")) {
        message.channel.send(
          "```error: you do not have permission to use this command```"
        );
        return;
      }
      if (message.member.voice.channel) {
        let channel = message.guild.channels.cache.get(
          message.member.voice.channel.id
        );
        for (const [memberID, member] of channel.members) {
          member.voice.setMute(true);
        }
        message.channel.send("```muted```");
      } else {
        message.reply("```error: join a voice channel first```");
      }
      break;

    case "unmute":
      if (!message.member.roles.cache.some((r) => r.name === "officers")) {
        message.channel.send(
          "```error: you do not have permission to use this command```"
        );
        return;
      }
      if (message.member.voice.channel) {
        let channel = message.guild.channels.cache.get(
          message.member.voice.channel.id
        );
        for (const [memberID, member] of channel.members) {
          member.voice.setMute(false);
        }
        message.channel.send("```unmuted```");
      } else {
        message.reply("```error: join a voice channel first```");
      }
      break;

    case "purge":
      if (!message.member.roles.cache.some((r) => r.name === "officers")) {
        message.channel.send(
          "```error: you do not have permission to use this command```"
        );
        return;
      }
      message.channel.bulkDelete(10);
      break;

    case "role":
      if (!message.channel.name.includes("bot-spam")) {
        message.channel.send("```error: invalid channel to send commands```");
        return;
      }
      if (!args[1]) {
        message.channel.send(
          "```!role <value> to add a role\nfor example, !role javascript\n!role remove <value> to remove a role\nfor example, !role remove javascript" +
            "\nprogramming languages: c, cplusplus, csharp, golang, java\njavascript, matlab, php, python, ruby\nscala, swift" +
            "\npronouns: sheher, hehim, theythem, other```"
        );
        return;
      }
      if (args[1] === "remove") {
        if (!args[2]) {
          message.channel.send("```error: no third argument```");
          return;
        }
        if (args[2] === "c") {
          message.member.roles.remove(c);
          message.channel.send("```c role removed ❌```");
          return;
        }
        if (args[2] === "cplusplus") {
          message.member.roles.remove(cplusplus);
          message.channel.send("```cplusplus role removed ❌```");
          return;
        }
        if (args[2] === "csharp") {
          message.member.roles.remove(csharp);
          message.channel.send("```csharp role removed ❌```");
          return;
        }
        if (args[2] === "golang") {
          message.member.roles.remove(golang);
          message.channel.send("```golang role removed ❌```");
          return;
        }
        if (args[2] === "java") {
          message.member.roles.remove(java);
          message.channel.send("```java role removed ❌```");
          return;
        }
        if (args[2] === "javascript") {
          message.member.roles.remove(javascript);
          message.channel.send("```javascript role removed ❌```");
          return;
        }
        if (args[2] === "matlab") {
          message.member.roles.remove(matlab);
          message.channel.send("```matlab role removed ❌```");
          return;
        }
        if (args[2] === "php") {
          message.member.roles.remove(php);
          message.channel.send("```php role removed ❌```");
          return;
        }
        if (args[2] === "python") {
          message.member.roles.remove(python);
          message.channel.send("```python role removed ❌```");
          return;
        }
        if (args[2] === "ruby") {
          message.member.roles.remove(ruby);
          message.channel.send("```ruby role removed ❌```");
          return;
        }
        if (args[2] === "scala") {
          message.member.roles.remove(scala);
          message.channel.send("```scala role removed ❌```");
          return;
        }
        if (args[2] === "swift") {
          message.member.roles.remove(swift);
          message.channel.send("```swift role removed ❌```");
          return;
        }
        if (args[2] === "sheher") {
          message.member.roles.remove(sheher);
          message.channel.send("```sheher role removed ❌```");
          return;
        }
        if (args[2] === "hehim") {
          message.member.roles.remove(hehim);
          message.channel.send("```hehim role removed ❌```");
          return;
        }
        if (args[2] === "theythem") {
          message.member.roles.remove(theythem);
          message.channel.send("```theythem role removed ❌```");
          return;
        }
        if (args[2] === "other") {
          message.member.roles.remove(other);
          message.channel.send("```other role removed ❌```");
          return;
        } else {
          message.channel.send("```error: invalid third argument```");
          return;
        }
      } else {
        if (args[1] === "c") {
          message.member.roles.add(c);
          message.channel.send("```c role added ✔️```");
          return;
        }
        if (args[1] === "cplusplus") {
          message.member.roles.add(cplusplus);
          message.channel.send("```cplusplus role added ✔️```");
          return;
        }
        if (args[1] === "csharp") {
          message.member.roles.add(csharp);
          message.channel.send("```csharp role added ✔️```");
          return;
        }
        if (args[1] === "golang") {
          message.member.roles.add(golang);
          message.channel.send("```golang role added ✔️```");
          return;
        }
        if (args[1] === "java") {
          message.member.roles.add(java);
          message.channel.send("```java role added ✔️```");
          return;
        }
        if (args[1] === "javascript") {
          message.member.roles.add(javascript);
          message.channel.send("```javascript role added ✔️```");
          return;
        }
        if (args[1] === "matlab") {
          message.member.roles.add(matlab);
          message.channel.send("```matlab role added ✔️```");
          return;
        }
        if (args[1] === "php") {
          message.member.roles.add(php);
          message.channel.send("```php role added ✔️```");
          return;
        }
        if (args[1] === "python") {
          message.member.roles.add(python);
          message.channel.send("```python role added ✔️```");
          return;
        }
        if (args[1] === "ruby") {
          message.member.roles.add(ruby);
          message.channel.send("```ruby role added ✔️```");
          return;
        }
        if (args[1] === "scala") {
          message.member.roles.add(scala);
          message.channel.send("```scala role added ✔️```");
          return;
        }
        if (args[1] === "swift") {
          message.member.roles.add(swift);
          message.channel.send("```swift role added ✔️```");
          return;
        }
        if (args[1] === "sheher") {
          message.member.roles.add(sheher);
          message.channel.send("```sheher role added ✔️```");
          return;
        }
        if (args[1] === "hehim") {
          message.member.roles.add(hehim);
          message.channel.send("```hehim role added ✔️```");
          return;
        }
        if (args[1] === "theythem") {
          message.member.roles.add(theythem);
          message.channel.send("```theythem role added ✔️```");
          return;
        }
        if (args[1] === "other") {
          message.member.roles.add(other);
          message.channel.send("```other role added ✔️```");
          return;
        } else {
          message.channel.send("```error: invalid second argument```");
          return;
        }
      }
      break;
  }
});

bot.login(process.env.TOKEN);
