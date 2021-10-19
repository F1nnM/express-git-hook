webhook = require('./index.js');

functionToTest = webhook("https://github.com/F1nnM/express-git-hook", "./test")

req = {
    body: JSON.stringify({
        repository: {
            url: "https://github.com/F1nnM/express-git-hook"
        }
    })
};

res = {locals:{}};

functionToTest(req, res).then(() => {
    console.log(JSON.stringify(res.locals.files))
})
